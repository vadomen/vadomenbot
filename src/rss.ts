import Parser from 'rss-parser';
import moment from 'moment';
import { channels } from './config';

const parser: Parser = new Parser({});

export class Rss {
  interval: number;

  constructor(interval: number) {
    this.interval = interval;
  }

  findAll() {
    return channels();
  }

  async getUrlList(): Promise<string[]> {
    try {
      const sources  = await this.findAll();
      return sources.map(s => s.url);
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  getContent = async () => {
    try {
      const urls = await this.getUrlList();
      if(!urls.length) return console.warn('No urls found');
      const sourcesPromises = urls.map(s => parser.parseURL(s));
      let feeds = await Promise.allSettled(sourcesPromises);
      feeds = feeds.filter(f => f.status === 'fulfilled');
      let news = feeds.reduce((previousValue: any[], currentValue: any) => ([...previousValue, ...currentValue.value.items]),[]);
      const date = moment().subtract(this.interval, 'milliseconds');
      news = news.filter(item => moment(item.pubDate).isAfter(date));
      return news.slice(0, 29);
    } catch (e: any) {
      console.error(e);
    }
  }
}
