import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const webRoot = path.join(repoRoot, 'web-app');

const DOC_EXTENSION = '.md';

function toTitle(fileName) {
  const withoutExt = fileName.replace(/\.md$/i, '');
  return withoutExt
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, ch => ch.toUpperCase());
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function emptyDir(dirPath) {
  await fs.rm(dirPath, { recursive: true, force: true });
  await ensureDir(dirPath);
}

async function copyDir(source, destination) {
  await fs.cp(source, destination, { recursive: true });
}

async function collectMarkdownFiles(baseDir, webBasePath, prefix = '') {
  const entries = await fs.readdir(baseDir, { withFileTypes: true });
  const docs = [];

  for (const entry of entries) {
    const absolutePath = path.join(baseDir, entry.name);
    const relativePath = prefix ? path.posix.join(prefix, entry.name) : entry.name;

    if (entry.isDirectory()) {
      const nested = await collectMarkdownFiles(absolutePath, webBasePath, relativePath);
      docs.push(...nested);
      continue;
    }

    if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== DOC_EXTENSION) {
      continue;
    }

    docs.push({
      title: toTitle(entry.name),
      file: relativePath,
      url: `${webBasePath}/${relativePath.replace(/\\/g, '/')}`
    });
  }

  return docs.sort((a, b) => a.file.localeCompare(b.file));
}

async function collectRootMarkdownFiles() {
  const entries = await fs.readdir(repoRoot, { withFileTypes: true });
  return entries
    .filter(entry => entry.isFile() && path.extname(entry.name).toLowerCase() === DOC_EXTENSION)
    .map(entry => ({
      title: toTitle(entry.name),
      file: entry.name,
      url: `root-docs/${entry.name}`
    }))
    .sort((a, b) => a.file.localeCompare(b.file));
}

async function main() {
  const sourceDocs = path.join(repoRoot, 'docs');
  const sourceAzureDocs = path.join(repoRoot, '.azure', 'documentation');

  const targetDocs = path.join(webRoot, 'docs-files');
  const targetAzureDocs = path.join(webRoot, 'azure-docs');
  const targetRootDocs = path.join(webRoot, 'root-docs');

  await emptyDir(targetDocs);
  await emptyDir(targetAzureDocs);
  await emptyDir(targetRootDocs);

  await copyDir(sourceDocs, targetDocs);
  await copyDir(sourceAzureDocs, targetAzureDocs);

  const rootDocs = await collectRootMarkdownFiles();
  for (const doc of rootDocs) {
    const src = path.join(repoRoot, doc.file);
    const dst = path.join(targetRootDocs, doc.file);
    await fs.copyFile(src, dst);
  }

  const docsFiles = await collectMarkdownFiles(sourceDocs, 'docs-files');
  const azureFiles = await collectMarkdownFiles(sourceAzureDocs, 'azure-docs');

  const sections = [
    { id: 'docs', label: 'Core Docs', items: docsFiles },
    { id: 'azure', label: 'Azure Docs', items: azureFiles },
    { id: 'root', label: 'Root Guides', items: rootDocs }
  ];

  const total = sections.reduce((sum, section) => sum + section.items.length, 0);
  const payload = {
    generatedAt: new Date().toISOString(),
    total,
    sections
  };

  const indexPath = path.join(webRoot, 'docs-index.json');
  await fs.writeFile(indexPath, JSON.stringify(payload, null, 2), 'utf8');

  console.log(`Website preview assets generated. Indexed ${total} docs.`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
