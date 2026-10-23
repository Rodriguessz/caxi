import { useEffect, useState } from 'react';

type Barraca = { nome: string; slug: string };

export function App() {
  const [api, setApi] = useState<'verificando' | 'ok' | 'indisponível'>('verificando');
  const [barraca, setBarraca] = useState<Barraca | null>(null);

  useEffect(() => {
    fetch('/api/health/ready')
      .then((r) => setApi(r.ok ? 'ok' : 'indisponível'))
      .catch(() => setApi('indisponível'));
    fetch('/api/barracas/demo')
      .then((r) => (r.ok ? r.json() : null))
      .then(setBarraca)
      .catch(() => setBarraca(null));
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 16, maxWidth: 480, margin: '0 auto' }}>
      <h1>Caxi</h1>
      <p>API: <strong>{api}</strong></p>
      <p>Barraca de demonstração: <strong>{barraca?.nome ?? '—'}</strong></p>
    </main>
  );
}
