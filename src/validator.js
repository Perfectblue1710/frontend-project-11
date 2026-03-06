import * as yup from 'yup';

export default (existingUrls) =>
  yup
    .string()
    .required()
    .url()
    .notOneOf(existingUrls);
