import onChange from 'on-change';
import { fetchRSS, parseRSS } from './rss.js';
import { renderFeeds, renderPosts, renderModal, renderForm } from './view.js';

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
    renderFeeds(watchedState);
  }

  if (path.startsWith('posts') || path.startsWith('ui.viewedPosts')) {
    renderPosts(watchedState);
  }

  if (path === 'ui.modalPostId') {
    renderModal(watchedState);
  }

  if (path.startsWith('form')) {
    renderForm(watchedState.form);
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
try {
  new URL(url);
} catch {
  watchedState.form.status = 'error';
  watchedState.form.error = 'invalidUrl';
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
.catch((e) => {
  watchedState.form.status = 'error';

  if (e.message === 'Network Error') {
    watchedState.form.error = 'network';
  } else if (e.message === 'Invalid RSS') {
    watchedState.form.error = 'noRss';
  } else {
    watchedState.form.error = 'unknown';
  }
});

        if (e.message === 'Network Error') {
          watchedState.form.error = 'network';
        } else if (e.message === 'Invalid RSS') {
          watchedState.form.error = 'noRss';
        } else {
          watchedState.form.error = 'unknown';
        }
      };

  postsContainer.addEventListener('click', (e) => {
    const { id } = e.target.dataset;

    if (!id) return;

    watchedState.ui.viewedPosts.add(id);
    watchedState.ui.modalPostId = id;
  });
