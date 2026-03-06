import axios from 'axios';

export const fetchRSS = (url) => {
  const proxy = 'https://allorigins.hexlet.app/get';
  const fullUrl = `${proxy}?disableCache=true&url=${encodeURIComponent(url)}`;

  return axios.get(fullUrl)
    .then((response) => response.data.contents);
};
export const parseRSS = (xmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');

  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('invalidRSS');
  }

  const channel = doc.querySelector('channel');

  const feed = {
    title: channel.querySelector('title').textContent,
    description: channel.querySelector('description').textContent,
  };

const posts = Array.from(doc.querySelectorAll('item')).map((item) => ({
  title: item.querySelector('title').textContent,
  link: item.querySelector('link').textContent,
  description: item.querySelector('description')?.textContent ?? '',
}));
};
