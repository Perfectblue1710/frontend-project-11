import axios from 'axios'

const proxy = 'https://allorigins.hexlet.app/get'

export async function fetchRSS(url) {
  const fullUrl = new URL(proxy)
  fullUrl.searchParams.set('disableCache', 'true')
  fullUrl.searchParams.set('url', url)
  try {
    const response = await axios.get(fullUrl.toString())
    return response.data.contents
  } catch {
    throw new Error('Network Error')
  }
}

export function parseRSS(data) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(data, 'application/xml')
  const parseError = doc.querySelector('parsererror')
  if (parseError) throw new Error('noRss')

  const title = doc.querySelector('channel > title')?.textContent
  const description = doc.querySelector('channel > description')?.textContent
  if (!title) throw new Error('noRss')

  const items = doc.querySelectorAll('item')
  const parsedPosts = Array.from(items).map((item, idx) => ({
    id: `${Date.now()}-${idx}`,
    title: item.querySelector('title')?.textContent || '',
    description: item.querySelector('description')?.textContent || '',
    link: item.querySelector('link')?.textContent || '',
  }))

  return {
    feed: { title, description: description || '' },
    posts: parsedPosts,
  }
}