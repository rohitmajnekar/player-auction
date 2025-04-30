@echo off
setlocal

REM Step 1: Start server
start "Server" cmd /k "cd /d %~dp0server && npm install && npm start"

REM Step 2: Start Svelte client
start "Svelte Client" cmd /k "cd /d %~dp0remote-connection-app\svelte-socket-client && npm install && npm run dev -- --host"

REM Step 3: Start root project (assumed current folder)
start "Root Project" cmd /k "cd /d %~dp0 && npm install && npm start"

endlocal
