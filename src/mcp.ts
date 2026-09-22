import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";

const mcp = new McpServer({
	name: "mcp-llm",
	version: "1.0.0",
});

mcp.registerTool(
	"generate",
	{
		description: "Generates output",
		inputSchema: z.object({
			value: z.string(),
		}),
	},
	async ({ value }) => {
		console.log("Got input:", value);

		return {
			content: [{ type: "text", text: `You said: '${value}'` }],
		};
	},
);

export default mcp;
