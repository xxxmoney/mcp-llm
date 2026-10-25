import type { McpServer } from "@modelcontextprotocol/server";
import { registerGenerateTool } from "./generate.tool.js";
import { registerTestTool } from "./test.tool.js";

type RegisterTool = (mcp: McpServer) => void;

export const registerTools: RegisterTool[] = [
	registerTestTool,
	registerGenerateTool,
];
