import i18next from 'i18next';

export default i18next.createInstance().init({
  lng: 'ru',
  debug: false,
  resources: {
    ru: {
      translation: {
        form: {
          submit: 'Добавить',
          placeholder: 'Ссылка на RSS',
        },
        errors: {
          required: 'Не должно быть пустым',
          invalidUrl: 'Ссылка должна быть валидным URL',
          duplicate: 'RSS уже существует',
        },
      },
    },
  },
});
