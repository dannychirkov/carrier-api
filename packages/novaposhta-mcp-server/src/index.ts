#!/usr/bin/env node
import { loadConfig } from './config.js';
import { NovaPoshtaMCPServer } from './server.js';

async function main() {
  try {
    const config = loadConfig();
    const server = new NovaPoshtaMCPServer(config);
    await server.start();
  } catch (error) {
    console.error('Failed to start Nova Poshta MCP server:', error);
    process.exit(1);
  }
}

main();
