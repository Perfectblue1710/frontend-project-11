import i18next from 'i18next';
import ru from './locales/ru.js';

await i18next.init({
  lng: 'ru',
  debug: false,
  resources: {
    ru,
  },
});
 export default i18next;