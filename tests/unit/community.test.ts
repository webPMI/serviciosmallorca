/**
 * Tests para src/lib/community.ts
 *
 * Motor de comunidad (reseñas + foro) con Firestore mockeado:
 *   - Normalización defensiva de timestamps (toDate | ISO string | inválido)
 *   - Valores por defecto y clamping de ratings (GR-11: cero datos fake)
 *   - Ordenamientos in-memory (sin índices compuestos) y rutas de error
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const fb = vi.hoisted(() => ({
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  collection: (_db: unknown, name: string) => ({ kind: "collection", name }),
  doc: (_db: unknown, name: string, id?: string) => ({ kind: "doc", name, id }),
  query: (...parts: unknown[]) => ({ kind: "query", parts }),
  where: (...args: unknown[]) => args,
  orderBy: (...args: unknown[]) => args,
  limit: (n: number) => ({ limit: n }),
  serverTimestamp: () => ({ serverTimestamp: true }),
  arrayUnion: (v: string) => ({ union: v }),
  arrayRemove: (v: string) => ({ remove: v }),
  increment: (n: number) => ({ increment: n }),
  addDoc: fb.addDoc,
  getDocs: fb.getDocs,
  getDoc: fb.getDoc,
  updateDoc: fb.updateDoc,
}));

vi.mock("../../src/lib/firebase", () => ({ db: { kind: "db" } }));

import {
  getServiceReviews,
  addServiceReview,
  toggleReviewHelpful,
  getForumTopics,
  getForumTopicBySlug,
  createForumTopic,
  toggleTopicLike,
  getForumReplies,
  addForumReply,
} from "../../src/lib/community";

function snapOf(rows: Array<{ id: string; data: Record<string, unknown> }>) {
  return {
    empty: rows.length === 0,
    docs: rows.map((r) => ({ id: r.id, data: () => r.data })),
  };
}

beforeEach(() => {
  fb.addDoc.mockReset();
  fb.getDocs.mockReset();
  fb.getDoc.mockReset();
  fb.updateDoc.mockReset();
});

afterEach(() => vi.restoreAllMocks());

describe("Service Reviews · getServiceReviews", () => {
  it("normaliza Timestamp de Firestore vía toDate()", async () => {
    const d = new Date("2026-03-01T10:00:00Z");
    fb.getDocs.mockResolvedValue(
      snapOf([{ id: "r1", data: { authorName: "Maria", rating: 4, createdAt: { toDate: () => d } } }]),
    );
    const reviews = await getServiceReviews("svc-1");
    expect(reviews[0].createdAt).toBe(d.toISOString());
    expect(reviews[0].authorAvatar).toBe("👤"); // default cuando falta
  });

  it("acepta strings ISO y degrada fechas inválidas a 'now' sin romper el orden", async () => {
    fb.getDocs.mockResolvedValue(
      snapOf([
        { id: "invalid", data: { createdAt: "no-es-fecha" } },
        { id: "iso", data: { createdAt: "2026-01-15T08:00:00.000Z" } },
      ]),
    );
    const reviews = await getServiceReviews("svc-2");
    // ISO → primero, inválido (now) → último; ninguno lanza excepción
    expect(reviews.map((r) => r.id)).toEqual(["iso", "invalid"]);
    expect(reviews[1].createdAt).toBe("no-es-fecha");
  });

  it("aplica defaults completos ante documentos vacíos", async () => {
    fb.getDocs.mockResolvedValue(snapOf([{ id: "r-empty", data: {} }]));
    const [review] = await getServiceReviews("svc-3");
    expect(review).toMatchObject({
      id: "r-empty",
      serviceId: "svc-3",
      rating: 5,
      comment: "",
      helpfulCount: 0,
      helpfulUsers: [],
    });
  });

  it("devuelve [] avisando por consola si Firestore falla", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      fb.getDocs.mockRejectedValue(new Error("offline"));
      expect(await getServiceReviews("svc-err")).toEqual([]);
      expect(warnSpy).toHaveBeenCalled();
    } finally {
      warnSpy.mockRestore();
    }
  });
});

describe("Service Reviews · addServiceReview", () => {
  it.each([
    [0, 1],
    [3, 3],
    [99, 5],
  ])("clampa rating %i dentro del rango [1..5]", async (input, expected) => {
    fb.addDoc.mockResolvedValue({ id: `rev-${expected}` });
    await addServiceReview({
      serviceId: "svc-x",
      authorUid: "u-1",
      authorName: "Tester",
      rating: input,
      comment: "  Con espacios  ",
    });
    const payload = fb.addDoc.mock.calls[0][1];
    expect(payload.rating).toBe(expected);
    expect(payload.comment).toBe("Con espacios");
    expect(payload.authorAvatar).toBe("👤");
  });
});

describe("Service Reviews · toggleReviewHelpful", () => {
  it("primer voto: añade usuario e incrementa contador (true)", async () => {
    fb.getDoc.mockResolvedValue({ exists: true, data: () => ({ helpfulUsers: [], helpfulCount: 0 }) });
    const voted = await toggleReviewHelpful("rev-1", "voter-a");
    expect(voted).toBe(true);
    const [, payload] = fb.updateDoc.mock.calls[0];
    expect(payload).toEqual({ helpfulUsers: { union: "voter-a" }, helpfulCount: { increment: 1 } });
  });

  it("segundo voto del mismo usuario lo retira (false)", async () => {
    fb.getDoc.mockResolvedValue({
      exists: true,
      data: () => ({ helpfulUsers: ["voter-a"], helpfulCount: 1 }),
    });
    const voted = await toggleReviewHelpful("rev-1", "voter-a");
    expect(voted).toBe(false);
    expect(fb.updateDoc.mock.calls[0][1]).toEqual({
      helpfulUsers: { remove: "voter-a" },
      helpfulCount: { increment: -1 },
    });
  });

  it("reseña inexistente devuelve false sin escribir nada", async () => {
    fb.getDoc.mockResolvedValue({ exists: false, data: () => undefined });
    expect(await toggleReviewHelpful("rev-404", "u")).toBe(false);
    expect(fb.updateDoc).not.toHaveBeenCalled();
  });
});

describe("Forum · getForumTopics", () => {
  it("mapea documentos con defaults seguros y orden remoto respetado", async () => {
    fb.getDocs.mockResolvedValue(
      snapOf([
        { id: "t1", data: { title: "Pregunta real", createdAt: "2026-02-01T00:00:00.000Z" } },
        { id: "t2", data: {} }, // documento corrupto → defaults
      ]),
    );
    const topics = await getForumTopics();
    expect(topics[0]).toMatchObject({ id: "t1", category: "preguntas", authorName: "Vecino de Mallorca" });
    expect(topics[1]).toMatchObject({
      id: "t2",
      title: "",
      repliesCount: 0,
      likedUsers: [],
      authorAvatar: "🌴",
    });
  });

  it("con categoría específica consulta esa faceta; con fallo devuelve []", async () => {
    fb.getDocs.mockResolvedValueOnce(snapOf([]));
    await getForumTopics("recomendaciones");
    expect((fb.getDocs.mock.calls[0][0] as { kind?: string }).kind).toBe("query");

    fb.getDocs.mockRejectedValue(new Error("denied"));
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(await getForumTopics("guias")).toEqual([]);
      expect(errSpy).toHaveBeenCalled();
    } finally {
      errSpy.mockRestore();
    }
  });
});

describe("Forum · getForumTopicBySlug", () => {
  it("resuelve por slug consultando primero la colección", async () => {
    fb.getDocs.mockResolvedValue(snapOf([{ id: "t9", data: { slug: "mi-slug", title: "T" } }]));
    const topic = await getForumTopicBySlug("mi-slug");
    expect(topic?.id).toBe("t9");
  });

  it("fallback por document ID si el índice de slugs no lo encuentra", async () => {
    fb.getDocs.mockResolvedValue({ empty: true, docs: [] });
    fb.getDoc.mockResolvedValue({
      exists: true,
      id: "t-doc-id",
      data: () => ({ createdAt: { toDate: () => new Date("2026-01-01T00:00:00Z") } }),
    });
    const topic = await getForumTopicBySlug("t-doc-id");
    expect(topic).toMatchObject({ id: "t-doc-id", slug: "t-doc-id" });
    expect(topic?.createdAt).toBe(new Date("2026-01-01T00:00:00Z").toISOString());
  });

  it("devuelve null cuando no existe ni por slug ni por ID", async () => {
    fb.getDocs.mockResolvedValue({ empty: true, docs: [] });
    fb.getDoc.mockResolvedValue({ exists: false, data: () => undefined });
    expect(await getForumTopicBySlug("nada")).toBeNull();
  });
});

describe("Forum · createForumTopic", () => {
  it("genera slug kebab-case trilingüe-safe, recorta textos y cero contadores", async () => {
    fb.addDoc.mockResolvedValue({ id: "new-id-1" });
    const result = await createForumTopic({
      title: "¿Mejores estudios de tatuaje en Palma?",
      content: "  Busco black & grey  ",
      authorUid: "u-5",
      authorName: "Laura",
    });
    expect(result.id).toBe("new-id-1");
    expect(result.slug).toMatch(/^mejores-estudios-de-tatuaje-en-palma-[a-z0-9]{4}$/);
    const payload = fb.addDoc.mock.calls[0][1];
    expect(payload.title).toBe("¿Mejores estudios de tatuaje en Palma?");
    expect(payload.content).toBe("Busco black & grey");
    expect(payload.category).toBe("preguntas"); // default
    expect(payload.repliesCount).toBe(0);
    expect(payload.likesCount).toBe(0);
    expect(payload.createdAt).toEqual({ serverTimestamp: true });
  });

  it("acepta categoría explícita del foro comunitario", async () => {
    fb.addDoc.mockResolvedValue({ id: "id-2" });
    const res = await createForumTopic({
      title: "Guía veranos en Sóller",
      content: "Ideas",
      category: "guias",
      authorUid: "u",
      authorName: "N",
    });
    expect(res.slug.startsWith("guia-veranos-en-soller")).toBe(true);
    expect(fb.addDoc.mock.calls[0][1].category).toBe("guias");
  });
});

describe("Forum · toggleTopicLike", () => {
  it("like alterna igual que helpful en reseñas; like inexistente no escribe", async () => {
    fb.getDoc.mockResolvedValue({ exists: true, data: () => ({ likedUsers: ["u-a"], likesCount: 1 }) });
    expect(await toggleTopicLike("t1", "u-b")).toBe(true); // nuevo like
    expect(fb.updateDoc.mock.calls[0][1]).toEqual({ likedUsers: { union: "u-b" }, likesCount: { increment: 1 } });

    expect(await toggleTopicLike("t1", "u-a")).toBe(false); // like repetido se retira
    expect(fb.updateDoc.mock.calls[1][1]).toEqual({ likedUsers: { remove: "u-a" }, likesCount: { increment: -1 } });

    fb.getDoc.mockResolvedValue({ exists: false, data: () => undefined });
    expect(await toggleTopicLike("nope", "u")).toBe(false);
  });
});

describe("Forum · getForumReplies / addForumReply", () => {
  it("getForumReplies ordena ASCENDENTE (hilo cronológico) con defaults y toDate", async () => {
    const d1 = new Date("2026-05-01T00:00:00.000Z");
    const d2 = new Date("2026-05-02T00:00:00.000Z");
    fb.getDocs.mockResolvedValue(
      snapOf([
        { id: "rep2", data: { createdAt: { toDate: () => d2 } } },
        { id: "rep1", data: { createdAt: { toDate: () => d1 } } },
      ]),
    );
    const replies = await getForumReplies("t-topic");
    expect(replies.map((r) => r.id)).toEqual(["rep1", "rep2"]);
    expect(replies[0].authorAvatar).toBe("💬");
  });

  it("getForumReplies captura errores y devuelve array vacío con advertencia segura", async () => {
    fb.getDocs.mockRejectedValue(new Error("network failure"));
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const replies = await getForumReplies("t-error-topic");
    expect(replies).toEqual([]);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("addForumReply incrementa repliesCount y tolera fallo del contador (persistencia garantizada)", async () => {
    fb.addDoc.mockResolvedValue({ id: "reply-7" });
    const first = await addForumReply({ topicId: "t5", content: "Hola", authorUid: "u", authorName: "A" });
    expect(first).toBe("reply-7");
    expect(fb.updateDoc.mock.calls[0][1].repliesCount).toEqual({ increment: 1 });

    // segundo intento: el updateDoc del contador falla → el reply igualmente se crea
    fb.updateDoc.mockRejectedValue(new Error("race condition"));
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const second = await addForumReply({ topicId: "t5", content: "Otra", authorUid: "u", authorName: "A" });
      expect(second).toBe("reply-7");
      expect(warnSpy).toHaveBeenCalled();
    } finally {
      warnSpy.mockRestore();
    }
  });

  it("addForumReply recorta el contenido y aplica avatar por defecto", async () => {
    fb.addDoc.mockResolvedValue({ id: "reply-8" });
    await addForumReply({ topicId: "t9", content: "   respuesta   ", authorUid: "u2", authorName: "B" });
    const payload = fb.addDoc.mock.calls[0][1];
    expect(payload.content).toBe("respuesta");
    expect(payload.authorAvatar).toBe("💬");
    expect(payload.likedUsers).toEqual([]);
  });
});
