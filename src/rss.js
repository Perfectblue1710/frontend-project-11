import axios from 'axios';

const proxy = 'https://allorigins.hexlet.app/get';

export const fetchRSS = (url) => {
  const fullUrl = new URL(proxy);
  fullUrl.searchParams.set('disableCache', 'true');
  fullUrl.searchParams.set('url', url);

  return axios
    .get(fullUrl.toString())
    .then((response) => response.data.contents)
    .catch(() => {
      throw new Error('Network Error');
    });
}; 
export const parseRSS = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');

  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Invalid RSS');
  }

  const title = doc.querySelector('channel > title')?.textContent;
  const description = doc.querySelector('channel > description')?.textContent;

  if (!title || !description) {
    throw new Error('Invalid RSS');
  }

  const items = doc.querySelectorAll('item');

  const posts = Array.from(items).map((item) => ({
    title: item.querySelector('title')?.textContent,
    description: item.querySelector('description')?.textContent,
    link: item.querySelector('link')?.textContent,

  }));

  return {
    feed: { title, description },
    posts,
  };
};
