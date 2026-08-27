// =============================================================================
// Community, Reviews & Forum Operations — Servicios Mallorca
// =============================================================================

import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { db } from "./firebase.ts";

// -----------------------------------------------------------------------------
// Interfaces & Types
// -----------------------------------------------------------------------------

export interface ServiceReview {
  id: string;
  serviceId: string;
  authorUid: string;
  authorName: string;
  authorAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  helpfulCount: number;
  helpfulUsers: string[];
}

export type ForumCategory = "todas" | "recomendaciones" | "preguntas" | "experiencias" | "guias";

export interface ForumTopic {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: ForumCategory;
  authorUid: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  repliesCount: number;
  likesCount: number;
  likedUsers: string[];
}

export interface ForumReply {
  id: string;
  topicId: string;
  content: string;
  authorUid: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  likesCount: number;
  likedUsers: string[];
}

// -----------------------------------------------------------------------------
// Service Reviews Logic
// -----------------------------------------------------------------------------

export async function getServiceReviews(serviceId: string): Promise<ServiceReview[]> {
  try {
    const q = query(collection(db, "reviews"), where("serviceId", "==", serviceId), limit(50));
    const snap = await getDocs(q);
    const reviews = snap.docs.map((docSnap) => {
      const data = docSnap.data();
      let createdStr = new Date().toISOString();
      let createdTime = Date.now();
      if (data.createdAt && typeof data.createdAt.toDate === "function") {
        const d = data.createdAt.toDate();
        createdStr = d.toISOString();
        createdTime = d.getTime();
      } else if (typeof data.createdAt === "string") {
        createdStr = data.createdAt;
        const parsed = new Date(data.createdAt).getTime();
        createdTime = isNaN(parsed) ? 0 : parsed;
      }
      return {
        id: docSnap.id,
        serviceId: data.serviceId || serviceId,
        authorUid: data.authorUid || "",
        authorName: data.authorName || "Usuario",
        authorAvatar: data.authorAvatar || "👤",
        rating: typeof data.rating === "number" ? data.rating : 5,
        comment: data.comment || "",
        createdAt: createdStr,
        _createdTime: createdTime,
        helpfulCount: typeof data.helpfulCount === "number" ? data.helpfulCount : 0,
        helpfulUsers: Array.isArray(data.helpfulUsers) ? data.helpfulUsers : [],
      };
    });

    // In-memory sort by createdAt descending to never require a composite index
    return reviews.sort((a, b) => b._createdTime - a._createdTime);
  } catch (err) {
    console.warn("Notice fetching service reviews:", err);
    return [];
  }
}

export async function addServiceReview(params: {
  serviceId: string;
  authorUid: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  comment: string;
}): Promise<string> {
  const reviewsCol = collection(db, "reviews");
  const docRef = await addDoc(reviewsCol, {
    serviceId: params.serviceId,
    authorUid: params.authorUid,
    authorName: params.authorName,
    authorAvatar: params.authorAvatar || "👤",
    rating: Math.min(5, Math.max(1, params.rating)),
    comment: params.comment.trim(),
    helpfulCount: 0,
    helpfulUsers: [],
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function toggleReviewHelpful(reviewId: string, userUid: string): Promise<boolean> {
  const ref = doc(db, "reviews", reviewId);
  const snap = await getDoc(ref);
  const exists = typeof snap.exists === "function" ? snap.exists() : Boolean(snap.exists);
  if (!exists) return false;

  const data = snap.data() || {};
  const helpfulUsers: string[] = Array.isArray(data.helpfulUsers) ? data.helpfulUsers : [];
  const hasVoted = helpfulUsers.includes(userUid);

  if (hasVoted) {
    await updateDoc(ref, {
      helpfulUsers: arrayRemove(userUid),
      helpfulCount: increment(-1),
    });
    return false;
  } else {
    await updateDoc(ref, {
      helpfulUsers: arrayUnion(userUid),
      helpfulCount: increment(1),
    });
    return true;
  }
}

// -----------------------------------------------------------------------------
// Forum Topics & Replies Logic
// -----------------------------------------------------------------------------

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${randomSuffix}`;
}

export async function getForumTopics(category?: ForumCategory): Promise<ForumTopic[]> {
  try {
    let q;
    if (category && category !== "todas") {
      q = query(
        collection(db, "forum_topics"),
        where("category", "==", category),
        orderBy("createdAt", "desc"),
        limit(50),
      );
    } else {
      q = query(collection(db, "forum_topics"), orderBy("createdAt", "desc"), limit(50));
    }
    const snap = await getDocs(q);
    return snap.docs.map((docSnap) => {
      const data = docSnap.data() || {};
      let createdStr = new Date().toISOString();
      if (data.createdAt && typeof data.createdAt.toDate === "function") {
        createdStr = data.createdAt.toDate().toISOString();
      } else if (typeof data.createdAt === "string") {
        createdStr = data.createdAt;
      }
      return {
        id: docSnap.id,
        slug: data.slug || docSnap.id,
        title: data.title || "",
        content: data.content || "",
        category: data.category || "preguntas",
        authorUid: data.authorUid || "",
        authorName: data.authorName || "Vecino de Mallorca",
        authorAvatar: data.authorAvatar || "🌴",
        createdAt: createdStr,
        repliesCount: typeof data.repliesCount === "number" ? data.repliesCount : 0,
        likesCount: typeof data.likesCount === "number" ? data.likesCount : 0,
        likedUsers: Array.isArray(data.likedUsers) ? data.likedUsers : [],
      };
    });
  } catch (err) {
    console.error("Error fetching forum topics:", err);
    return [];
  }
}

export async function getForumTopicBySlug(slug: string): Promise<ForumTopic | null> {
  try {
    const q = query(collection(db, "forum_topics"), where("slug", "==", slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) {
      // Fallback: try by document ID
      const directSnap = await getDoc(doc(db, "forum_topics", slug));
      const directExists = typeof directSnap.exists === "function" ? directSnap.exists() : Boolean(directSnap.exists);
      if (!directExists) return null;
      const data = directSnap.data() || {};
      let createdStr = new Date().toISOString();
      if (data.createdAt && typeof data.createdAt.toDate === "function") {
        createdStr = data.createdAt.toDate().toISOString();
      }
      return {
        id: directSnap.id,
        slug: data.slug || directSnap.id,
        title: data.title || "",
        content: data.content || "",
        category: data.category || "preguntas",
        authorUid: data.authorUid || "",
        authorName: data.authorName || "Vecino de Mallorca",
        authorAvatar: data.authorAvatar || "🌴",
        createdAt: createdStr,
        repliesCount: data.repliesCount || 0,
        likesCount: data.likesCount || 0,
        likedUsers: Array.isArray(data.likedUsers) ? data.likedUsers : [],
      };
    }

    const docSnap = snap.docs[0];
    const data = docSnap.data() || {};
    let createdStr = new Date().toISOString();
    if (data.createdAt && typeof data.createdAt.toDate === "function") {
      createdStr = data.createdAt.toDate().toISOString();
    }
    return {
      id: docSnap.id,
      slug: data.slug || docSnap.id,
      title: data.title || "",
      content: data.content || "",
      category: data.category || "preguntas",
      authorUid: data.authorUid || "",
      authorName: data.authorName || "Vecino de Mallorca",
      authorAvatar: data.authorAvatar || "🌴",
      createdAt: createdStr,
      repliesCount: data.repliesCount || 0,
      likesCount: data.likesCount || 0,
      likedUsers: Array.isArray(data.likedUsers) ? data.likedUsers : [],
    };
  } catch (err) {
    console.error("Error fetching topic by slug:", err);
    return null;
  }
}

export async function createForumTopic(params: {
  title: string;
  content: string;
  category?: ForumCategory;
  authorUid: string;
  authorName: string;
  authorAvatar?: string;
}): Promise<{ id: string; slug: string }> {
  const slug = generateSlug(params.title);
  const docRef = await addDoc(collection(db, "forum_topics"), {
    slug,
    title: params.title.trim(),
    content: params.content.trim(),
    category: params.category || "preguntas",
    authorUid: params.authorUid,
    authorName: params.authorName,
    authorAvatar: params.authorAvatar || "🌴",
    createdAt: serverTimestamp(),
    repliesCount: 0,
    likesCount: 0,
    likedUsers: [],
  });
  return { id: docRef.id, slug };
}

export async function toggleTopicLike(topicId: string, userUid: string): Promise<boolean> {
  const ref = doc(db, "forum_topics", topicId);
  const snap = await getDoc(ref);
  const exists = typeof snap.exists === "function" ? snap.exists() : Boolean(snap.exists);
  if (!exists) return false;

  const data = snap.data() || {};
  const likedUsers: string[] = Array.isArray(data.likedUsers) ? data.likedUsers : [];
  const hasLiked = likedUsers.includes(userUid);

  if (hasLiked) {
    await updateDoc(ref, {
      likedUsers: arrayRemove(userUid),
      likesCount: increment(-1),
    });
    return false;
  } else {
    await updateDoc(ref, {
      likedUsers: arrayUnion(userUid),
      likesCount: increment(1),
    });
    return true;
  }
}

export async function getForumReplies(topicId: string): Promise<ForumReply[]> {
  try {
    const q = query(collection(db, "forum_replies"), where("topicId", "==", topicId), limit(100));
    const snap = await getDocs(q);
    const replies = snap.docs.map((docSnap) => {
      const data = docSnap.data();
      let createdStr = new Date().toISOString();
      let createdTime = Date.now();
      if (data.createdAt && typeof data.createdAt.toDate === "function") {
        const d = data.createdAt.toDate();
        createdStr = d.toISOString();
        createdTime = d.getTime();
      } else if (typeof data.createdAt === "string") {
        createdStr = data.createdAt;
        createdTime = new Date(data.createdAt).getTime() || Date.now();
      }
      return {
        id: docSnap.id,
        topicId: data.topicId || topicId,
        content: data.content || "",
        authorUid: data.authorUid || "",
        authorName: data.authorName || "Vecino",
        authorAvatar: data.authorAvatar || "💬",
        createdAt: createdStr,
        _createdTime: createdTime,
        likesCount: typeof data.likesCount === "number" ? data.likesCount : 0,
        likedUsers: Array.isArray(data.likedUsers) ? data.likedUsers : [],
      };
    });

    return replies.sort((a, b) => a._createdTime - b._createdTime);
  } catch (err) {
    console.warn("Notice fetching forum replies:", err);
    return [];
  }
}

export async function addForumReply(params: {
  topicId: string;
  content: string;
  authorUid: string;
  authorName: string;
  authorAvatar?: string;
}): Promise<string> {
  const docRef = await addDoc(collection(db, "forum_replies"), {
    topicId: params.topicId,
    content: params.content.trim(),
    authorUid: params.authorUid,
    authorName: params.authorName,
    authorAvatar: params.authorAvatar || "💬",
    createdAt: serverTimestamp(),
    likesCount: 0,
    likedUsers: [],
  });

  // Increment replies counter on topic
  try {
    const topicRef = doc(db, "forum_topics", params.topicId);
    await updateDoc(topicRef, {
      repliesCount: increment(1),
    });
  } catch (err) {
    console.warn("Could not update topic reply count:", err);
  }

  return docRef.id;
}
