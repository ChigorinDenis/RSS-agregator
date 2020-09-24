import * as yup from 'yup';
import axios from 'axios';
import url from 'url';
import parser from './parser';
import view from './view';

const schema = yup.string().url();

export default () => {
  const state = {
    addingProcess: {
      state: 'editing',
      validationState: 'valid',
      submitDisabled: false,
      inputDisabled: false,
      errors: [],
    },
    links: [],
    data: {
      feeds: [],
      posts: [],
    },
  };
  const watchedState = view(state);
  const form = document.querySelector('.rss-form');
  const input = form.querySelector('input');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const link = input.value;
    const proxy = 'cors-anywhere.herokuapp.com';
    schema.validate(link)
      .then((value) => {
        if (watchedState.links.includes(value)) {
          throw new Error('url has already added');
        }
        return value;
      })
      .then((value) => {
        watchedState.addingProcess.submitDisabled = true;
        watchedState.addingProcess.inputDisabled = true;
        watchedState.addingProcess.validationState = 'valid';
        watchedState.addingProcess.errors = [];
        watchedState.addingProcess.state = 'sending';
        const { hostname, pathname } = url.parse(value);
        const corsUrl = `https://${proxy}/${hostname}${pathname}`;
        return axios.get(corsUrl);
      })
      .then((response) => {
        watchedState.links.push(link);
        watchedState.addingProcess.submitDisabled = false;
        watchedState.addingProcess.inputDisabled = false;
        const { feeds, posts } = watchedState.data;
        const newFeed = parser(response.data);
        watchedState.data = {
          feeds: [newFeed.feed, ...feeds],
          posts: [...newFeed.posts, ...posts],
        };
        watchedState.addingProcess.state = 'finished';
      })
      .catch((err) => {
        watchedState.addingProcess.errors = [err.message];
      });
  });
};
