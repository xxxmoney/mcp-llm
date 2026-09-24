import type { McpServer } from "@modelcontextprotocol/server";
import OpenAI from "openai";
import { z } from "zod";
import { ENV } from "../env.ts";

const client = new OpenAI({
	baseURL: ENV.BASE_URL,
	apiKey: ENV.TOKEN,
});

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
					`['${extra.sessionId}'] session generating output for input: '${value.input}', instructions: '${instructions}'...`,
				);

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
					`['${extra.sessionId}'] session generated output: '${output}'`,
				);

				return {
					content: [{ type: "text", text: output ?? "" }],
				};
			} catch (error) {
				console.error(
					`['${extra.sessionId}'] session failed to generate output:`,
					error instanceof Error ? error.message : error,
				);

				throw error;
			}
		},
	);
}
