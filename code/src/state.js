const state = {
  feeds: [],
  posts: [],
  ui: {
    viewedPosts: new Set(),
    modalPostId: null,
  },
  form: {
    status: 'idle',
    error: null,
  },
  
};