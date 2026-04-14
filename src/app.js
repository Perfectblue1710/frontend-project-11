import onChange from 'on-change';
import { fetchRSS, parseRSS } from './rss.js';
import {
  renderFeeds,
  renderPosts,
  renderModal,
  renderForm,
} from './view.js';
import initI18n from './i18n.js';

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default async () => {
  const i18n = await initI18n();
  
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
      renderFeeds(watchedState.feeds, i18n);
    }

    if (path.startsWith('posts') || path.startsWith('ui.viewedPosts')) {
      renderPosts(watchedState.posts, watchedState, i18n);
    }

    if (path === 'ui.modalPostId') {
      renderModal(watchedState, i18n);
    }

    if (path.startsWith('form')) {
      renderForm(watchedState.form, i18n);
    }
  });

  const form = document.querySelector('form');
  const postsContainer = document.querySelector('.posts');
  
  // Начальный рендер
  renderForm(watchedState.form, i18n);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
 console.log('📝 Form submitted')

    const formData = new FormData(form);
    const url = String(formData.get('url') ?? '').trim();
      console.log('🔗 URL:', url);



    if (url === '') {
         console.log('⚠️ Empty URL');
      watchedState.form = {
        status: 'error',
        error: 'empty',
      };
      return;
    }

  try {
    new URL(url);
    console.log('✅ URL is valid');
  } catch {
    console.log('❌ Invalid URL');
    watchedState.form = {
      status: 'error',
      error: 'invalidUrl',
    };
    return;
  }
  

  if (watchedState.feeds.some((feed) => feed.url === url)) {
    console.log('⚠️ Duplicate URL');
    watchedState.form = {
      status: 'error',
      error: 'exists',
    };
    return;
  }
  
  console.log('🚀 Sending request...');
  watchedState.form = {
    status: 'sending',
    error: null,
  };
  
  fetchRSS(url)
    .then(parseRSS)
    .then(({ feed, posts }) => {
      console.log('✅ RSS loaded:', { feed, postsCount: posts.length });
      // ... остальной код
      watchedState.form = {
        status: 'success',
        error: null,
      };
      form.reset();
    })
    .catch((error) => {
      console.error('❌ Error loading RSS:', error.message);
      let errorType = 'unknown';
      if (error.message === 'Network Error') {
        errorType = 'network';
      } else if (error.message === 'noRss') {
        errorType = 'noRss';
      }
      watchedState.form = {
        status: 'error',
        error: errorType,
      };
    });
});
}