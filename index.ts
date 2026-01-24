import { Client } from '@modelcontextprotocol/sdk/client'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'

// 检查 MCP_TOKEN 是否设置
if (!process.env.MCP_TOKEN) {
  console.error('Error: MCP_TOKEN 环境变量未设置')
  console.error('请设置 MCP_TOKEN 环境变量后再运行脚本')
  process.exit(1)
}

const mcpConfig = {
  server: 'mcd-mcp',
  url: 'https://mcp.mcd.cn',
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
