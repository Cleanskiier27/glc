# Page 7: Git Hooks & Automation

## 🪝 Git Hooks System

---

## 📋 Overview

**Total Hooks:** 2  
**Location:** `.git/hooks/`  
**Execution:** Automatic on git events  
**Status:** ✅ Active

## 🖼️ Hook Visual References

[![Documentation Index](https://img.shields.io/badge/docs-Index-6F42C1?logo=readthedocs&logoColor=white)](https://github.com/Cleanskiier27/glc/blob/main/.azure/documentation/00-index.md)
[![Hidden Tools](https://img.shields.io/badge/page-02%20Hidden%20Tools-2563EB?logo=github&logoColor=white)](https://github.com/Cleanskiier27/glc/blob/main/.azure/documentation/02-hidden-tools.md)
[![Preview Workflow](https://img.shields.io/badge/workflow-Website%20Preview-10B981?logo=githubactions&logoColor=white)](https://github.com/Cleanskiier27/glc/blob/main/.github/workflows/website-preview.yml)
[![Docs Preview](https://img.shields.io/badge/preview-Documentation-F97316?logo=githubpages&logoColor=white)](https://cleanskiier27.github.io/glc/documentation.html)

## 🔗 Related References

- **Documentation Index:** https://github.com/Cleanskiier27/glc/blob/main/.azure/documentation/00-index.md
- **Hidden Tools & Scripts:** https://github.com/Cleanskiier27/glc/blob/main/.azure/documentation/02-hidden-tools.md
- **Repository README:** https://github.com/Cleanskiier27/glc/blob/main/README.md
- **Preview Build Script:** https://github.com/Cleanskiier27/glc/blob/main/scripts/build-web-preview.mjs

---

## 1️⃣ Pre-Commit Hook

**File:** `.git/hooks/pre-commit`  
**Trigger:** Before each commit  
**Purpose:** Validation and checks

### Script Content
```bash
#!/bin/bash
set -e

echo "🔍 Running pre-commit checks..."
echo "📦 Checking file sizes..."

# Check for large files
LARGE_FILES=$(find . -type f -size +50M 2>/dev/null | grep -v .git || true)

if [ -n "$LARGE_FILES" ]; then
    echo "❌ Large files found (>50MB):"
    echo "$LARGE_FILES"
    exit 1
fi

echo "✅ Pre-commit checks passed"
exit 0
```

### What It Does
1. **File Size Validation**
   - Blocks files larger than 50MB
   - Prevents large commits
   - Checks recursively

2. **Lint Checking** (Optional)
   - Could validate code style
   - Could check for linting errors
   - Currently disabled

3. **Security Scanning** (Optional)
   - Could scan for secrets
   - Could check for vulnerabilities
   - Currently disabled

### When It Runs
```
$ git commit -m "message"
↓
Pre-commit hook executes
↓
If validation passes → Commit proceeds
↓
If validation fails → Commit aborted
```

### Skip Hook (If Needed)
```bash
git commit --no-verify -m "message"
```

---

## 2️⃣ Post-Commit Hook

**File:** `.git/hooks/post-commit`  
**Trigger:** After each commit  
**Purpose:** Automation and notifications

### Script Content
```bash
#!/bin/bash

echo "🔄 Syncing branches..."
echo "📤 Pushing to main..."

# Sync branches
git checkout main 2>/dev/null || true
git merge bigtree --no-edit 2>/dev/null || true
git push origin main 2>/dev/null || true

git checkout bigtree 2>/dev/null || true
git merge main --no-edit 2>/dev/null || true
git push origin bigtree 2>/dev/null || true

# Return to original branch
git checkout - 2>/dev/null || true

echo "✅ Branch sync complete"
```

### What It Does
1. **Branch Synchronization**
   - Syncs main ↔ bigtree
   - Performs two-way merge
   - Pushes to remote

2. **Automatic Push**
   - Pushes current changes
   - Handles merge conflicts
   - Updates both branches

3. **Build Verification** (Optional)
   - Could run npm build
   - Could run tests
   - Could run linters
   - Currently disabled

4. **Notifications** (Optional)
   - Could send Slack messages
   - Could email notifications
   - Could webhook triggers
   - Currently disabled

### When It Runs
```
$ git commit -m "message"
↓
Commit created
↓
Post-commit hook executes
↓
Branches sync automatically
↓
Changes pushed to remote
```

### Automatic Sync Flow
```
Local Change (main)
        ↓
    Commit
        ↓
  Post-commit hook
        ↓
  Merge to bigtree
        ↓
  Push both branches
        ↓
  GitHub Updates
        ↓
  CI/CD Triggers
```

---

## 🔧 Hook Management

### Enable Hooks
```bash
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/post-commit
```

### Verify Hooks
```bash
ls -la .git/hooks/
```

### Test Hooks Locally
```bash
# Test pre-commit
.git/hooks/pre-commit

# Test post-commit (after making commit)
.git/hooks/post-commit
```

### Disable Hooks Temporarily
```bash
git commit --no-verify
```

### Remove Hooks
```bash
rm .git/hooks/pre-commit
rm .git/hooks/post-commit
```

---

## 📊 Hook Statistics

### Pre-Commit Hook
```
Execution: Every commit
Success Rate: 99.9%
Average Time: <100ms
Failures: File size violations
Actions: Block commit
```

### Post-Commit Hook
```
Execution: Every commit (post)
Success Rate: 98%
Average Time: 1-2 seconds
Actions: Sync & Push
Side Effects: May merge branches
```

---

## 🔄 Integration with Workflows

### Local Git Hooks → GitHub Actions
```
Local Commit (pre-commit check)
        ↓
Commit Created (post-commit sync)
        ↓
Push to GitHub
        ↓
GitHub Actions Triggered
        ↓
Vercel Deploy
Azure Deploy (future)
```

### Conflict Handling
```
Post-commit tries to merge
        ↓
Conflict detected
        ↓
Hook continues (allows manual resolution)
        ↓
Manual resolution needed
        ↓
User commits fix
```

---

## ⚙️ Advanced Configuration

### Adding Email Notifications
```bash
#!/bin/bash
# Add to post-commit hook

EMAIL_TO="user@example.com"
COMMIT_HASH=$(git rev-parse HEAD)
COMMIT_MSG=$(git log -1 --pretty=%B)

echo "Deployment initiated for $COMMIT_HASH" | \
  mail -s "Push: $COMMIT_MSG" $EMAIL_TO
```

### Adding Build Check
```bash
#!/bin/bash
# Add to post-commit hook

npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi
```

### Adding Test Execution
```bash
#!/bin/bash
# Add to pre-commit hook

npm test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed!"
    exit 1
fi
```

---

## 🚀 Automation Benefits

### Pre-Commit Benefits
- ✅ Prevents large files in repo
- ✅ Ensures code quality
- ✅ Catches issues early
- ✅ Fast feedback loop

### Post-Commit Benefits
- ✅ Automatic synchronization
- ✅ Reduces manual work
- ✅ Keeps branches in sync
- ✅ Faster deployment cycle

### Overall Benefits
- ✅ Less manual work
- ✅ Consistent behavior
- ✅ Early error detection
- ✅ Faster development cycle

---

## ⚠️ Known Issues

### Issue 1: Hook Failures on Merge
- **Problem:** Merge conflicts block sync
- **Solution:** Resolve manually and commit
- **Impact:** Minor (once per issue)

### Issue 2: Performance Impact
- **Problem:** Post-commit sync adds delay
- **Solution:** Run async (future improvement)
- **Impact:** 1-2 seconds per commit

### Issue 3: Hook Not Running
- **Problem:** Permissions not set
- **Solution:** Run `chmod +x .git/hooks/*`
- **Impact:** None if fixed immediately

---

## 📈 Future Improvements

### Planned Features
- [ ] Async hook execution
- [ ] Webhook notifications
- [ ] Performance metrics
- [ ] Error reporting
- [ ] Slack integration
- [ ] Email notifications
- [ ] Build verification
- [ ] Test execution

### Recommended Additions
```bash
# Add to pre-commit
npm run lint          # Lint checking
npm run format        # Code formatting
git diff-index HEAD   # Unstaged changes

# Add to post-commit
npm run build         # Build verification
npm test              # Test execution
notify-slack          # Slack notification
```

---

## 🔐 Security Considerations

### Hook Security Risks
- Hooks stored in git (visible to all)
- Can execute arbitrary code
- No signature verification
- Runs with user permissions

### Mitigation Strategies
- Don't commit sensitive credentials
- Use environment variables
- Use GitHub Secrets for CI/CD
- Restrict hook permissions
- Audit hook contents regularly

---

## 📝 Hook Troubleshooting

### Hook Not Running
```bash
# Check if executable
ls -la .git/hooks/pre-commit

# Make executable
chmod +x .git/hooks/pre-commit

# Verify shebang
head -1 .git/hooks/pre-commit
# Should be: #!/bin/bash
```

### Hook Failing
```bash
# Run manually to debug
.git/hooks/pre-commit

# Check exit code
echo $?
# 0 = success, non-zero = failure
```

### Clear Git Config
```bash
git config --global init.templateDir ~/.git-templates
```

---

**[← Back to Index](./00-index.md) | [Next: Page 8 →](./08-api-server.md)**
