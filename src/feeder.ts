import Parser from 'rss-parser';
import { Telegram } from 'telegraf';
import moment from 'moment';
import { hyperlink } from './markdown';

const parser: Parser = new Parser({});

export class Feeder {
  interval: number = Number(process.env.FEED_REFRESH_INTERVAL) || 30 as number; // in minutes
  telegram: Telegram;
  channelId: string | number;
  sources: string[];
  processInterval: any;

  constructor(telegram: Telegram, channelId: string | number) {
    this.telegram = telegram;
    this.channelId = channelId;
    this.interval = this.interval * 60 * 1000;
    this.sources = ['https://censor.net/includes/news_uk.xml' ,'https://www.liga.net/news/top/rss.xml', 'https://feeds.bbci.co.uk/news/world/rss.xml'];
    this.processInterval = null;
  }

  broadcast = async () => {
    try {
      console.info('Process started');
      const sourcesPromises = this.sources.map(s => parser.parseURL(s));
      let feeds = await Promise.allSettled(sourcesPromises);
      feeds = feeds.filter(f => f.status === 'fulfilled');
      let news = feeds.reduce((previousValue: any[], currentValue: any) => ([...previousValue, ...currentValue.value.items]),[]);
      const date = moment().subtract(this.interval, 'milliseconds');
      news = news.filter(item => moment(item.pubDate).isAfter(date));
      news = news.slice(0, 29);
      news.forEach(item => this.telegram.sendMessage(this.channelId, hyperlink(item.title, item.link)));
    } catch (e: any) {
      throw new Error(e);
    }
  }

  stop = (message: string) => {
    clearInterval(this.processInterval);
    console.warn(message);
  }

  launch = () => {
    this.processInterval = setInterval(this.broadcast, this.interval);
  }
}
