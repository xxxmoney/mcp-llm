import { randomUUID } from "node:crypto";
import cors from "@fastify/cors";
import { createMcpFastifyApp } from "@modelcontextprotocol/fastify";
import { NodeStreamableHTTPServerTransport } from "@modelcontextprotocol/node";
import { isInitializeRequest } from "@modelcontextprotocol/server";
import { ENV } from "./env.ts";
import mcp from "./mcp.ts";

console.log(`Loaded env: ${JSON.stringify(ENV)}`);

const connections = new Map<string, NodeStreamableHTTPServerTransport>();

const server = createMcpFastifyApp();
server.register(cors, {});
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
	const sessionId = request.headers["mcp-session-id"] as string | undefined;

	if (!sessionId && !isInitializeRequest(request.body)) {
		console.warn(`Session id not specified in headers`);
		reply.status(404).send({
			jsonrpc: "2.0",
			error: {
				code: -32_000,
				message: "Session id not specified in headers as 'mcp-session-id'",
			},
			id: null,
		});
		return;
	}

	let connection = sessionId ? connections.get(sessionId) : undefined;
	if (!connection) {
		console.log(`['${sessionId}'] session initializing...`);
		connection = new NodeStreamableHTTPServerTransport({
			sessionIdGenerator: () => randomUUID(),
			onsessioninitialized: (sessionId) => {
				if (!connection) {
					console.error(`['${sessionId}'] connection undefined`);
					return;
				}

				connections.set(sessionId, connection);
				console.log(`['${sessionId}'] session initialized`);
			},
			onsessionclosed: (sessionId) => {
				connections.delete(sessionId);
				console.log(`['${sessionId}'] session closed`);
			},
		});

		await mcp.connect(connection);
	}

	await connection.handleRequest(request.raw, reply.raw, request.body);
});

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 666;
server.listen({ port: port }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
