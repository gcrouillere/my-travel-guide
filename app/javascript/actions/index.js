export const FETCH_USER = 'FETCH_USER';
export const FETCH_ARTICLE = 'FETCH_ARTICLE';
export const UPDATE_AUDIENCE_SELECTION = 'UPDATE_AUDIENCE_SELECTION';
export const FETCH_ARTICLES = 'FETCH_ARTICLES';
export const FETCH_MARKERS = 'FETCH_MARKERS';

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

export function updateAudienceSelection(newSelection) {

  return {
    type:  'UPDATE_AUDIENCE_SELECTION',
    payload: newSelection
  }
}

export function fetchArticles(requestObject) {
  let url = new URL(`${window.origin}/articles/`)

  if (requestObject) {
    const params = filterRequestObject(requestObject)
    url.search = new URLSearchParams(params)
  }
  let promise = fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(response => response.json())

  return {
    type:  'FETCH_ARTICLES',
    payload: promise
  }
}

export function mapArticlesToMarkers(articles) {
  const markers = articles.map(x => { return x.maps[0] ? {
    id: x.id,
    description: x.title,
    lat: x.maps[0].lat,
    lng: x.maps[0].lng ,
    logo: "markerLogo"
  } : {} })

  return {
    type: 'FETCH_MARKERS',
    payload: markers
  }
}

function filterRequestObject(object) {
  let filteredObject = {}
  Object.keys(object).forEach(key => {
    if(object[key]) filteredObject[key] = object[key]
  })

  return filteredObject
}
