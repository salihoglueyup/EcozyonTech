import { prerenderToNodeStream } from 'react-dom/static';
import { StaticRouter } from 'react-router-dom';
import AppShell from './app/AppShell';

function streamToString(stream) {
  return new Promise((resolve, reject) => {
    let data = '';
    stream.setEncoding('utf8');
    stream.on('data', (c) => (data += c));
    stream.on('end', () => resolve(data));
    stream.on('error', reject);
  });
}

// Prerender one route to a full HTML body string. `prerenderToNodeStream`
// resolves all Suspense (lazy pages + globes) before emitting, so the
// markup is complete and indexable. Effects (Three.js, scroll) don't run
// during prerender — only on the hydrated client.
export async function render(url) {
  const { prelude } = await prerenderToNodeStream(
    <StaticRouter location={url}>
      <AppShell />
    </StaticRouter>,
  );
  return streamToString(prelude);
}
