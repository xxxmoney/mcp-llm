import { McpServer } from "@modelcontextprotocol/server";
import { registerGenerateTool } from "./tools/generate.tool.js";
import { registerTestTool } from "./tools/test.tool.js";

const mcp = new McpServer({
	name: "mcp-llm",
	version: "1.0.0",
});

mcp.server.onerror = (error) => {
	console.error("MCP error:", error);
};

registerTestTool(mcp);
registerGenerateTool(mcp);

export default mcp;
