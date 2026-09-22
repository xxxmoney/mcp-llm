import fastify from "fastify";

const server = fastify();

server.get("/", async (request, reply) => {
	return "I am alive!";
});

server.listen({ port: 666 }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
