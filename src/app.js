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

    const formData = new FormData(form);
    const url = String(formData.get('url') ?? '').trim();

    // Валидация на пустоту
    if (url === '') {
      watchedState.form = {
        status: 'error',
        error: 'empty',
      };
      return;
    }

    // Валидация URL
    try {
      new URL(url);
    } catch {
      watchedState.form = {
        status: 'error',
        error: 'invalidUrl',
      };
      return;
    }

    // Проверка на дубликат
    if (watchedState.feeds.some((feed) => feed.url === url)) {
      watchedState.form = {
        status: 'error',
        error: 'exists',
      };
      return;
    }

    // Отправка запроса
    watchedState.form = {
      status: 'sending',
      error: null,
    };

    fetchRSS(url)
      .then(parseRSS)
      .then(({ feed, posts }) => {
        const feedId = generateId();

        watchedState.feeds.push({
          id: feedId,
          url,
          title: feed.title,
          description: feed.description || '',
        });

        const normalizedPosts = posts.map((post) => ({
          id: generateId(),
          feedId,
          title: post.title,
          description: post.description || '',
          link: post.link,
        }));

        watchedState.posts.unshift(...normalizedPosts);
        
        watchedState.form = {
          status: 'success',
          error: null,
        };
        
        form.reset();
        
        // Возвращаем фокус на поле ввода
        const input = form.querySelector('input[name="url"]');
        input.focus();
      })
      .catch((error) => {
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

  // Обработка модального окна через делегирование
  postsContainer.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-id]');
    if (!button) return;
    
    const { id } = button.dataset;
    watchedState.ui.viewedPosts.add(id);
    watchedState.ui.modalPostId = id;
  });
};