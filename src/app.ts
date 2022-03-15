import { loadConfig } from './config';
import { bot, telegram } from './handlers';
import { Feeder } from './feeder';

loadConfig();

const chatName: string = process.env.CHANNEL_NAME as string;
bot.launch();
Feeder.launch(telegram, chatName)

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
