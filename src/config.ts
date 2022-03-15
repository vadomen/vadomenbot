import { EnvType, load } from 'ts-dotenv';

export type Config = EnvType<typeof schema>;

export const schema = {
    NODE_ENV: String,
    BOT_TOKEN: String,
    CHANNEL_NAME: String,
    FEED_REFRESH_INTERVAL: Number,
};

export let config: Config;

export function loadConfig(): void {
    config = load(schema);
}
