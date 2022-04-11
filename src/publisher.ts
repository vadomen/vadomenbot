import { Telegram } from 'telegraf';
import { hyperlink } from './helpers';
import { Rss } from './rss';

const interval = (Number(process.env.FEED_REFRESH_INTERVAL) || 30) * 60 * 1000;
const rss = new Rss(interval);

export class Publisher {
  telegram: Telegram;
  channelId: string | number;
  processInterval: any;

  constructor(telegram: Telegram, channelId: string | number) {
    this.telegram = telegram;
    this.channelId = channelId;
    this.processInterval = null;
  }

  _publish = async () => {
    try {
      console.info('Process started');
      const news = await rss.getContent();
      news.forEach(item => this.telegram.sendMessage(this.channelId, hyperlink(item.title, item.link), { parse_mode: "HTML" }));
    } catch (e: any) {
      throw new Error(e);
    }
  }

  stop = (message: string) => {
    clearInterval(this.processInterval);
    console.warn(message);
  }

  launch = async () => {
    if(process.env.NODE_ENV === 'production') {
      this.processInterval = setInterval(this._publish, interval);
    }
    if(process.env.NODE_ENV === 'development') {
      await this._publish();
    }
  }
}
