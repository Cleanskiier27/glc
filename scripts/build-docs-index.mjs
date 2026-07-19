import { readdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const outputPath = path.join(repoRoot, 'web-app', 'docs-index.json');

const docsRoot = path.join(repoRoot, 'docs');
const azureDocsRoot = path.join(repoRoot, '.azure', 'documentation');

const titleOverrides = new Map([
  ['technical-specs/mathematical-models.md', 'Mathematical Models & Equations']
]);

function toTitle(relativePath) {
  const normalizedPath = relativePath.replace(/\\/g, '/');
  const override = titleOverrides.get(normalizedPath);
  if (override) {
    return override;
  }

  const base = path.basename(normalizedPath, path.extname(normalizedPath));
  const words = base
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);

  return words
    .map((word) => {
      if (/^[A-Z0-9]{2,}$/.test(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

async function walkMarkdownFiles(rootDir, baseTargetDir) {
  const files = [];
  async function visit(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === '.git' || entry.name === 'node_modules') {
          continue;
        }
        await visit(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const relativePath = path.relative(rootDir, fullPath);
        files.push({
          title: toTitle(relativePath),
          file: relativePath.replace(/\\/g, '/'),
          url: path.posix.join(baseTargetDir, relativePath.replace(/\\/g, '/'))
        });
      }
    }
  }

  await visit(rootDir);
  files.sort((a, b) => a.file.localeCompare(b.file));
  return files;
}

async function collectRootDocs() {
  const items = [];
  const entries = await readdir(repoRoot, { withFileTypes: true });
  const filenames = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .filter((filename) => !filename.startsWith('.'))
    .filter((filename) => filename !== 'LICENSE.md')
    .sort();

  for (const filename of filenames) {
    const fullPath = path.join(repoRoot, filename);
    try {
      await access(fullPath);
    } catch {
      continue;
    }

    items.push({
      title: toTitle(filename),
      file: filename,
      url: path.posix.join('root-docs', filename)
    });
  }

  return items.sort((a, b) => a.file.localeCompare(b.file));
}

async function buildIndex() {
  const [docsItems, azureItems, rootItems] = await Promise.all([
    walkMarkdownFiles(docsRoot, 'docs-files'),
    walkMarkdownFiles(azureDocsRoot, 'azure-docs'),
    collectRootDocs()
  ]);

  const index = {
    generatedAt: new Date().toISOString(),
    total: docsItems.length + azureItems.length + rootItems.length,
    sections: [
      { id: 'docs', label: 'Core Docs', items: docsItems },
      { id: 'azure', label: 'Azure Docs', items: azureItems },
      { id: 'root', label: 'Root Guides', items: rootItems }
    ]
  };

  await writeFile(outputPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
  return index;
}

buildIndex()
  .then((index) => {
    console.log(`Wrote ${index.total} documentation entries to ${path.relative(repoRoot, outputPath)}`);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
