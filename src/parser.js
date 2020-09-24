import { uniqueId } from 'lodash';

const getContent = (node, name) => (node.querySelector(name).innerHTML);

export default (xml) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const channel = doc.querySelector('channel');
  const items = Array.from(doc.getElementsByTagName('item'));
  const feedId = uniqueId();
  const feed = {
    id: feedId,
    title: getContent(channel, 'title'),
    description: getContent(channel, 'description'),
    link: getContent(channel, 'link'),
  };
  const posts = items.map((item) => ({
    id: uniqueId(),
    title: getContent(item, 'title'),
    description: getContent(item, 'description'),
    link: getContent(item, 'link'),
    feedId,
  }));
  return {
    feed,
    posts,
  };
};
