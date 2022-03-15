import RssFeedEmitter from 'rss-feed-emitter';
const feeder = new RssFeedEmitter();

const launch = (telegram: any, chatName: String) => {
  feeder.add({
    url: 'https://www.liga.net/news/top/rss.xml',
    refresh: 5000,
    eventName: 'liga'
  });

  feeder.on('liga', function(item: any) {
    const message = `${item.title}
  ${item.link}`;
    telegram.sendMessage(chatName, message);
  });
};

const Feeder = {
  launch
}

export {
  Feeder,
}
