import type { McpServer, ServerContext } from "@modelcontextprotocol/server";
import type { z } from "zod";

type HandlerOutput = {
	content: Array<{ type: string; text: string }>;
};

export function registerTool<T extends z.ZodRawShape>(
	mcp: McpServer,
	config: {
		title: string;
		description: string;
		inputSchema: z.ZodObject<T>;
	},
	handler: (
		value: z.infer<z.ZodObject<T>>,
		extra: {
			log: (message: string) => void;
			error: (message: string) => void;
			context: ServerContext;
		},
	) => Promise<HandlerOutput>,
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
				return handler(value, {
					log: log,
					error: error,
					context: extra,
				});
			} catch (err) {
				error(`Failed to execute tool '${config.title}': ${err}`);
			}
		},
	);
}
