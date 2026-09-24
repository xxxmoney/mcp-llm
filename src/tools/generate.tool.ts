import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";

export function registerGenerateTool(mcp: McpServer) {
	mcp.registerTool(
		"generate",
		{
			description: "Generates output",
			inputSchema: z.object({
				value: z.string(),
			}),
		},
		async ({ value }) => {
			console.log("Generate input:", value);

			return {
				content: [{ type: "text", text: `You said: '${value}'` }],
			};
		},
	);
}
