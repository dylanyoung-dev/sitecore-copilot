// lib/mcp-oauth-discovery.ts
export interface MCPOAuthMetadata {
  authorization_endpoint: string;
  token_endpoint: string;
  scopes_supported?: string[];
  grant_types_supported?: string[];
  response_types_supported?: string[];
  registration_endpoint?: string; // For dynamic client registration
  issuer: string;
}

export class MCPOAuthDiscovery {
  async discoverOAuthConfig(mcpServerUrl: string): Promise<MCPOAuthMetadata> {
    const baseUrl = new URL(mcpServerUrl).origin;

    try {
      // Try RFC8414 well-known endpoint first
      const wellKnownUrl = `${baseUrl}/.well-known/oauth-authorization-server`;
      console.log(`Attempting OAuth discovery at: ${wellKnownUrl}`);

      const response = await fetch(wellKnownUrl);
      if (response.ok) {
        const metadata = await response.json();
        console.log('OAuth metadata discovered:', metadata);
        return this.validateMetadata(metadata);
      }
    } catch (error) {
      console.log('Well-known discovery failed, trying fallback URLs');
    }

    // Fallback to default MCP OAuth endpoints
    return this.getFallbackEndpoints(baseUrl);
  }

  private getFallbackEndpoints(baseUrl: string): MCPOAuthMetadata {
    // MCP specification defines fallback URLs
    return {
      issuer: baseUrl,
      authorization_endpoint: `${baseUrl}/authorize`,
      token_endpoint: `${baseUrl}/token`,
      registration_endpoint: `${baseUrl}/register`, // For dynamic client registration
      grant_types_supported: ['authorization_code'],
      response_types_supported: ['code'],
      scopes_supported: [], // Will be discovered during registration
    };
  }

  private validateMetadata(metadata: any): MCPOAuthMetadata {
    if (!metadata.authorization_endpoint || !metadata.token_endpoint) {
      throw new Error('Invalid OAuth metadata: missing required endpoints');
    }

    return {
      issuer: metadata.issuer,
      authorization_endpoint: metadata.authorization_endpoint,
      token_endpoint: metadata.token_endpoint,
      registration_endpoint: metadata.registration_endpoint,
      grant_types_supported: metadata.grant_types_supported || ['authorization_code'],
      response_types_supported: metadata.response_types_supported || ['code'],
      scopes_supported: metadata.scopes_supported || [],
    };
  }
}
