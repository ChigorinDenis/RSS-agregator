import { uniqueId } from 'lodash';

export default (obj) => {
  const feedId = uniqueId();
  const { feed, posts } = obj;
  const mappedPosts = posts.map((post) => ({
    ...post,
    id: uniqueId(),
    statusPub: 'old',
    feedId,
  }));
  return {
    feed: {
      ...feed,
      id: feedId,
    },
    posts: mappedPosts,
  };
};
