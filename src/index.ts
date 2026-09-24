import { createMcpFastifyApp } from "@modelcontextprotocol/fastify";
import { NodeStreamableHTTPServerTransport } from "@modelcontextprotocol/node";
import { ENV } from "./env.ts";
import mcp from "./mcp.ts";

console.log(`Loaded env: ${JSON.stringify(ENV)}`);

const server = createMcpFastifyApp();
server.addHook("onRequest", (request, _, done) => {
	console.log(`[HTTP] ${request.method} ${request.url}`);
	done();
});

// Handle health check
server.get("/", async () => {
	return "I am alive!";
});

// Handle HTTP streaming MCP requests
server.post("/mcp", async (request, reply) => {
	const transport = new NodeStreamableHTTPServerTransport({
		sessionIdGenerator: undefined,
	});
	await mcp.connect(transport);

	// Clean up when the client closes the connection (e.g. during SSE streaming).
	reply.raw.on("close", () => {
		transport.close();
	});

	await transport.handleRequest(request.raw, reply.raw, request.body);
});

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 666;
server.listen({ port: port }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
