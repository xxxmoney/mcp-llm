import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { registerTool } from "./helper.js";

export function registerTestTool(mcp: McpServer) {
	return registerTool(
		mcp,
		{
			title: "test",
			description: "Test tool that responds with the provided value",
			inputSchema: z.object({
				value: z.string(),
			}),
		},
		async ({ value }, { log }) => {
			log(`Received test message: '${value}'`);

			return {
				content: [{ type: "text", text: `Value: '${value}'` }],
			};
		},
	);
}
