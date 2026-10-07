import dns from "node:dns/promises";
import { SERVICES } from "../src/data/services/index.ts";

// Configurar resolver rápido con timeout
const resolver = new dns.Resolver({ timeout: 2500, tries: 1 });
resolver.setServers(["8.8.8.8", "1.1.1.1"]);

interface DomainResult {
  domain: string;
  ok: boolean;
  error?: string;
  services: { slug: string; name: string; sector: string; url: string }[];
}

export async function checkAllDomainsDNS() {
  console.log(`🌐 [DNS Auditor] Verificando dominios de los ${SERVICES.length} servicios...`);

  const domainMap = new Map<string, { slug: string; name: string; sector: string; url: string }[]>();

  for (const s of SERVICES) {
    if (s.website && s.website.startsWith("http")) {
      try {
        const u = new URL(s.website);
        const host = u.hostname.toLowerCase();
        if (!domainMap.has(host)) {
          domainMap.set(host, []);
        }
        domainMap.get(host)!.push({
          slug: s.slug,
          name: s.name,
          sector: s.category,
          url: s.website,
        });
      } catch {
        // Ignorar URLs malformadas
      }
    }
  }

  const hosts = Array.from(domainMap.keys());
  console.log(`📡 Total de dominios únicos a auditar: ${hosts.length}`);

  const results: DomainResult[] = [];
  const concurrency = 25;

  for (let i = 0; i < hosts.length; i += concurrency) {
    const chunk = hosts.slice(i, i + concurrency);
    const chunkResults = await Promise.all(
      chunk.map(async (host) => {
        const services = domainMap.get(host)!;
        try {
          await resolver.resolve(host);
          return { domain: host, ok: true, services };
        } catch {
          // Intentar lookup por si es CNAME o alias sin registro A directo
          try {
            await resolver.resolve4(host);
            return { domain: host, ok: true, services };
          } catch (innerErr: any) {
            return {
              domain: host,
              ok: false,
              error: innerErr.code || innerErr.message,
              services,
            };
          }
        }
      }),
    );
    results.push(...chunkResults);
    process.stdout.write(`\rProgreso: ${Math.min(i + concurrency, hosts.length)}/${hosts.length} dominios...`);
  }

  console.log("\n\n=======================================================");
  const failed = results.filter((r) => !r.ok);
  console.log(`🔴 Dominios que NO resuelven por DNS: ${failed.length} / ${hosts.length}`);
  console.log("=======================================================\n");

  for (const f of failed) {
    console.log(`❌ Dominio: ${f.domain} (${f.error})`);
    for (const s of f.services) {
      console.log(`   - [${s.sector}] ${s.name} (${s.slug}) -> ${s.url}`);
    }
  }

  return { total: hosts.length, failed };
}

if (process.argv[1]?.endsWith("check-all-domains-dns.ts")) {
  checkAllDomainsDNS();
}
