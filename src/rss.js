import axios from 'axios';
import Parser from 'rss-parser';

const proxy = 'https://allorigins.hexlet.app/get';
const parser = new Parser();

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

export const parseRSS = async (data) => {
  try {
    const feed = await parser.parseString(data);
    
    if (!feed.title || !feed.items) {
      throw new Error('Invalid RSS');
    }
    
    const posts = feed.items.map((item) => ({
      title: item.title || '',
      description: item.contentSnippet || item.description || '',
      link: item.link || '',
    }));
    
    return {
      feed: {
        title: feed.title,
        description: feed.description || '',
      },
      posts,
    };
  } catch (error) {
    throw new Error('Invalid RSS');
  }
};