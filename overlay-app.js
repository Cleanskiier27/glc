async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Request failed');
    }
    return res.json();
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = value;
    }
}

async function refreshStatus() {
    try {
        const health = await fetchJson('api/health');
        setText('healthStatus', health.status || 'ok');
        setText('healthUptime', `${health.uptime ?? 0}s`);
        setText('healthRequests', `${health.requestCount ?? 0}`);
    } catch {
        setText('healthStatus', 'Unavailable');
        setText('healthUptime', '-');
        setText('healthRequests', '-');
    }

    try {
        const components = await fetchJson('api/components');
        const overlay = components?.components?.overlay?.status || 'unknown';
        setText('overlayComponent', overlay);
    } catch {
        setText('overlayComponent', 'Unavailable');
    }
}

function bindToggles() {
    const viewport = document.getElementById('overlayViewport');
    const gridBtn = document.getElementById('toggleGrid');
    const pulseBtn = document.getElementById('togglePulse');

    if (!viewport || !gridBtn || !pulseBtn) {
        return;
    }

    gridBtn.addEventListener('click', () => {
        viewport.classList.toggle('overlay-grid-on');
    });

    pulseBtn.addEventListener('click', () => {
        viewport.classList.toggle('overlay-pulse-on');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    bindToggles();
    refreshStatus();
    setInterval(refreshStatus, 15000);
});
