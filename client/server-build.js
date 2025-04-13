// This script builds the client application for serving from the server
import { build } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildClient() {
  console.log('Building client application for server deployment...');

  try {
    // Run the Vite build
    await build({
      root: __dirname,
      base: '/client/',
      build: {
        outDir: 'dist',
        emptyOutDir: true,
        manifest: true,
      },
    });

    console.log('Client build completed.');

    // Now create a symlink or copy the dist folder to a place where the server can access it
    const clientDistPath = resolve(__dirname, 'dist');
    const serverClientPath = resolve(__dirname, '..', 'server', 'client-dist');

    // Create or clear server client directory
    if (fs.existsSync(serverClientPath)) {
      fs.rmSync(serverClientPath, { recursive: true, force: true });
    }

    // Copy the dist folder to the server directory
    fs.cpSync(clientDistPath, serverClientPath, { recursive: true });

    console.log(`Client files copied to server at ${serverClientPath}`);
    console.log('Client is ready to be served by the NestJS server.');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildClient();
