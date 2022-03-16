import { loadConfig } from './config';
import { telegram, bot } from './handlers';
import { Feeder } from './feeder';

loadConfig();
bot.launch();

const chatId: string = process.env.CHANNEL_NAME as string;
const feeder = new Feeder(telegram, chatId);
feeder.launch()

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
