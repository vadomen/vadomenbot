import { EnvType, load } from 'ts-dotenv';

export type Config = EnvType<typeof schema>;

export const schema = {
    NODE_ENV: String,
    BOT_TOKEN: String,
};

export let config: Config;

export function loadConfig(): void {
    config = load(schema);
}
