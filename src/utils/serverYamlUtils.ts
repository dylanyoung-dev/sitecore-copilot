'use server';

import { IYamlMcpConfig } from '@/models/IYamlConfig';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

/**
 * Load MCP server configurations from the YAML file (server-side only)
 *
 * @returns YamlMcpConfig object containing the preconfigured servers
 */
export async function loadMcpServersConfig(): Promise<IYamlMcpConfig> {
  try {
    // Read the YAML file from the configuration directory
    const configPath = path.join(process.cwd(), 'src', 'configuration', 'mcp-servers.yaml');
    const fileContents = fs.readFileSync(configPath, 'utf8');

    // Parse the YAML content
    const config = yaml.load(fileContents) as IYamlMcpConfig;
    return config;
  } catch (error) {
    console.error('Error loading MCP servers configuration:', error);
    return { servers: [] };
  }
}
