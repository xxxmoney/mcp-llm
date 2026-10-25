import { config } from "dotenv";
import { z } from "zod";

const cfg = config(); // Load .env
console.debug("Loaded .env config: ", JSON.stringify(cfg));

const envSchema = z.object({
	BASE_URL: z
		.string()
		.refine((url) => url.startsWith("http://") || url.startsWith("https://")),
	TOKEN: z.string().optional(),
	MODEL: z.string(),
	PORT: z.string(),
	EXTERNAL_PORT: z.string(),
});

type Env = z.infer<typeof envSchema>;

export const ENV: Env = envSchema.parse(process.env); // Will be supplied either from .env or injected from docker
console.debug("Parsed environment variables: ", JSON.stringify(ENV));
