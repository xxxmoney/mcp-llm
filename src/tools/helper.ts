import type { McpServer, ServerContext } from "@modelcontextprotocol/server";
import type { z } from "zod";

type HandlerOutput = Promise<{
	content: Array<{ type: string; text: string }>;
}>;

export function registerTool<T extends z.ZodRawShape>(
	mcp: McpServer,
	config: {
		title: string;
		description: string;
		inputSchema: z.ZodObject<T>;
	},
	handler: (
		value: z.infer<z.ZodObject<T>>,
		log: (message: string) => void,
		error: (message: string) => void,
		extra: ServerContext,
	) => HandlerOutput,
) {
	mcp.registerTool(
		config.title,
		{
			description: config.description,
			inputSchema: config.inputSchema,
		},
		(value, extra) => {
			const log = (message: string) => {
				console.log(`[${extra.sessionId}] ${message}`);
			};
			const error = (message: string) => {
				console.error(`[${extra.sessionId}] ${message}`);
			};

			try {
				return handler(value, log, error, extra);
			} catch (err) {
				error(`Failed to execute tool '${config.title}': ${err}`);
			}
		},
	);
}
