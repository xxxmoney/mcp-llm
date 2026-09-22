import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse";
import fastify, { type RouteGenericInterface } from "fastify";
import mcp from "./mcp.ts";

const server = fastify();
const connections = new Map<string, SSEServerTransport>();

server.removeAllContentTypeParsers();
server.addContentTypeParser("*", (req, payload, done) => {
	done(null, payload); // Handle raw
});

server.get("/", async (request, reply) => {
	return "I am alive!";
});

server.get("/mcp", async (request, reply) => {
	reply.hijack(); // Handle response by connection (left open for SSE)

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

interface Messages extends RouteGenericInterface {
	Querystring: {
		sessionId: string;
	};
}
server.post<Messages>("/messages", async (request, reply) => {
	reply.hijack(); // Handle response by connection

	const sessionId = request.query.sessionId;

	const connection = connections.get(sessionId);
	if (!connection) {
		console.warn(`No active connection for: '${sessionId}'`);
		return reply.code(400).send("No active connection");
	}

	await connection.handlePostMessage(request.raw, reply.raw);
});

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 666;
server.listen({ port: port }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
