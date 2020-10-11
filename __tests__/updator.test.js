/* eslint-disable no-underscore-dangle */
import nock from 'nock';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import update from '../src/updator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '__fixtures__', filename);

const xml = fs.readFileSync(getFixturePath('data.xml'), 'utf-8');

const state = {
  data: {
    feeds: [
      {
        id: 1,
        title: 'Новые уроки на Хекслете',
        description: 'Практические уроки по программированию',
        link: 'https://ru.hexlet.io/',
      },
    ],
    posts: [],
  },
};

test('update testing', () => {
  nock('https://ru.hexlet.io')
    .get('/')
    .reply(200, xml);
  update(state);
  expect([]).toEqual(state.data.posts);
});
