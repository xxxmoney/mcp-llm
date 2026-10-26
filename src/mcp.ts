import { McpServer } from "@modelcontextprotocol/server";
import { registerTools } from "./tools/index.js";

export function createMcpServer() {
	const mcp = new McpServer({
		name: "mcp-llm",
		version: "1.0.0",
	});

	mcp.server.onerror = (error) => {
		console.error("MCP error:", error);
	};

	for (const registerTool of registerTools) {
		registerTool(mcp);
	}

	return mcp;
}
