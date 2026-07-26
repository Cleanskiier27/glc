# Navigate to the correct directory
cd "Z:/.antigravity-ide/extensions/googlecloudtools.datacloud-0.5.2-universal/codicons"

# Create the README file
echo "# codicon.css" >> README.md

# Initialize Git and add the files
git init
git add README.md codicon.css

# Commit the changes
git commit -m "first commit"

# Set the branch and remote, then push
git branch -M main
git remote add origin https://github.com/Cleanskiier27/codicon.css.git
git push -u origin main