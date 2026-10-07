import dns from "node:dns/promises";
import { SERVICES } from "../src/data/services/index.ts";

const resolver = new dns.Resolver({ timeout: 2000, tries: 1 });
resolver.setServers(["8.8.8.8", "1.1.1.1"]);

interface SuspectBusiness {
  slug: string;
  name: string;
  sector: string;
  category: string;
  phone?: string;
  website?: string;
  dnsOk: boolean;
  dnsError?: string;
  hasGoogleMaps: boolean;
  score: number;
  reasons: string[];
}

export async function detectFictitiousBusinesses() {
  console.log(`🔍 [Audit Fictitious Signals] Evaluando ${SERVICES.length} servicios...`);

  // 1. Extraer dominios únicos
  const domainStatus = new Map<string, { ok: boolean; error?: string }>();
  for (const s of SERVICES) {
    if (s.website && s.website.startsWith("http")) {
      try {
        const u = new URL(s.website);
        const host = u.hostname.toLowerCase();
        if (!domainStatus.has(host)) {
          domainStatus.set(host, { ok: false });
        }
      } catch {}
    }
  }

  const hosts = Array.from(domainStatus.keys());
  console.log(`📡 Resolviendo ${hosts.length} dominios en paralelo...`);
  const concurrency = 30;
  for (let i = 0; i < hosts.length; i += concurrency) {
    const chunk = hosts.slice(i, i + concurrency);
    await Promise.all(
      chunk.map(async (host) => {
        try {
          await resolver.resolve(host);
          domainStatus.set(host, { ok: true });
        } catch {
          try {
            await resolver.resolve4(host);
            domainStatus.set(host, { ok: true });
          } catch (e2: any) {
            domainStatus.set(host, { ok: false, error: e2.code || e2.message });
          }
        }
      }),
    );
  }

  const suspects: SuspectBusiness[] = [];

  for (const s of SERVICES) {
    const reasons: string[] = [];
    let dnsOk = true;
    let dnsError: string | undefined;

    if (s.website && s.website.startsWith("http")) {
      try {
        const u = new URL(s.website);
        const host = u.hostname.toLowerCase();
        const stat = domainStatus.get(host);
        if (stat && !stat.ok) {
          dnsOk = false;
          dnsError = stat.error;
          reasons.push(`Dominio no resuelve DNS (${host})`);
        }
      } catch {
        dnsOk = false;
        dnsError = "URL_MALFORMED";
        reasons.push("URL malformada");
      }
    }

    const isKeywordStuffed =
      /24\s*h|urgencias|barato|economico|reparacion.*express|reformas.*integrales.*palma.*24|fontanero.*urgente/i.test(
        s.name,
      );
    if (isKeywordStuffed) {
      reasons.push("Nombre con keyword-stuffing");
    }

    if ((s.confidenceScore ?? 100) < 85) {
      reasons.push(`Score bajo (${s.confidenceScore}%)`);
    }

    if (!dnsOk && !s.googleMapsUrl) {
      reasons.push("Sin ficha Maps Y sin dominio DNS");
    }

    if (reasons.length > 0) {
      suspects.push({
        slug: s.slug,
        name: s.name,
        sector: s.category,
        category: s.category,
        phone: s.phone,
        website: s.website,
        dnsOk,
        dnsError,
        hasGoogleMaps: !!s.googleMapsUrl,
        score: s.confidenceScore ?? 0,
        reasons,
      });
    }
  }

  console.log(`\n=======================================================`);
  console.log(`📊 Servicios con incidencias de DNS o señales dudosas: ${suspects.length} / ${SERVICES.length}`);
  console.log(`=======================================================\n`);

  // Agrupar por sector
  const bySector: Record<string, SuspectBusiness[]> = {};
  for (const item of suspects) {
    if (!bySector[item.sector]) bySector[item.sector] = [];
    bySector[item.sector].push(item);
  }

  for (const [sector, items] of Object.entries(bySector)) {
    console.log(`\n📁 [Sector: ${sector}] (${items.length} incidencias):`);
    for (const item of items) {
      console.log(`  - [${item.slug}] ${item.name}`);
      console.log(`    Web: ${item.website || "N/A"} | Maps: ${item.hasGoogleMaps ? "SÍ" : "NO"}`);
      console.log(`    Motivos: ${item.reasons.join(", ")}`);
    }
  }

  return suspects;
}

if (process.argv[1]?.endsWith("detect-fictitious-businesses.ts")) {
  detectFictitiousBusinesses();
}
