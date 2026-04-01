const state = {
  feeds: [],
  posts: [],
  form: {
    status: null,
    error: null,
  },
  ui: {
    viewedPosts: new Set(),
    modalPostId: null,
  }
};

export default state;