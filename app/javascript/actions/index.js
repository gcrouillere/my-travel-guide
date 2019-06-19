export const FETCH_USER = 'FETCH_USER';
export const FETCH_ARTICLE = 'FETCH_ARTICLE';

export function fetchUser() {
  const user = JSON.parse(document.getElementById("root").getAttribute("data-user"))
  return {
    type: 'FETCH_USER',
    payload: user
  };
}

export function fetchArticle(articleID, article) {
  let promise
  if (!article) {
    promise = fetch(`/articles/${articleID}`, { headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }}).then(response => response.json())
  } else {
    promise = article
  }

  return {
    type: 'FETCH_ARTICLE',
    payload: promise
  };
}
