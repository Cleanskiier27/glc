import { spawn } from 'child_process';

const port = process.env.PORT || '3000';
const baseUrl = `http://localhost:${port}`;

const pages = [
  { label: 'Main Portal', url: `${baseUrl}/` },
  { label: 'Indexed Docs', url: `${baseUrl}/documentation.html` },
  { label: 'Docs Index API', url: `${baseUrl}/api/docs-index` },
  { label: 'Dashboard', url: `${baseUrl}/dashboard` }
];

function tryOpen(url) {
  const platform = process.platform;

  if (platform === 'win32') {
    return spawn('cmd', ['/c', 'start', '', url], { stdio: 'ignore', detached: true });
  }

  if (platform === 'darwin') {
    return spawn('open', [url], { stdio: 'ignore', detached: true });
  }

  return spawn('xdg-open', [url], { stdio: 'ignore', detached: true });
}

console.log('NetworkBuster Preview Viewer');
console.log('---------------------------');
for (const page of pages) {
  console.log(`${page.label}: ${page.url}`);
}

if (process.argv.includes('--open')) {
  try {
    tryOpen(`${baseUrl}/documentation.html`).unref();
    console.log('Opening Indexed Docs in your browser...');
  } catch {
    console.log('Could not auto-open browser. Open the URL manually.');
  }
}
