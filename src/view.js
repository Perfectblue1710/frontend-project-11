export const renderFeeds = (feeds, i18n) => {
  const container = document.querySelector('.feeds');
  container.innerHTML = '';
  
  if (feeds.length === 0) return;

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  
  const title = document.createElement('h2');
  title.classList.add('card-title', 'h4');
  title.textContent = i18n.t('feeds');
  
  cardBody.appendChild(title);
  card.appendChild(cardBody);
  
  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');
  
  feeds.forEach((feed) => {
    const item = document.createElement('li');
    item.classList.add('list-group-item', 'border-0', 'p-0', 'mb-3');
    
    const feedTitle = document.createElement('h3');
    feedTitle.classList.add('h6', 'm-0');
    feedTitle.textContent = feed.title;
    
    const feedDesc = document.createElement('p');
    feedDesc.classList.add('m-0', 'small', 'text-black-50');
    feedDesc.textContent = feed.description;
    
    item.appendChild(feedTitle);
    item.appendChild(feedDesc);
    listGroup.appendChild(item);
  });
  
  card.appendChild(listGroup);
  container.appendChild(card);
};

export const renderPosts = (posts, state, i18n) => {
  const container = document.querySelector('.posts');
  container.innerHTML = '';
  
  if (posts.length === 0) return;
  
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  
  const title = document.createElement('h2');
  title.classList.add('card-title', 'h4');
  title.textContent = i18n.t('posts');
  
  cardBody.appendChild(title);
  card.appendChild(cardBody);
  
  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');
  
  posts.forEach((post) => {
    const item = document.createElement('li');
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'p-0', 'mb-3');
    
    const link = document.createElement('a');
    link.href = post.link;
    link.textContent = post.title;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    if (state.ui.viewedPosts.has(post.id)) {
      link.classList.add('fw-normal', 'text-secondary');
    } else {
      link.classList.add('fw-bold');
    }
    
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = i18n.t('rss.preview');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.dataset.id = post.id;
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    
    item.appendChild(link);
    item.appendChild(button);
    listGroup.appendChild(item);
  });
  
  card.appendChild(listGroup);
  container.appendChild(card);
};

export const renderModal = (state, i18n) => {
  const post = state.posts.find((p) => p.id === state.ui.modalPostId);
  if (!post) return;
  
  const modal = document.querySelector('#modal');
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const fullArticle = modal.querySelector('.full-article');
  
  modalTitle.textContent = post.title;
  modalBody.textContent = post.description;
  fullArticle.textContent = i18n.t('rss.fullArticle');
  fullArticle.href = post.link;
};

export const renderForm = (form, i18n) => {
   console.log('renderForm called with status:', form.status, 'error:', form.error);
  const feedback = document.querySelector('.feedback');
  const submitButton = document.querySelector('button[type="submit"]');
  const input = document.querySelector('input[name="url"]');
  
  // Блокировка/разблокировка контролов
  if (form.status === 'sending') {
    submitButton.disabled = true;
    input.readOnly = true;
  } else {
    submitButton.disabled = false;
    input.readOnly = false;
  }
  
  feedback.classList.remove('text-success', 'text-danger');
  
  if (form.status === 'success') {
    feedback.textContent = i18n.t('messages.success');
    feedback.classList.add('text-success');
    return;
  }
  
  if (form.status === 'error' && form.error) {
    const errorKey = `messages.${form.error}`;
    feedback.textContent = i18n.t(errorKey);
    feedback.classList.add('text-danger');
    return;
  }
  
  feedback.textContent = '';
};