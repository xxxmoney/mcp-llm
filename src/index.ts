import type { ZodTypeProvider } from "@fastify/type-provider-zod";
import {
	serializerCompiler,
	validatorCompiler,
} from "@fastify/type-provider-zod";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse";
import fastify from "fastify";
import { z } from "zod";
import mcp from "./mcp.ts";

const connections = new Map<string, SSEServerTransport>();

const server = fastify();

// Use Zod validation
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

// Let MCP process raw request content
server.removeAllContentTypeParsers();
server.addContentTypeParser("*", (_, payload, done) => {
	done(null, payload);
});

// Handle health check
server.get("/", async () => {
	return "I am alive!";
});

// Handle initiate SSE
server.get("/mcp", async (_, reply) => {
	reply.hijack(); // Handle response by MCP connection

	console.log("Establishing new connection...");
	const connection = new SSEServerTransport("/messages", reply.raw);
	await mcp.connect(connection);
	console.log(`Connection established: '${connection.sessionId}'`);

	connections.set(connection.sessionId, connection);

	reply.raw.on("close", async () => {
		if (connections.has(connection.sessionId)) {
			console.log(`Closing connection: '${connection.sessionId}'...`);
			await connection.close();
			connections.delete(connection.sessionId);
			console.log(`Closed connection: '${connection.sessionId}'`);
		}
	});
});

// Handle POST message to SSE connection
server.withTypeProvider<ZodTypeProvider>().post(
	"/messages",
	{
		schema: {
			querystring: z.object({
				sessionId: z.string(),
			}),
		},
	},
	async (request, reply) => {
		reply.hijack(); // Handle response by connection

		const sessionId = request.query.sessionId;

		const connection = connections.get(sessionId);
		if (!connection) {
			console.warn(`No active connection for: '${sessionId}'`);
			return reply.raw.writeHead(400).end("No active connection");
		}

		await connection.handlePostMessage(request.raw, reply.raw);
	},
);

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 666;
server.listen({ port: port }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
