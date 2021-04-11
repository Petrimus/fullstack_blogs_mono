import blogService from '../services/blogs'

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT':
    return action.data
  case 'LIKE': {
    const liked = action.data
    return state.map((b) => (b.id === liked.id ? liked : b))
  }
  case 'COMMENT': {
    const data = action.data
    // eslint-disable-next-line no-console
    console.log('data ', data)

    let blog = state.find((b) => b.id === action.id)
    blog.comments = blog.comments.concat(data)
    const newBlog = Object.assign({}, blog)
    // eslint-disable-next-line no-console
    console.log('new blog ', newBlog)

    return state.map((blog) => (blog.id === newBlog.id ? newBlog : blog))
  }
  case 'DELETE': {
    return state.filter((b) => b.id !== action.id)
  }
  case 'CREATE':
    return [...state, action.data]
  default:
    return state
  }
}

export const createBlog = (content) => {
  return async (dispatch) => {
    const data = await blogService.create(content)
    dispatch({
      type: 'CREATE',
      data,
    })
  }
}

export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch({
      type: 'DELETE',
      id,
    })
  }
}

export const initializeBlogs = () => {
  return async (dispatch) => {
    const data = await blogService.getAll()
    dispatch({
      type: 'INIT',
      data,
    })
  }
}

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const toLike = { ...blog, likes: blog.likes + 1 }
    const data = await blogService.update(toLike)
    dispatch({
      type: 'LIKE',
      data,
    })
  }
}

export const commentBlog = (id, comment) => {
  return async (dispatch) => {
    const data = await blogService.comment(id, comment)
    dispatch({
      type: 'COMMENT',
      data,
      id,
    })
  }
}

export default reducer
