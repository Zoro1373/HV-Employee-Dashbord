@echo off
setlocal
cd /d "%~dp0"
echo This creates a separate OpenUI Next.js agent alongside the existing Vite dashboard.
echo Keep API keys in the agent's server-side .env file. Do not commit .env.
call npx @openuidev/cli@latest create hv-vertex-generative-ui --no-interactive --no-immediate
if errorlevel 1 (
  echo.
  echo OpenUI scaffolding failed. Check network access and npm output, then retry.
  pause
  exit /b 1
)
cd hv-vertex-generative-ui
call npx @openuidev/cli@latest generate-api-key
if errorlevel 1 (
  echo API key setup did not complete. Run this later from hv-vertex-generative-ui:
  echo npx @openuidev/cli@latest generate-api-key
  pause
  exit /b 1
)
echo.
echo Setup complete. Start the OpenUI agent with: npm run dev
pause
