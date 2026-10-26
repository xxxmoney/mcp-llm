import type { McpServer } from "@modelcontextprotocol/server";
import OpenAI from "openai";
import { z } from "zod";
import { ENV } from "../env.ts";
import { registerTool } from "./helper.js";

const client = new OpenAI({
	baseURL: ENV.BASE_URL,
	apiKey: ENV.TOKEN,
});

export function registerGenerateTool(mcp: McpServer) {
	return registerTool(
		mcp,
		{
			title: "generate",
			description: "Generates output using LLM",
			valueSchema: z.object({
				instructions: z.string().optional(),
				input: z.string(),
			}),
		},
		async (value, { log }) => {
			const instructions = value.instructions ?? "You are an assistant";
			log(
				`Generating output for input: '${value.input}', instructions: '${instructions}'...`,
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

			log(`Generated output: '${output}'`);

			return {
				content: [{ type: "text", text: output ?? "" }],
			};
		},
	);
}
