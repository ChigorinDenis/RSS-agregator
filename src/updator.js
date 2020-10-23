/* eslint no-param-reassign: 0 */
import {
  omit,
  isEqual,
  uniqueId,
} from 'lodash';
import axios from 'axios';
import parser from './parser';
import addProxyToLink from './utils';

const updateFeeds = (state) => {
  console.log('поехали');
  const { feeds, posts } = state.data;
  const { lastPostIds } = state;
  const oldPosts = posts.map((post) => (omit(post, [])));
  const savedPosts = posts.map((post) => (omit(post, ['id', 'feedId'])));
  const links = feeds.map(({ link }) => link);
  const queries = feeds.map(({ link }) => {
    const corsURL = addProxyToLink(link);
    return axios.get(corsURL);
  });
  const newPosts = [];
  const newLastPostIds = {};
  const promise = Promise.all(queries);
  promise.then((responses) => {
    responses.forEach((response, index) => {
      const data = parser(response.data);
      const link = links[index];
      const { id: feedId } = feeds.find((item) => item.link === link);
      const recievedPosts = data.posts;
      recievedPosts.forEach((rcPost) => {
        if (savedPosts.find((svPost) => isEqual(rcPost, svPost)) === undefined) {
          const newId = uniqueId();
          newLastPostIds[feedId] = newId;
          newPosts.push({
            ...rcPost,
            id: newId,
            feedId,
          });
        }
      });
    });
  })
    .then(() => {
      state.data.posts = [...oldPosts, ...newPosts];
      state.lastPostIds = { ...lastPostIds, ...newLastPostIds };
      setTimeout(() => updateFeeds(state), 5000);
    });
};

export default updateFeeds;
