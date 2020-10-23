import onChange from 'on-change';
import i18next from 'i18next';
import { groupBy } from 'lodash';

const updateTextMsg = (text, type) => {
  const msg = document.querySelector('.msg');
  msg.className = `msg text-${type}`;
  msg.innerText = text;
};

const buildPostElement = (post) => {
  const {
    link,
    description,
    title,
    id,
  } = post;
  const li = document.createElement('li');
  li.className = 'list-group-item';
  li.setAttribute('id', id);
  const a = document.createElement('a');
  a.setAttribute('href', link);
  a.innerText = title;
  const div = document.createElement('div');
  div.innerText = description;
  li.append(a, div);
  return li;
};

const buildFeedSection = ({ data }) => {
  const divRow = document.createElement('div');
  divRow.className = 'row';
  divRow.setAttribute('id', 'content');
  updateTextMsg(i18next.t('msg.success'), 'success');
  const { feeds, posts } = data;
  const feedSections = feeds.map((feed) => {
    const h2 = document.createElement('h2');
    const p = document.createElement('p');
    const ul = document.createElement('ul');
    const { id, title, description } = feed;
    p.innerText = description;
    ul.className = 'list-group col-md-10 col-lg-8 mx-auto';
    ul.setAttribute('id', id);
    h2.innerText = title;
    const filtered = posts.filter(({ feedId }) => feedId === id);
    const postElems = filtered.map(buildPostElement);
    ul.append(h2, p, ...postElems);
    divRow.append(ul);
    return divRow;
  });
  return feedSections;
};
const renderAppError = (error) => {
  if (!error) return;
  const alert = document.querySelector('.alert');
  alert.innerText = error;
  alert.classList.remove('invisible');
  setTimeout(() => alert.classList.add('invisible'), 5000);
};

export default (state) => (
  onChange(state, (path, value) => {
    const input = document.querySelector('input');
    const button = document.querySelector('button');
    const form = document.querySelector('.rss-form');
    const content = document.querySelector('#content');
    if (path === 'form.state') {
      switch (value) {
        case 'editing': {
          input.disabled = false;
          button.disabled = false;
          break;
        }
        case 'sending': {
          input.disabled = true;
          button.disabled = true;
          break;
        }
        case 'finished': {
          input.disabled = false;
          button.disabled = false;
          const feedSection = buildFeedSection(state);
          content.innerHTML = '';
          content.append(...feedSection);
          break;
        }
        case 'failured': {
          input.disabled = false;
          button.disabled = false;
          input.select();
          break;
        }
        default:
          throw Error(`Unknown form status: ${form.status}`);
      }
    }
    if (path === 'form.field') {
      const { field } = state.form;
      if (field.valid) {
        input.classList.remove('is-invalid');
        updateTextMsg('', '');
      } else {
        input.classList.remove('is-invalid');
        updateTextMsg(field.error, 'danger');
      }
    }
    if (path === 'error') {
      renderAppError(state.error);
    }
    if (path === 'data.posts') {
      const { posts } = state.data;
      if (posts.length !== 0) {
        const grouped = groupBy(posts, 'feedId');
        Object.entries(grouped).forEach(([feedId, items]) => {
          const ul = document.getElementById(feedId);
          const lastId = state.lastPostIds[Number(feedId)];
          const postElem = items
            .filter((elem) => Number(elem.id) > Number(lastId))
            .map(buildPostElement);
          ul.append(...postElem);
        });
      }
    }
  })
);
