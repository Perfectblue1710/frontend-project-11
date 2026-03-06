import onChange from 'on-change';
import { fetchRSS, parseRSS } from './rss.js';
import { renderFeeds, renderPosts, renderModal } from './view.js';

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
      renderFeeds(state.feeds);
    }

    if (path.startsWith('posts')) {
      renderPosts(state.posts, state);
    }

    if (path === 'ui.modalPostId') {
      renderModal(state);
    }

    if (path === 'ui.viewedPosts') {
      renderPosts(state.posts, state);
    }
  });

  const form = document.querySelector('form');
  const postsContainer = document.querySelector('.posts');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const url = new FormData(form).get('url');

    watchedState.form.status = 'sending';

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
      })
      .catch(() => {
        watchedState.form.status = 'error';
      });
  });

  postsContainer.addEventListener('click', (e) => {
    const { id } = e.target.dataset;

    if (!id) {
      return;
    }

    watchedState.ui.viewedPosts.add(id);
    watchedState.ui.modalPostId = id;
  });

  const checkUpdates = () => {
    const { feeds } = watchedState;

    const promises = feeds.map((feed) =>
      fetchRSS(feed.url)
        .then(parseRSS)
        .then(({ posts }) => {
          const existingLinks = watchedState.posts.map((post) => post.link);

          const newPosts = posts
            .filter((post) => !existingLinks.includes(post.link))
            .map((post) => ({
              id: crypto.randomUUID(),
              feedId: feed.id,
              ...post,
            }));

          watchedState.posts.unshift(...newPosts);
        })
        .catch(() => {
          // ошибки игнорируем
        })
    );

    Promise.all(promises).finally(() => {
      setTimeout(checkUpdates, 5000);
    });
  };

  checkUpdates();
};