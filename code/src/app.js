import { renderFeeds, renderPosts, renderModal } from './view.js';
import onChange from 'on-change';

export default function initApp() {
 const watchedState = onChange(state, (path) => {
  if (path.startsWith('feeds')) {
    renderFeeds(state.feeds);
  }

  if (path.startsWith('posts') || path.startsWith('ui.viewedPosts')) {
    renderPosts(state.posts, state);
  }

  if (path === 'ui.modalPostId') {
    renderModal(state);

    const modal = new bootstrap.Modal(
      document.getElementById('modal')
    );
    modal.show();
  }
});

  const form = document.querySelector('form');

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
}
const checkUpdates = (watchedState) => {
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

      })
  );

  Promise.all(promises)
    .finally(() => {
      setTimeout(() => checkUpdates(watchedState), 5000);
    });
};