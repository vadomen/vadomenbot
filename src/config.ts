import { EnvType, load } from 'ts-dotenv';

const schema = {
  NODE_ENV: String,
  BOT_TOKEN: String,
  CHANNEL_NAME: String,
  FEED_REFRESH_INTERVAL: Number,
};

export type Config = EnvType<typeof schema>;

export let config: Config;

export function loadConfig(): void {
    config = load(schema);
}

export const channels = () => {
  const rss = [{
    id: '1',
    name: 'Cenzornet',
    creator: 'Vadim',
    url: 'https://censor.net/includes/news_uk.xml',
    active: true,
    dateCreated: Date.now(),
  },
    {
      id: '2',
      name: 'liga',
      creator: 'Vadim',
      url: 'https://www.liga.net/news/top/rss.xml',
      active: true,
      dateCreated: Date.now(),
    }
  ];
  return Promise.resolve(rss);
}
