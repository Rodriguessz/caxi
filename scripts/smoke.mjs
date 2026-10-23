// Smoke test reutilizável: local (docker compose) e, depois, no CD do piloto.
// Uso: node scripts/smoke.mjs [baseUrl]   (padrão: http://localhost:8080)
const base = (process.argv[2] ?? 'http://localhost:8080').replace(/\/$/, '');
const deadline = Date.now() + 90_000;

const checks = [
  ['SPA responde', '/', (r, body) => r.ok && body.includes('<div id="root">')],
  ['API pronta (banco ok)', '/api/health/ready', (r) => r.ok],
  ['Seed aplicado', '/api/barracas/demo', (r, body) => r.ok && JSON.parse(body).slug === 'demo'],
];

async function attempt([name, path, ok]) {
  while (true) {
    try {
      const r = await fetch(base + path);
      const body = await r.text();
      if (ok(r, body)) return console.log(`✔ ${name}`);
    } catch {
      // serviço ainda subindo
    }
    if (Date.now() > deadline) throw new Error(`✘ ${name} (${base}${path})`);
    await new Promise((res) => setTimeout(res, 2000));
  }
}

for (const check of checks) await attempt(check);
console.log('smoke test ok');
