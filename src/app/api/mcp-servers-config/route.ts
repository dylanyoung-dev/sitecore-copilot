import { IYamlMcpConfig } from '@/models/IYamlConfig';
import fs from 'fs';
import yaml from 'js-yaml';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  try {
    // Read the YAML file from the configuration directory
    const configPath = path.join(process.cwd(), 'src', 'configuration', 'mcp-servers.yaml');
    const fileContents = fs.readFileSync(configPath, 'utf8');

    // Parse the YAML content
    const config = yaml.load(fileContents) as IYamlMcpConfig;
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error loading MCP servers config:', error);
    return NextResponse.json({ error: 'Failed to load MCP server configurations' }, { status: 500 });
  }
}
