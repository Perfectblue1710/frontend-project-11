let feeds = []
let posts = []
let viewedPosts = new Set()

export const getFeeds = () => feeds
export const getPosts = () => posts
export const getViewedPosts = () => viewedPosts

export const addFeed = (feed) => {
  feeds = [feed, ...feeds]
}

export const addPosts = (newPosts) => {
  posts = [...newPosts, ...posts]
}

export const markPostAsViewed = (postId) => {
  viewedPosts.add(postId)
}

export const isPostViewed = postId => viewedPosts.has(postId)

export const resetFormState = () => {

}

