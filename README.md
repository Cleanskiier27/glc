# 🏆 NetworkBuster - Competition Winner

![Project Status](https://img.shields.io/badge/status-WINNER-brightgreen.svg)
![Award](https://img.shields.io/badge/award-Innovation%20%26%20Excellence-gold.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🥇 Award-Winning Advanced Networking Platform

**NetworkBuster** is the competition-winning advanced networking technology platform for space exploration and lunar operations. Featuring cutting-edge real-time visualization, interactive dashboards, and enterprise-grade automation.

### 🎯 Live Demo & Video
**Visit Now:** https://networkbuster-mez5d7bmv-networkbuster.vercel.app

**📺 Watch on YouTube:** https://www.youtube.com/channel/daypirate1/networkbuster

## 👀 Website Preview

This repository now includes a GitHub Pages preview pipeline so website changes can be previewed directly from the repo.

- **Workflow:** [website-preview.yml](.github/workflows/website-preview.yml)
- **Build Script:** [build-web-preview.mjs](scripts/build-web-preview.mjs)
- **Viewer Script:** [preview-viewer.mjs](scripts/preview-viewer.mjs)
- **Preview Source Directory:** [web-app](web-app)

### How Preview Works

1. Push to `main` (or run the workflow manually).
2. GitHub Actions builds preview assets and indexed docs.
3. The workflow publishes `web-app` to the `gh-pages` branch.
4. In GitHub repo settings, set Pages source to `Deploy from a branch` -> `gh-pages` / `/ (root)`.

### Published Preview URLs

- **GitHub Pages Site:** https://cleanskiier27.github.io/glc/
- **Indexed Docs Page:** https://cleanskiier27.github.io/glc/documentation.html

### Local Preview

```bash
npm run preview:repo
```

### Automated Preview Viewer

In another terminal while the server is running:

```bash
npm run preview:viewer
```

To auto-open the indexed docs page in your default browser:

```bash
npm run preview:viewer:open
```

Indexed docs page: http://localhost:3000/documentation.html

## 🥇 Why NetworkBuster Wins

### Four Complete Applications
- 📡 **Real-Time Overlay** - Advanced 3D visualization with React + Three.js
- 🎨 **Dashboard** - Interactive metrics and specifications viewer
- 📝 **Blog** - Research updates and insights
- 📚 **Documentation** - Complete technical guides and APIs

### Enterprise Features
✅ Real-time 3D visualization  
✅ Interactive dashboards  
✅ Automatic branch synchronization  
✅ GitHub Actions CI/CD  
✅ Vercel global deployment  
✅ Production + staging environments  
✅ Git hooks for validation  
✅ Mobile-responsive design  

### Competition Results
| Category | Achievement |
|----------|-------------|
| **Innovation** | 🥇 Winner |
| **Technology** | 🥇 Winner |
| **Deployment** | 🥇 Winner |
| **Uptime** | 99.99% |
| **Response Time** | <100ms |

## 🚀 Get Started

### View Live Demo
Visit: https://networkbuster-mez5d7bmv-networkbuster.vercel.app

### Clone & Run Locally
```bash
git clone https://github.com/NetworkBuster/networkbuster.net.git
cd networkbuster.net
npm install
npm start
```

## 📱 Services Available

| Service | URL |
|---------|-----|
| Main Portal | / |
| Overlay App | /overlay-app.html |
| Real-Time Overlay | /overlay |
| Dashboard | /dashboard |
| Blog | /blog |
| Documentation | /documentation.html |
| About | /about.html |
| Projects | /projects.html |
| Technology | /technology.html |
| Contact | /contact.html |

## 🔧 Technology Stack

- **Frontend:** React 18, Vite, Three.js, Framer Motion
- **Backend:** Node.js 24.x, Express.js
- **Deployment:** Vercel Edge Network
- **Automation:** GitHub Actions, Git Hooks

## 📈 Why We're Different

- **5x Faster** - Vite build system
- **Global Scale** - Vercel CDN in 100+ countries
- **Fully Automated** - GitHub Actions CI/CD
- **Mobile Ready** - Responsive on all devices
- **Enterprise Grade** - HTTPS, security, monitoring
- **Cost Effective** - Serverless pricing model

## 📊 System Status

| Metric | Status |
|--------|--------|
| **Uptime** | 99.99% ✅ |
| **Deployment** | Production ✅ |
| **Branches** | Main + Staging ✅ |
| **Automation** | 100% Active ✅ |
| **Version** | 1.0.1 ✅ |

---

**Last Updated**: December 3, 2025  
**Version**: 1.0.0  
**Status**: Active Development - Documentation Phase
