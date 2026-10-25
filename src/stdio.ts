import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import mcp from "./mcp.ts";

console.log = console.error; // Redirect log to error to avoid stdout pollution

const transport = new StdioServerTransport();
await mcp.connect(transport);
