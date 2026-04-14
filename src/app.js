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
      renderFeeds(watchedState.feeds);
    }

    if (path.startsWith('posts') || path.startsWith('ui.viewedPosts')) {
      renderPosts(watchedState.posts, watchedState);
    }

    if (path === 'ui.modalPostId') {
      renderModal(watchedState);
    }

    if (path.startsWith('form')) {
      renderForm(watchedState.form);
    }
  });

  // 🔥 КРИТИЧНО — начальный рендер
  renderForm(watchedState.form);

  const form = document.querySelector('form');
  const postsContainer = document.querySelector('.posts');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const url = String(new FormData(form).get('url') ?? '').trim();

    try {
      new URL(url);
    } catch {
      watchedState.form.status = 'error';
      watchedState.form.error = 'invalidUrl';
      return;
    }

    if (watchedState.feeds.some((feed) => feed.url === url)) {
      watchedState.form.status = 'error';
      watchedState.form.error = 'exists';
      return;
    }

    watchedState.form.status = 'sending';
    watchedState.form.error = null;

    fetchRSS(url)
      .then(parseRSS)
      .then(({ feed, posts }) => {
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
        form.reset();
      })
      .catch((error) => {
        watchedState.form.status = 'error';

        if (error.message === 'Network Error') {
          watchedState.form.error = 'network';
        } else if (error.message === 'Invalid RSS') {
          watchedState.form.error = 'noRss';
        } else {
          watchedState.form.error = 'unknown';
        }
      });
  });

  postsContainer.addEventListener('click', (e) => {
    const element = e.target.closest('[data-id]');
    if (!element) return;

    const { id } = element.dataset;

    watchedState.ui.viewedPosts.add(id);
    watchedState.ui.modalPostId = id;
  });
};