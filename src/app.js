import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import parser from './parser';
import identify from './identifier';
import viewInit from './view';
import en from './locales/en';
import addProxyToLink from './utils';
import updateFeeds from './updator';

const validate = (value, arr) => {
  const schema = yup.string().url();
  try {
    schema.validateSync(value);
    const checkDouble = arr
      .find(({ link }) => link === value);
    if (checkDouble === undefined) {
      throw new Error(i18next.t('msg.errors.dublicatedLink'));
    }
    return null;
  } catch (err) {
    return err.message;
  }
};

export default () => {
  const state = {
    form: {
      state: 'editing',
      field: {
        valid: true,
        error: null,
      },
    },
    data: {
      feeds: [],
      posts: [],
    },
    lastPostIds: {},
    error: null,
  };

  i18next.init({
    lng: 'en',
    debug: true,
    resources: {
      en,
    },
  });

  const watchedState = viewInit(state);
  const form = document.querySelector('.rss-form');
  const input = form.querySelector('input');
  updateFeeds(watchedState);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const link = input.value;
    const error = validate(link, watchedState.data.feeds);
    if (error) {
      watchedState.form.field = {
        valid: false,
        error,
      };
      return;
    }
    watchedState.form.field = {
      valid: true,
      error: null,
    };
    const corsUrl = addProxyToLink(link);
    watchedState.form.state = 'sending';
    axios.get(corsUrl)
      .then((response) => {
        const { feeds, posts } = watchedState.data;
        const { lastPostIds } = watchedState;
        const data = parser(response.data);
        const newFeed = identify(data, link);
        watchedState.data = {
          feeds: [newFeed.feed, ...feeds],
          posts: [...newFeed.posts, ...posts],
        };
        watchedState.lastPostIds = {
          ...lastPostIds,
          ...newFeed.lastId,
        };
        watchedState.error = null;
        watchedState.form.state = 'finished';
      })
      .catch((err) => {
        watchedState.form.state = 'failured';
        watchedState.error = err.message;
      });
  });
  input.addEventListener('input', () => {
    watchedState.form.state = 'editing';
    watchedState.form.error = null;
  });
};
