import onChange from 'on-change';
import { fetchRSS, parseRSS } from './rss.js';
import {
  renderFeeds,
  renderPosts,
  renderModal,
  renderForm,
} from './view.js';

export default () => {
  const state = {
    feeds: [],
    posts: [],
    form: {
      status: 'filling',
      error: null,
    },
    ui: {
      viewedPosts: new Set(),
      modalPostId: null,
    },
  };

  const watchedState = onChange(state, (path) => {
    if (path.startsWith('feeds')) {
      renderFeeds(state);
    }

    if (path.startsWith('posts')) {
      renderPosts(state);
    }

    if (path.startsWith('form')) {
      renderForm(state.form);
    }

    if (path === 'ui.modalPostId') {
      renderModal(state);
    }

    if (path === 'ui.viewedPosts') {
      renderPosts(state);
    }
  });

  const form = document.querySelector('form');
  const postsContainer = document.querySelector('.posts');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const url = new FormData(form).get('url');

    watchedState.form.status = 'sending';
    watchedState.form.error = null;

    fetchRSS(url)
      .then(parseRSS)
      .then(({ feed, posts }) => {
        const exists = watchedState.feeds.some((f) => f.url === url);
        if (exists) {
          watchedState.form.status = 'error';
          watchedState.form.error = 'exists';
          return;
        }

        const feedId = crypto.randomUUID();

        watchedState.feeds.push({
          id: feedId,
          url,
          ...feed,
        });

        const normalizedPosts = posts.map((post) => ({
          id: crypto.randomUUID(),
          feedId,
          ...post,
        }));

        watchedState.posts.push(...normalizedPosts);

        watchedState.form.status = 'success';
      })
.catch((err) => {
  watchedState.form.status = 'error';
  watchedState.form.error = err.message;

        if (e.message === 'Network Error') {
          watchedState.form.error = 'network';
        } else if (e.message === 'Invalid RSS') {
          watchedState.form.error = 'noRss';
        } else {
          watchedState.form.error = 'unknown';
        }
      });
  });

  postsContainer.addEventListener('click', (e) => {
    const { id } = e.target.dataset;

    if (!id) return;

    watchedState.ui.viewedPosts.add(id);
    watchedState.ui.modalPostId = id;
  });
  
};