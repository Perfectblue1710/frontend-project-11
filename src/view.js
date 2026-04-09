export const renderFeeds = (feeds) => {
  const container = document.querySelector('.feeds');
  container.innerHTML = '';

  feeds.forEach((feed) => {
    const item = document.createElement('div');
    item.classList.add('card', 'mb-3');

    const body = document.createElement('div');
    body.classList.add('card-body');

    const title = document.createElement('h3');
    title.classList.add('card-title', 'h6');
    title.textContent = feed.title;

    const desc = document.createElement('p');
    desc.classList.add('card-text', 'small', 'text-muted');
    desc.textContent = feed.description;

    body.append(title, desc);
    item.append(body);
    container.append(item);
  });
};

export const renderPosts = (posts, state) => {
  const container = document.querySelector('.posts');
  container.innerHTML = '';

  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start'
    );

    const link = document.createElement('a');
    link.href = post.link;
    link.textContent = post.title;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    if (state.ui.viewedPosts.has(post.id)) {
      link.classList.add('fw-normal');
    } else {
      link.classList.add('fw-bold');
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Просмотр';
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.dataset.id = post.id;

    li.append(link, button);
    container.append(li);
  });
};

export const renderModal = (state) => {
  const post = state.posts.find((p) => p.id === state.ui.modalPostId);
  if (!post) return;

  document.querySelector('.modal-title').textContent = post.title;
  document.querySelector('.modal-body').textContent = post.description;
  document.querySelector('.full-article').href = post.link;
};

export const renderForm = (form) => {
  const feedback = document.querySelector('.feedback');

  const messages = {
    success: 'RSS успешно загружен',
    exists: 'RSS уже существует',
    invalidUrl: 'Ссылка должна быть валидным URL',
    noRss: 'Ресурс не содержит валидный RSS',
    network: 'Ошибка сети',
    unknown: 'Ошибка',
  };

  feedback.classList.remove('text-success', 'text-danger');

  if (form.status === 'success') {
    feedback.textContent = messages.success;
    feedback.classList.add('text-success');
    return;
  }

  if (form.status === 'error') {
    feedback.textContent = messages[form.error] ?? messages.unknown;
    feedback.classList.add('text-danger');
    return;
  }

  feedback.textContent = '';
};