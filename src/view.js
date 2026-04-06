export const renderFeeds = (state) => {
  const container = document.querySelector('.feeds');
  container.innerHTML = '';

  state.feeds.forEach((feed) => {
    const div = document.createElement('div');

    const title = document.createElement('h3');
    title.textContent = feed.title;

    const desc = document.createElement('p');
    desc.textContent = feed.description;

    div.append(title);
    div.append(desc);
    container.append(div);
  });
};

export const renderPosts = (state) => {
  const container = document.querySelector('.posts');
  container.innerHTML = '';

  state.posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('d-flex', 'justify-content-between');

    const link = document.createElement('a');
    link.href = post.link;
    link.textContent = post.title;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.dataset.id = post.id;

    if (state.ui.viewedPosts.has(post.id)) {
      link.classList.add('fw-normal');
    } else {
      link.classList.add('fw-bold');
    }

    const button = document.createElement('button');
    button.textContent = 'Просмотр';
    button.classList.add('btn', 'btn-sm', 'btn-outline-primary');
    button.dataset.id = post.id;

    li.append(link);
    li.append(button);
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

  if (form.status === 'success') {
    feedback.textContent = 'RSS успешно загружен';
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
  }

  if (form.status === 'error') {
    const messages = {
      network: 'Ошибка сети',
      noRss: 'Ресурс не содержит валидный RSS',
      exists: 'RSS уже существует',
      unknown: 'Ошибка',
    };

    feedback.textContent = messages[form.error] || 'Ошибка';
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
  }
};