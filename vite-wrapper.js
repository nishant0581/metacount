// vite-wrapper.js
import { spawn } from 'node:child_process';

// Get the arguments passed to this script, excluding 'node' and the script name
const originalArgs = process.argv.slice(2);

// Replace '--hostname' with '--host'
const modifiedArgs = originalArgs.map(arg => arg === '--hostname' ? '--host' : arg);

console.log(`[vite-wrapper] Starting vite with modified args: ${modifiedArgs.join(' ')}`);

// Determine the command to run. 
// Using 'npx vite' ensures the local (project) version of Vite is preferred.
const viteProcess = spawn('npx', ['vite', ...modifiedArgs], {
  stdio: 'inherit', // Inherit stdin, stdout, stderr from the parent process
  shell: true      // Use shell to help resolve 'npx' and 'vite' correctly, especially on Windows or in some CI environments
});

viteProcess.on('close', (code) => {
  console.log(`[vite-wrapper] Vite process exited with code ${code}`);
  // Ensure the wrapper script exits with the same code as the Vite process
  process.exit(code === null ? 1 : code);
});

viteProcess.on('error', (err) => {
  console.error('[vite-wrapper] Failed to start Vite process:', err);
  process.exit(1);
});
