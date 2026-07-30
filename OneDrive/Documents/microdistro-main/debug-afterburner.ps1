# Launch VS Code Extension Host with debugging enabled
$ExtensionPath = "C:\Users\Alienware\.gemini\antigravity-ide\scratch\afterburner"

Write-Host "Launching Extension Host for debugging..."
code --extensionDevelopmentPath=$ExtensionPath --inspect-extensions=5870

Write-Host "Extension host launched. You can now use the 'Attach to Extension Host' launch configuration in VS Code to attach the debugger."
