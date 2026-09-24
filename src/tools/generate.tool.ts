import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import OpenAI from "openai";
import { z } from "zod";
import { ENV } from "../env.ts";

export function registerGenerateTool(mcp: McpServer) {
	mcp.registerTool(
		"generate",
		{
			description: "Generates output using LLM",
			inputSchema: z.object({
				instructions: z.string().optional(),
				input: z.string(),
			}),
		},
		async (value, extra) => {
			try {
				const instructions = value.instructions ?? "You are an assistant";
				console.log(
					`Session '${extra.sessionId}' generating output for input: '${value.input}', instructions: '${instructions}'...`,
				);

				const client = new OpenAI({
					baseURL: ENV.URL,
					apiKey: ENV.TOKEN,
				});

				const response = await client.chat.completions.create({
					model: ENV.MODEL,
					messages: [
						{
							role: "system",
							content: instructions,
						},
						{ role: "user", content: value.input },
					],
				});
				const output = response.choices[0]?.message?.content;

				console.log(
					`Session '${extra.sessionId}' generated output: '${output}'`,
				);

				return {
					content: [{ type: "text", text: output ?? "" }],
				};
			} catch (error) {
				console.error(
					`Session '${extra.sessionId}' failed to generate output:`,
					error instanceof Error ? error.message : error,
				);

				throw error;
			}
		},
	);
}
