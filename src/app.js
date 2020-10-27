import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import parseXML from './parser';
import identify from './identifier';
import viewInit from './view';
import en from './locales/en';
import addProxyToLink from './utils';
import runUpdatorFeeds from './updator';

const validate = (value, feeds) => {
  const links = feeds.map(({ link }) => link);
  const schema = yup
    .string()
    .url()
    .notOneOf(links, i18next.t('msg.errors.dublicatedLink'));
  try {
    schema.validateSync(value);
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
  })
    .then(() => {
      const lead = document.querySelector('.lead');
      const button = document.querySelector('button');
      lead.innerHTML = i18next.t('lead');
      button.innerHTML = i18next.t('addFeed');
    });

  const watchedState = viewInit(state);
  const form = document.querySelector('.rss-form');
  const input = form.querySelector('input');
  runUpdatorFeeds(watchedState);

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
        const data = parseXML(response.data);
        const newFeed = identify(data, link); // name 'identify' is a verb(action)
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
