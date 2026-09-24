import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { registerGenerateTool } from "./tools/generate.tool.js";

const mcp = new McpServer({
	name: "mcp-llm",
	version: "1.0.0",
});

mcp.server.onerror = (error) => {
	console.error("MCP Server Error:", error);
};

registerGenerateTool(mcp);

export default mcp;
