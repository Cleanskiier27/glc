import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import fs from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application state
const appState = {
  startTime: Date.now(),
  requestCount: 0,
  status: 'running',
  uptime: 0,
  lastAction: null,
  logs: []
};

// Helper function to add logs
function addLog(action, details = '') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${action} ${details}`;
  appState.logs.push(logEntry);
  if (appState.logs.length > 100) {
    appState.logs.shift();
  }
  console.log(logEntry);
}

const DOC_EXTENSION = '.md';
const docsDir = path.join(__dirname, 'docs');
const azureDocsDir = path.join(__dirname, '.azure/documentation');

function toTitle(fileName) {
  const withoutExt = fileName.replace(/\.md$/i, '');
  return withoutExt
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, ch => ch.toUpperCase());
}

async function collectMarkdownFiles(baseDir, webBasePath, recursive = true, prefix = '') {
  const entries = await fs.readdir(baseDir, { withFileTypes: true });
  const docs = [];

  for (const entry of entries) {
    const absolutePath = path.join(baseDir, entry.name);
    const relativePath = prefix ? path.posix.join(prefix, entry.name) : entry.name;

    if (entry.isDirectory()) {
      if (recursive) {
        const nested = await collectMarkdownFiles(absolutePath, webBasePath, true, relativePath);
        docs.push(...nested);
      }
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

async function buildDocsIndex() {
  const [docsFiles, azureFiles, rootEntries] = await Promise.all([
    collectMarkdownFiles(docsDir, '/docs-files', true),
    collectMarkdownFiles(azureDocsDir, '/azure-docs', true),
    fs.readdir(__dirname, { withFileTypes: true })
  ]);

  const rootFiles = rootEntries
    .filter(entry => entry.isFile() && path.extname(entry.name).toLowerCase() === DOC_EXTENSION)
    .map(entry => ({
      title: toTitle(entry.name),
      file: entry.name,
      url: `/root-docs/${entry.name}`
    }))
    .sort((a, b) => a.file.localeCompare(b.file));

  const sections = [
    { id: 'docs', label: 'Core Docs', items: docsFiles },
    { id: 'azure', label: 'Azure Docs', items: azureFiles },
    { id: 'root', label: 'Root Guides', items: rootFiles }
  ];

  const total = sections.reduce((sum, section) => sum + section.items.length, 0);
  return { generatedAt: new Date().toISOString(), total, sections };
}

// Update uptime
setInterval(() => {
  appState.uptime = Math.floor((Date.now() - appState.startTime) / 1000);
}, 1000);

// Request counter middleware
app.use((req, res, next) => {
  appState.requestCount++;
  next();
});

// ============================================
// OPERATIONAL API ENDPOINTS
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: appState.uptime,
    requestCount: appState.requestCount,
    port: PORT
  });
});

// Get system status
app.get('/api/status', (req, res) => {
  res.json({
    status: appState.status,
    uptime: appState.uptime,
    requestCount: appState.requestCount,
    startTime: new Date(appState.startTime).toISOString(),
    lastAction: appState.lastAction,
    systemInfo: {
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      memoryUsage: process.memoryUsage(),
      freeMemory: os.freemem(),
      totalMemory: os.totalmem()
    }
  });
});

// Get application logs
app.get('/api/logs', (req, res) => {
  res.json({
    logs: appState.logs,
    count: appState.logs.length
  });
});

// Clear logs
app.post('/api/logs/clear', (req, res) => {
  appState.logs = [];
  appState.lastAction = 'Logs cleared';
  addLog('Cleared logs');
  res.json({ message: 'Logs cleared successfully', timestamp: new Date().toISOString() });
});

// Restart application indicator
app.post('/api/restart', (req, res) => {
  appState.lastAction = 'Restart initiated';
  addLog('Restart requested');
  res.json({
    message: 'Application restart requested',
    timestamp: new Date().toISOString(),
    action: 'restart'
  });
});

// Get component status
app.get('/api/components', (req, res) => {
  res.json({
    components: {
      webApp: { status: 'running', path: '/', port: PORT },
      dashboard: { status: 'running', path: '/dashboard', port: PORT },
      overlay: { status: 'running', path: '/overlay', port: PORT },
      blog: { status: 'running', path: '/blog', port: PORT },
      api: { status: 'running', path: '/api', port: PORT }
    },
    timestamp: new Date().toISOString()
  });
});

// Toggle feature endpoint
app.post('/api/toggle/:feature', (req, res) => {
  const { feature } = req.params;
  const isEnabled = req.body.enabled !== false;
  appState.lastAction = `Feature ${feature} toggled: ${isEnabled}`;
  addLog(`Toggled ${feature}`, `enabled: ${isEnabled}`);
  res.json({
    feature,
    enabled: isEnabled,
    message: `${feature} is now ${isEnabled ? 'enabled' : 'disabled'}`,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/docs-index', async (req, res) => {
  try {
    const payload = await buildDocsIndex();
    res.json(payload);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to build docs index',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

app.get('/root-docs/:file', async (req, res) => {
  const file = req.params.file;

  if (!/^[A-Za-z0-9._-]+\.md$/.test(file)) {
    return res.status(400).send('Invalid document path');
  }

  const fullPath = path.join(__dirname, file);

  try {
    const info = await fs.stat(fullPath);
    if (!info.isFile()) {
      return res.status(404).send('Document not found');
    }
    return res.sendFile(fullPath);
  } catch {
    return res.status(404).send('Document not found');
  }
});

// Control panel route (embedded HTML with operational buttons)
app.get('/control-panel', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>NetworkBuster Control Panel</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto;background:linear-gradient(135deg,#667eea,#764ba2);min-height:100vh;padding:20px}.container{max-width:1200px;margin:0 auto}.header{text-align:center;color:#fff;margin-bottom:30px}.header h1{font-size:2.5em;margin-bottom:10px}.status-bar{background:rgba(255,255,255,.95);padding:20px;border-radius:10px;margin-bottom:30px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px}.status-item{padding:15px;background:#f8f9fa;border-radius:8px;border-left:4px solid #667eea}.status-label{font-size:.9em;color:#666;margin-bottom:5px;font-weight:600}.status-value{font-size:1.5em;color:#333;font-weight:bold}.controls{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;margin-bottom:30px}.control-section{background:rgba(255,255,255,.95);padding:25px;border-radius:10px}.section-title{font-size:1.2em;font-weight:700;color:#333;margin-bottom:20px}.button-group{display:flex;flex-direction:column;gap:10px}button{padding:12px 20px;border:none;border-radius:6px;font-size:1em;font-weight:600;cursor:pointer;transition:all 0.3s;color:#fff}.btn-success{background:#48bb78}.btn-success:hover{background:#38a169;transform:translateY(-2px)}.btn-primary{background:#667eea}.btn-primary:hover{background:#5568d3;transform:translateY(-2px)}.btn-info{background:#4299e1}.btn-info:hover{background:#3182ce;transform:translateY(-2px)}.btn-warning{background:#ed8936}.btn-warning:hover{background:#dd6b20;transform:translateY(-2px)}.btn-danger{background:#f56565}.btn-danger:hover{background:#e53e3e;transform:translateY(-2px)}.alert{padding:12px 16px;border-radius:6px;margin-bottom:15px}.alert-success{background:#c6f6d5;color:#22543d}.alert-error{background:#fed7d7;color:#742a2a}.alert-info{background:#bee3f8;color:#2c5282}.logs-container{background:rgba(255,255,255,.95);padding:25px;border-radius:10px}.logs-list{background:#1a202c;color:#a0aec0;padding:15px;border-radius:6px;max-height:300px;overflow-y:auto;font-family:monospace;font-size:.9em;line-height:1.6}</style></head><body><div class="container"><div class="header"><h1>⚙️ NetworkBuster Control Panel</h1><p>Operational Dashboard & System Controls</p></div><div class="status-bar"><div class="status-item"><div class="status-label">Status</div><div class="status-value" id="statusValue">Running</div></div><div class="status-item"><div class="status-label">Uptime</div><div class="status-value" id="uptimeValue">0s</div></div><div class="status-item"><div class="status-label">Requests</div><div class="status-value" id="requestsValue">0</div></div><div class="status-item"><div class="status-label">Last Action</div><div class="status-value" id="lastActionValue">None</div></div></div><div id="alerts"></div><div class="controls"><div class="control-section"><div class="section-title">⚙️ Application Control</div><div class="button-group"><button class="btn-success" onclick="checkHealth()">✓ Health Check</button><button class="btn-info" onclick="getComponentStatus()">📊 Components</button><button class="btn-warning" onclick="getSystemStatus()">💻 System Info</button><button class="btn-danger" onclick="restartApp()">🔄 Restart</button></div></div><div class="control-section"><div class="section-title">🎯 Navigation</div><div class="button-group"><button class="btn-primary" onclick="openPath('/')">🏠 Home</button><button class="btn-primary" onclick="openPath('/dashboard')">📈 Dashboard</button><button class="btn-primary" onclick="openPath('/overlay')">🎨 Overlay</button><button class="btn-primary" onclick="openPath('/blog')">📝 Blog</button></div></div><div class="control-section"><div class="section-title">🔧 Features</div><div class="button-group"><button class="btn-primary" onclick="toggleFeature('analytics')">📊 Analytics</button><button class="btn-primary" onclick="toggleFeature('notifications')">🔔 Notifications</button><button class="btn-primary" onclick="toggleFeature('darkMode')">🌙 Dark Mode</button><button class="btn-primary" onclick="toggleFeature('debug')">🐛 Debug</button></div></div><div class="control-section"><div class="section-title">📋 Maintenance</div><div class="button-group"><button class="btn-info" onclick="viewLogs()">📜 View Logs</button><button class="btn-warning" onclick="clearLogs()">🗑️ Clear Logs</button><button class="btn-danger" onclick="clearCache()">💾 Cache</button><button class="btn-success" onclick="exportLogs()">📥 Export</button></div></div></div><div class="logs-container"><div style="display:flex;justify-content:space-between;margin-bottom:15px"><h3>📜 System Logs</h3><button class="btn-warning" onclick="viewLogs()" style="width:auto">Refresh</button></div><div class="logs-list" id="logsList">Loading logs...</div></div></div><script>function showAlert(m,t='info'){const a=document.getElementById('alerts');const e=document.createElement('div');e.className='alert alert-'+t;e.textContent=m;a.appendChild(e);setTimeout(()=>e.remove(),5000)}function updateStatus(){fetch('/api/status').then(r=>r.json()).then(d=>{document.getElementById('statusValue').textContent=d.status;document.getElementById('uptimeValue').textContent=formatUptime(d.uptime);document.getElementById('requestsValue').textContent=d.requestCount;document.getElementById('lastActionValue').textContent=d.lastAction||'None'}).catch(e=>console.error(e))}function formatUptime(s){const h=Math.floor(s/3600);const m=Math.floor((s%3600)/60);const sec=s%60;if(h>0)return h+'h '+m+'m';return m+'m '+sec+'s'}function checkHealth(){fetch('/api/health').then(r=>r.json()).then(d=>{showAlert('✓ Healthy! Uptime: '+formatUptime(d.uptime),'success');updateStatus()}).catch(e=>showAlert('Health check failed','error'))}function getSystemStatus(){fetch('/api/status').then(r=>r.json()).then(d=>{const mu=Math.round(d.systemInfo.memoryUsage.heapUsed/1024/1024);showAlert('Platform: '+d.systemInfo.platform+' | CPUs: '+d.systemInfo.cpus+' | Memory: '+mu+'MB','info')}).catch(e=>showAlert('Failed','error'))}function getComponentStatus(){fetch('/api/components').then(r=>r.json()).then(d=>{const c=Object.keys(d.components).join(', ');showAlert('✓ Online: '+c,'success')}).catch(e=>showAlert('Failed','error'))}function restartApp(){if(confirm('Restart application?')){fetch('/api/restart',{method:'POST'}).then(r=>r.json()).then(d=>showAlert('⚠️ '+d.message,'warning')).catch(e=>showAlert('Failed','error'))}}function toggleFeature(f){fetch('/api/toggle/'+f,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({enabled:true})}).then(r=>r.json()).then(d=>showAlert(d.message,'success')).catch(e=>showAlert('Failed','error'))}function viewLogs(){fetch('/api/logs').then(r=>r.json()).then(d=>{const l=document.getElementById('logsList');if(d.logs.length===0){l.innerHTML='No logs'}else{l.innerHTML=d.logs.map(x=>'<div>'+x+'</div>').join('')}l.scrollTop=l.scrollHeight}).catch(e=>console.error(e))}function clearLogs(){if(confirm('Clear logs?')){fetch('/api/logs/clear',{method:'POST'}).then(r=>r.json()).then(d=>{showAlert('✓ Cleared','success');viewLogs()}).catch(e=>showAlert('Failed','error'))}}function clearCache(){localStorage.clear();showAlert('✓ Cache cleared','success')}function exportLogs(){fetch('/api/logs').then(r=>r.json()).then(d=>{const t=d.logs.join('\\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='logs.txt';a.click();showAlert('✓ Exported','success')}).catch(e=>showAlert('Failed','error'))}function openPath(p){location.href=p}setInterval(updateStatus,5000);updateStatus();viewLogs()</script></body></html>`);
});

// Serve static files
app.use('/blog', express.static(path.join(__dirname, 'blog')));
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard/dist')));        
app.use('/overlay', express.static(path.join(__dirname, 'challengerepo/real-time-overlay/dist')));
app.use('/docs-files', express.static(docsDir));
app.use('/azure-docs', express.static(azureDocsDir));
app.use('/', express.static(path.join(__dirname, 'web-app')));

// SPA fallbacks
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard/dist/index.html'));
});

app.get('/overlay', (req, res) => {
  res.sendFile(path.join(__dirname, 'challengerepo/real-time-overlay/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`🏠 Web app: http://localhost:${PORT}`);
  console.log(`🎨 Real-time overlay: http://localhost:${PORT}/overlay`);
  console.log(`📈 Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`📝 Blog: http://localhost:${PORT}/blog`);
  console.log(`⚙️ Control Panel: http://localhost:${PORT}/control-panel\n`);
  addLog('Server started', `Port: ${PORT}`);
});
