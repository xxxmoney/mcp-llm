import fastify from "fastify";

const server = fastify();

server.get("/", async (request, reply) => {
	return "I am alive!";
});

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 666;
server.listen({ port: port }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
