import { loadConfig } from './config';
import { telegram, bot } from './handlers';
import { Feeder } from './feeder';

loadConfig();
bot.launch();

const chatId: string = process.env.CHANNEL_NAME as string;
const feeder = new Feeder(telegram, chatId);
feeder.launch()

process.once('SIGINT', () => {
  bot.stop('BOT_SIGINT');
  feeder.stop('FEEDER SIGTERM');
});
process.once('SIGTERM', () => {
  bot.stop('BOT_SIGTERM');
  feeder.stop('FEEDER_SIGTERM');
});
