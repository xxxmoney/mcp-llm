import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

export function registerTestTool(mcp: McpServer) {
	mcp.registerTool(
		"test",
		{
			description: "Test tool that responds with the provided value",
			inputSchema: z.object({
				value: z.string(),
			}),
		},
		async ({ value }, extra) => {
			console.log(
				`['${extra.sessionId}'] session received test message: '${value}'`,
			);
			return {
				content: [{ type: "text", text: `Value: '${value}'` }],
			};
		},
	);
}
