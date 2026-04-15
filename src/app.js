import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as bootstrap from 'bootstrap';
import axios from 'axios';

const proxy = 'https://allorigins.hexlet.app/get';


let feeds = [];
let posts = [];
let viewedPosts = new Set();


const form = document.querySelector('form');
const feedback = document.querySelector('.feedback');
const input = document.querySelector('input[name="url"]');
const feedsContainer = document.querySelector('.feeds');
const postsContainer = document.querySelector('.posts');


function showMessage(text, isError = false) {
  feedback.textContent = text;
  feedback.classList.remove('text-success', 'text-danger');
  feedback.classList.add(isError ? 'text-danger' : 'text-success');
}


function renderFeeds() {
  feedsContainer.innerHTML = '';
  if (feeds.length === 0) return;

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const title = document.createElement('h2');
  title.classList.add('card-title', 'h4');
  title.textContent = 'Фиды';
  cardBody.appendChild(title);
  card.appendChild(cardBody);

  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  feeds.forEach(feed => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'p-0', 'mb-3');
    const feedTitle = document.createElement('h3');
    feedTitle.classList.add('h6', 'm-0');
    feedTitle.textContent = feed.title;
    const feedDesc = document.createElement('p');
    feedDesc.classList.add('m-0', 'small', 'text-black-50');
    feedDesc.textContent = feed.description;
    li.appendChild(feedTitle);
    li.appendChild(feedDesc);
    list.appendChild(li);
  });
  card.appendChild(list);
  feedsContainer.appendChild(card);
}



function renderPosts() {
  postsContainer.innerHTML = '';
  if (posts.length === 0) return;

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const title = document.createElement('h2');
  title.classList.add('card-title', 'h4');
  title.textContent = 'Посты';
  cardBody.appendChild(title);
  card.appendChild(cardBody);

  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  posts.forEach(post => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'p-0', 'mb-3');
    const link = document.createElement('a');
    link.href = post.link;
    link.textContent = post.title;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    if (viewedPosts.has(post.id)) {
   link.classList.add('fw-normal', 'link-secondary')
    } else {
      link.classList.add('fw-bold');
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Просмотр';
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.dataset.id = post.id;
    li.appendChild(link);
    li.appendChild(button);
    list.appendChild(li);
  });
  card.appendChild(list);
  postsContainer.appendChild(card);
}


function render() {
  renderFeeds();
  renderPosts();
}


function parseRSS(data) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const parseError = doc.querySelector('parsererror');
  if (parseError) throw new Error('noRss');

  const title = doc.querySelector('channel > title')?.textContent;
  const description = doc.querySelector('channel > description')?.textContent;
  if (!title) throw new Error('noRss');

  const items = doc.querySelectorAll('item');
  const parsedPosts = Array.from(items).map((item, idx) => ({
    id: `${Date.now()}-${idx}`,
    title: item.querySelector('title')?.textContent || '',
    description: item.querySelector('description')?.textContent || '',
    link: item.querySelector('link')?.textContent || '',
  }));

  return {
    feed: { title, description: description || '' },
    posts: parsedPosts,
  };
}


async function fetchRSS(url) {
  const fullUrl = new URL(proxy);
  fullUrl.searchParams.set('disableCache', 'true');
  fullUrl.searchParams.set('url', url);
  try {
    const response = await axios.get(fullUrl.toString());
    return response.data.contents;
  } catch {
    throw new Error('Network Error');
  }
}


form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = input.value.trim();


  if (!url) {
    showMessage('Не должно быть пустым', true);
    return;
  }


  try {
    new URL(url);
  } catch {
    showMessage('Ссылка должна быть валидным URL', true);
    return;
  }



  if (feeds.some(feed => feed.url === url)) {
    showMessage('RSS уже существует', true);
    return;
  }


  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  input.readOnly = true;
  showMessage(''); 

  try {
    const data = await fetchRSS(url);
    const { feed, posts: newPosts } = parseRSS(data);

    const newFeed = {
      id: Date.now().toString(),
      url,
      title: feed.title,
      description: feed.description,
    };

    feeds = [newFeed, ...feeds];
    posts = [...newPosts, ...posts];

    render();
    showMessage('RSS успешно загружен', false);
    form.reset();
  } catch (err) {
    if (err.message === 'noRss') {
      showMessage('Ресурс не содержит валидный RSS', true);
    } else if (err.message === 'Network Error') {
      showMessage('Ошибка сети', true);
    } else {
      showMessage('Ошибка', true);
    }
  } finally {
    submitBtn.disabled = false;
    input.readOnly = false;
    input.focus();
  }
});


postsContainer.addEventListener('click', (e) => {
  const button = e.target.closest('.btn-outline-primary');
  if (!button) return;
  const postId = button.dataset.id;
  const post = posts.find(p => p.id === postId);
  if (!post) return;


  if (!viewedPosts.has(post.id)) {
    viewedPosts.add(post.id);
    renderPosts(); 
  }


  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const fullArticle = document.querySelector('.full-article');
  if (modalTitle && modalBody && fullArticle) {
    modalTitle.textContent = post.title;
    modalBody.textContent = post.description;
    fullArticle.href = post.link;
    // Показываем модальное окно
    const modalElement = document.getElementById('modal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
});


render();