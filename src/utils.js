import url from 'url';

const proxy = {
  cors: 'cors-anywhere.herokuapp.com',
};

const addProxyToLink = (link) => {
  const { hostname, pathname } = url.parse(link);
  return `https://${proxy.cors}/${hostname}${pathname}`;
};

export default addProxyToLink;
