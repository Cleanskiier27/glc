import { readdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const outputPath = path.join(repoRoot, 'web-app', 'docs-index.json');

const docsRoot = path.join(repoRoot, 'docs');
const azureDocsRoot = path.join(repoRoot, '.azure', 'documentation');

const rootDocs = [
  'AZURE_STORAGE_SETUP_cleanskiier27.md',
  'D_DRIVE_BACKUP_SUMMARY.md',
  'DATA_STORAGE_AND_VISITOR_TRACKING.md',
  'DATACENTRA-STATUS.md',
  'DEPENDENCIES.md',
  'FLASH-COMMANDS-GUIDE.md',
  'OPTIMIZATION_COMPLETE.md',
  'PROJECT-SUMMARY.md',
  'PUBLIC-VISIBILITY.md',
  'PUSH-DATACENTRA.md',
  'README-ANNOUNCEMENT.md',
  'README-DATACENTRA.md',
  'README.md',
  'RELEASE-v1.0.1.md',
  'SOURCE_LOG_CLEANED.md'
];

function toTitle(relativePath) {
  const base = path.basename(relativePath, path.extname(relativePath));
  return base
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
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
  for (const filename of rootDocs) {
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
