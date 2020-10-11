import onChange from 'on-change';
import i18next from 'i18next';
import { groupBy } from 'lodash';

const updateTextMsg = (text, type) => {
  const msg = document.querySelector('.msg');
  msg.className = `msg text-${type}`;
  msg.innerText = text;
};

const makePost = (item) => {
  const {
    link,
    description,
    title,
    id,
  } = item;
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

export default (state) => (
  onChange(state, (path, value) => {
    const input = document.querySelector('input');
    const button = document.querySelector('button');
    const content = document.querySelector('#content');
    if (path === 'addingProcess.state') {
      switch (value) {
        case 'editing': {
          input.disabled = state.addingProcess.inputDisabled;
          button.disabled = state.addingProcess.submitDisabled;
          break;
        }
        case 'sending': {
          input.disabled = state.addingProcess.inputDisabled;
          button.disabled = state.addingProcess.submitDisabled;
          break;
        }
        case 'finished': {
          input.disabled = state.addingProcess.inputDisabled;
          button.disabled = state.addingProcess.submitDisabled;
          const divRow = document.createElement('div');
          divRow.className = 'row';
          divRow.setAttribute('id', 'content');
          updateTextMsg(i18next.t('msg.success'), 'success');
          const { feeds, posts } = state.data;
          feeds.forEach((feed) => {
            const h2 = document.createElement('h2');
            const p = document.createElement('p');
            const ul = document.createElement('ul');
            const { id, title, description } = feed;
            p.innerText = description;
            ul.className = 'list-group col-md-10 col-lg-8 mx-auto';
            ul.setAttribute('id', id);
            h2.innerText = title;
            const filtered = posts.filter(({ feedId }) => feedId === id);
            const postElems = filtered.map(makePost);
            ul.append(h2, p, ...postElems);
            divRow.append(ul);
          });
          content.innerHTML = '';
          content.append(divRow);
          break;
        }
        default: break;
      }
    }
    if (path === 'addingProcess.errors') {
      const { errors } = state.addingProcess;
      const [text] = errors;
      if (errors.length !== 0) {
        updateTextMsg(text, 'danger');
      } else {
        updateTextMsg('', '');
      }
    }
    if (path === 'data.posts') {
      const { posts } = state.data;
      const filtered = posts.filter((item) => item.statusPub === 'new');
      if (filtered.length !== 0) {
        const grouped = groupBy(filtered, 'feedId');
        Object.entries(grouped).forEach(([id, items]) => {
          const ul = document.getElementById(id);
          const postElem = items.map(makePost);
          ul.append(...postElem);
        });
      }
    }
  })
);
