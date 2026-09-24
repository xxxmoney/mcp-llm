import { config } from "dotenv";
import { z } from "zod";

const value = config();

const envSchema = z.object({
	URL: z
		.string()
		.refine((url) => url.startsWith("http://") || url.startsWith("https://")),
	TOKEN: z.string().optional(),
	MODEL: z.string().refine((model) => model.startsWith("models/")),
});

type Env = z.infer<typeof envSchema>;

export const ENV: Env = envSchema.parse(value.parsed);
