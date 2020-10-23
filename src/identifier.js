import { uniqueId, last } from 'lodash';

export default (obj, link) => {
  const feedId = uniqueId();
  const { feed, posts } = obj;
  const mappedPosts = posts.map((post) => ({
    ...post,
    id: uniqueId(),
    feedId,
  }));
  const lastId = last(mappedPosts).id;
  return {
    feed: {
      ...feed,
      link,
      id: feedId,
    },
    posts: mappedPosts,
    lastId: {
      [feedId]: lastId,
    },
  };
};
