import { loadConfig } from './config';
import { bot } from './handlers';
loadConfig();

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
