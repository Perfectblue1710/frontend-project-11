import * as model from './model.js'
import * as view from './view.js'
import { fetchRSS, parseRSS } from './rssApi.js'

export function initFormHandler() {
  const { form, input } = view.elements

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const url = input.value.trim()

    // Валидация
    if (!url) {
      view.showMessage('Не должно быть пустым', true)
      return
    }
    try {
      new URL(url)
    } catch {
      view.showMessage('Ссылка должна быть валидным URL', true)
      return
    }

    if (model.getFeeds().some(feed => feed.url === url)) {
      view.showMessage('RSS уже существует', true)
      return
    }

    const submitBtn = form.querySelector('button[type="submit"]')
    submitBtn.disabled = true
    input.readOnly = true
    view.showMessage('')

    try {
      const data = await fetchRSS(url)
      const { feed, posts: newPosts } = parseRSS(data)

      const newFeed = {
        id: Date.now().toString(),
        url,
        title: feed.title,
        description: feed.description,
      }

      model.addFeed(newFeed)
      model.addPosts(newPosts)

      view.renderFull(model.getFeeds(), model.getPosts(), model.getViewedPosts())
      view.showMessage('RSS успешно загружен', false)
      form.reset()
    } catch (err) {
      if (err.message === 'noRss') {
        view.showMessage('Ресурс не содержит валидный RSS', true)
      } else if (err.message === 'Network Error') {
        view.showMessage('Ошибка сети', true)
      } else {
        view.showMessage('Ошибка', true)
      }
    } finally {
      submitBtn.disabled = false
      input.readOnly = false
      input.focus()
    }
  })
}

export function initPostsHandler() {
  const { postsContainer } = view.elements

  postsContainer.addEventListener('click', (e) => {
    const button = e.target.closest('.btn-outline-primary')
    if (!button) return
    const postId = button.dataset.id
    const post = model.getPosts().find(p => p.id === postId)
    if (!post) return

    if (!model.isPostViewed(post.id)) {
      model.markPostAsViewed(post.id)
      view.renderPosts(model.getPosts(), model.getViewedPosts())
    }

    view.showModal(post)
  })
}

export function init() {
  initFormHandler()
  initPostsHandler()
  view.renderFull(model.getFeeds(), model.getPosts(), model.getViewedPosts())
}