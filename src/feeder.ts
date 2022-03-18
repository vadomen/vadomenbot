import Parser from 'rss-parser';
import { Telegram } from 'telegraf';
import moment from 'moment';

const parser: Parser = new Parser({});

export class Feeder {
  interval: number = Number(process.env.FEED_REFRESH_INTERVAL) || 30 as number; // in minutes
  telegram: Telegram;
  channelId: string | number;
  sources: string[];

  constructor(telegram: Telegram, channelId: string | number) {
    this.telegram = telegram;
    this.channelId = channelId;
    this.interval = this.interval * 60 * 1000;
    this.sources = ['https://censor.net/includes/news_uk.xml' ,'https://www.liga.net/news/top/rss.xml'];
  }

  broadcast = async () => {
    try {
      console.info('Process started');
      const sourcesPromises = this.sources.map(s => parser.parseURL(s));
      let feeds = await Promise.allSettled(sourcesPromises);
      feeds = feeds.filter(f => f.status === 'fulfilled');
      let news = feeds.reduce((previousValue: any[], currentValue: any) => ([...previousValue, ...currentValue.value.items]),[]);
      news = news.slice(0, 29);
      const date = moment().subtract(this.interval, 'milliseconds');
      news.forEach(item => {
        if(moment(item.pubDate).isAfter(date)) {
          const message = `${item.link} ${item.pubDate}`;
          this.telegram.sendMessage(this.channelId, message);
        }
      });
    } catch (e: any) {
      throw new Error(e);
    }
  }
  launch = () => {
    this.broadcast();
    setInterval(this.broadcast, this.interval);
  }
}
