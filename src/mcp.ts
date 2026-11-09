import { McpApp } from "mcp-server-ts";
import OpenAI from "openai";
import { z } from "zod";
import { version } from "../package.json";
import { ENV } from "./env.js";

export const app = new McpApp({
	name: "My MCP App",
	version: version,
});

// Test tool
app.registerTool({
	config: {
		title: "test",
		description: "Test tool that responds with the provided value",
		valueSchema: z.object({
			value: z.string(),
		}),
	},
	handler: ({ value }, { log }) => {
		log(`Received test message: '${value}'`);

		return `Value: '${value}`;
	},
});

// Generate tool
const client = new OpenAI({
	baseURL: ENV.BASE_URL,
	apiKey: ENV.TOKEN,
});
app.registerTool({
	config: {
		title: "generate",
		description: "Generates output using LLM",
		valueSchema: z.object({
			instructions: z.string().optional(),
			input: z.string(),
		}),
	},
	handler: async (value, { log }) => {
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

		return output ?? "";
	},
});
