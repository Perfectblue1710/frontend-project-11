import * as yup from 'yup';

export default () => {
  yup.setLocale({
    string: {
      url: 'errors.invalidUrl',
    },
    mixed: {
      required: 'errors.required',
      notOneOf: 'errors.duplicate',
    },
  });
};
