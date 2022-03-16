import Parser from 'rss-parser';
import { Telegram } from 'telegraf';
import moment from 'moment';

const parser: Parser = new Parser({});

export class Feeder {
  interval: number = Number(process.env.FEED_REFRESH_INTERVAL) || 60 as number;
  telegram: Telegram;
  channelId: string | number;
  sources: string[];

  constructor(telegram: Telegram, channelId: string | number) {
    this.telegram = telegram;
    this.channelId = channelId;
    this.interval = this.interval * 60 * 1000; // 1 hour
    this.sources = ['https://censor.net/includes/news_uk.xml', 'https://fakty.ua/rss_feed/ukraine' ,'https://www.liga.net/news/top/rss.xml'];
  }

  broadcast = async () => {
    try {
      const sourcesPromises = this.sources.map(s => parser.parseURL(s));
      let feeds = await Promise.allSettled(sourcesPromises);
      feeds = feeds.filter(f => f.status === 'fulfilled');
      const news = feeds.reduce((previousValue: any[], currentValue: any) => ([...previousValue, ...currentValue.value.items]),[]);
      const date = moment().subtract(this.interval, 'milliseconds');
      console.log(date.format());
      news.forEach(item => {
        if(moment(item.pubDate).isAfter(date)) {
          const message = `${item.title} ${item.link} ${item.pubDate} `;
          this.telegram.sendMessage(this.channelId, message)
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
