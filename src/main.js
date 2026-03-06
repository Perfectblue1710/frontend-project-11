import './style.css';
import i18n from './i18n.js';
import setYupLocale from './yupLocale.js';
import validator from './validator.js';
import initView from './view.js';
import state from './state.js';
import i18next from 'i18next';
setYupLocale();

const elements = {
  form: document.querySelector('form'),
  input: document.querySelector('input[name="url"]'),
  feedback: document.querySelector('.invalid-feedback'),
};

const watchedState = initView(state, elements);

elements.form.addEventListener('submit', (e) => {
  e.preventDefault();

  const url = elements.input.value.trim();
  const urls = watchedState.feeds.map((feed) => feed.url);

  watchedState.form.error = null;
  watchedState.form.status = 'processing';

  validator(urls)
    .validate(url)
    .then(() => {
      watchedState.feeds.push({ url });
      watchedState.form.status = 'success';
    })
    .catch((err) => {
      watchedState.form.status = 'failed';
      watchedState.form.error = err.message; // ← КЛЮЧ
    });
}); 
const i18n = i18next.createInstance();

i18n.init({
  lng: 'ru',
  resources: {
    ru: {
      translation: {
        // ...
      },
    },
  },
});

export default i18n;

