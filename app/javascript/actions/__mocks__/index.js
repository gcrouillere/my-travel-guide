const user = { id: 1, email: "test@emaiL.fr" }
const article = { id: 1, title: "My fake title" }

const fetchUser = jest.fn(() => {
  return {
    type: 'FETCH_USER',
    payload: user
  };
})

const fetchArticle = jest.fn((articleId, articleParam) => {
  return {
    type: 'FETCH_ARTICLE',
    payload: article
  }
})

module.exports = {
  fetchUser,
  fetchArticle
}
