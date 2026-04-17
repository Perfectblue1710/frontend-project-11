import * as bootstrap from 'bootstrap'

export const elements = {
  form: document.querySelector('form'),
  feedback: document.querySelector('.feedback'),
  input: document.querySelector('input[name="url"]'),
  feedsContainer: document.querySelector('.feeds'),
  postsContainer: document.querySelector('.posts'),
}

export function showMessage(text, isError = false) {
  const { feedback } = elements
  feedback.textContent = text
  feedback.classList.remove('text-success', 'text-danger')
  feedback.classList.add(isError ? 'text-danger' : 'text-success')
}

export function renderFeeds(feeds) {
  const container = elements.feedsContainer
  container.innerHTML = ''
  if (feeds.length === 0) return

  const card = document.createElement('div')
  card.classList.add('card', 'border-0')
  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')
  const title = document.createElement('h2')
  title.classList.add('card-title', 'h4')
  title.textContent = 'Фиды'
  cardBody.appendChild(title)
  card.appendChild(cardBody)

  const list = document.createElement('ul')
  list.classList.add('list-group', 'border-0', 'rounded-0')
  feeds.forEach((feed) => {
    const li = document.createElement('li')
    li.classList.add('list-group-item', 'border-0', 'p-0', 'mb-3')
    const feedTitle = document.createElement('h3')
    feedTitle.classList.add('h6', 'm-0')
    feedTitle.textContent = feed.title
    const feedDesc = document.createElement('p')
    feedDesc.classList.add('m-0', 'small', 'text-black-50')
    feedDesc.textContent = feed.description
    li.appendChild(feedTitle)
    li.appendChild(feedDesc)
    list.appendChild(li)
  })
  card.appendChild(list)
  container.appendChild(card)
}

export function renderPosts(posts, viewedPosts) {
  const container = elements.postsContainer
  container.innerHTML = ''
  if (posts.length === 0) return

  const card = document.createElement('div')
  card.classList.add('card', 'border-0')
  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')
  const title = document.createElement('h2')
  title.classList.add('card-title', 'h4')
  title.textContent = 'Посты'
  cardBody.appendChild(title)
  card.appendChild(cardBody)

  const list = document.createElement('ul')
  list.classList.add('list-group', 'border-0', 'rounded-0')
  posts.forEach((post) => {
    const li = document.createElement('li')
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'p-0', 'mb-3')
    const link = document.createElement('a')
    link.href = post.link
    link.textContent = post.title
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    if (viewedPosts.has(post.id)) {
      link.classList.add('fw-normal', 'link-secondary')
    } else {
      link.classList.add('fw-bold')
    }
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = 'Просмотр'
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
    button.dataset.id = post.id
    li.appendChild(link)
    li.appendChild(button)
    list.appendChild(li)
  })
  card.appendChild(list)
  container.appendChild(card)
}

export function renderFull(feeds, posts, viewedPosts) {
  renderFeeds(feeds)
  renderPosts(posts, viewedPosts)
}

export function showModal(post) {
  const modalTitle = document.querySelector('.modal-title')
  const modalBody = document.querySelector('.modal-body')
  const fullArticle = document.querySelector('.full-article')
  if (modalTitle && modalBody && fullArticle) {
    modalTitle.textContent = post.title
    modalBody.textContent = post.description
    fullArticle.href = post.link

    const modalElement = document.getElementById('modal')
    const modal = new bootstrap.Modal(modalElement)
    modal.show()
  }
}