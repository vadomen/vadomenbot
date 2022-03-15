import RssFeedEmitter from 'rss-feed-emitter';
const feeder = new RssFeedEmitter();

const launch = (telegram: any, chatName: String) => {
  feeder.add({
    url: 'https://www.liga.net/news/top/rss.xml',
    refresh: 10 * 60 * 1000, // 10 minutes
    eventName: 'liga'
  });

  feeder.on('liga', function(item: any) {
    const message = `${item.title}
  ${item.link}`;
    setTimeout(() => telegram.sendMessage(chatName, message), 1000);
  });
};

const Feeder = {
  launch
}

export {
  Feeder,
}
