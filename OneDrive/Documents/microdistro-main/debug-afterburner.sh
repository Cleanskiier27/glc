#!/bin/bash
# Launch VS Code Extension Host with debugging enabled

EXTENSION_PATH="C:/Users/Alienware/.gemini/antigravity-ide/scratch/afterburner"

echo "Launching Extension Host for debugging..."
code --extensionDevelopmentPath="$EXTENSION_PATH" --inspect-extensions=5870

echo "Extension host launched. You can now use the 'Attach to Extension Host' launch configuration in VS Code to attach the debugger."
