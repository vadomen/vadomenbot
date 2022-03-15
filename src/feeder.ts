import RssFeedEmitter from 'rss-feed-emitter';
const feeder = new RssFeedEmitter();

const interval: number = Number(process.env.FEED_REFRESH_INTERVAL) || 60 as number;

const launch = (telegram: any, chatName: String) => {
  feeder.add({
    url: 'https://www.liga.net/news/top/rss.xml',
    refresh: interval * 60 * 1000, // 10 minutes
    eventName: 'liga'
  });

  let delay = 1000;

  feeder.on('liga', function(item: any) {
    const message = `${item.title}
  ${item.link}`;
    if(delay > 15000) delay = 1000;
    setTimeout(() => telegram.sendMessage(chatName, message), delay);
    delay = delay + 500;
  });
};

const Feeder = {
  launch
}

export {
  Feeder,
}
