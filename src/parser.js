const getContent = (node, name) => (node.querySelector(name).innerHTML);

export default (xml) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const channel = doc.querySelector('channel');
  const items = Array.from(doc.getElementsByTagName('item'));
  const feed = {
    title: getContent(channel, 'title'),
    description: getContent(channel, 'description'),
  };
  const posts = items.map((item) => ({
    title: getContent(item, 'title'),
    description: getContent(item, 'description'),
    link: getContent(item, 'link'),
  }));
  return {
    feed,
    posts,
  };
};
