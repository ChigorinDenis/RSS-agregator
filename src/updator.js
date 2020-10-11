/* eslint no-param-reassign: 0 */
import {
  omit,
  isEqual,
  uniqueId,
  set,
} from 'lodash';
import axios from 'axios';

import parser from './parser';

const update = (state) => {
  const { feeds, posts } = state.data;
  const oldPosts = posts.map((post) => set(post, 'statusPub', 'old'));
  const savedPosts = posts.map((post) => (omit(post, ['id', 'feedId', 'statusPub'])));
  const queries = feeds.map(({ link }) => axios.get(link));
  const newPosts = [];
  const promise = Promise.all(queries);
  promise.then((responses) => {
    responses.forEach((response) => {
      const data = parser(response.data);
      const link = response.request.responseURL;
      const { id: feedId } = feeds.find((item) => item.link === link);
      const recievedPosts = data.posts;
      console.log(link);
      recievedPosts.forEach((rcPost) => {
        if (savedPosts.find((svPost) => isEqual(rcPost, svPost)) === undefined) {
          newPosts.push({
            id: uniqueId(),
            ...rcPost,
            feedId,
            statusPub: 'new',
          });
        }
      });
    });
  })
    .then(() => {
      state.data.posts = [...oldPosts, ...newPosts];
      setTimeout(() => update(state), 10000);
    });
};

export default update;
