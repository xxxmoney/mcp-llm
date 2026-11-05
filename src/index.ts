import { ENV } from "./env.js";
import { app } from "./mcp.js";

await app.startHttpServer({ host: ENV.HOST, port: ENV.PORT });
