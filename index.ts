import { Client } from '@modelcontextprotocol/sdk/client'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'

const mcpConfig = {
  server: 'mcd-mcp',
  url: 'https://mcp.mcd.cn/mcp-servers/mcd-mcp',
  headers: {
    Authorization: `Bearer ${process.env.MCP_TOKEN}`,
  },
}

type MCPRespContent = {
  type: 'text'
  text: string
}

async function main() {
  try {
    const transport = new StreamableHTTPClientTransport(new URL(mcpConfig.url), {
      requestInit: {
        headers: mcpConfig.headers,
      },
    })

    const client = new Client({
      name: 'auto-mcd-client',
      version: '1.0.0',
    })

    await client.connect(transport)

    const result = await client.callTool({
      name: 'auto-bind-coupons',
      arguments: {},
    })

    if (result.content && Array.isArray(result.content)) {
      const firstContent: MCPRespContent = result.content[0]
      console.log(firstContent.text)
    }

    await client.close()
  } catch (error) {
    console.error(error)
  }
}

main()
