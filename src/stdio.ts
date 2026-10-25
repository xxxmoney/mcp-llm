import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import mcp from "./mcp.ts";

// Redirect log to error to avoid stdout pollution
console.debug = console.error;
console.info = console.error;
console.log = console.error;

const transport = new StdioServerTransport();
await mcp.connect(transport);
