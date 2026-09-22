import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse";
import fastify from "fastify";
import mcp from "./mcp.ts";

const server = fastify();
let transport: SSEServerTransport | null = null;

server.removeAllContentTypeParsers();
server.addContentTypeParser("*", (req, payload, done) => {
	done(null, payload); // Handle raw
});

server.get("/", async (request, reply) => {
	return "I am alive!";
});

server.get("/mcp", async (request, reply) => {
	reply.hijack(); // Handle response by MCP

	console.log("Establishing SSE connection...");

	transport = new SSEServerTransport("/messages", reply.raw);
	await mcp.connect(transport);
});

server.post("/messages", async (request, reply) => {
	reply.hijack(); // Handle response by MCP

	if (!transport) {
		console.warn("No active connection yet!");
		return reply.code(400).send("No active connection");
	}

	await transport.handlePostMessage(request.raw, reply.raw);
});

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 666;
server.listen({ port: port }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
