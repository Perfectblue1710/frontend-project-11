import onChange from 'on-change';
import i18next from 'i18next';

export const renderPosts = (posts, state) => {
  const container = document.querySelector('.posts');
  container.innerHTML = '';

  posts.forEach((post) => {
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
}; export const renderModal = (state) => {
  const post = state.posts.find(
    (p) => p.id === state.ui.modalPostId
  );

  if (!post) return;

  document.querySelector('.modal-title').textContent = post.title;
  document.querySelector('.modal-body').textContent = post.description;
  document.querySelector('.full-article').href = post.link;
};
