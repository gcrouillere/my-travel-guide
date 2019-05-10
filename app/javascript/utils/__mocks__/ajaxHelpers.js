import update from 'immutability-helper'
import article from './../../../../test/javascript/__mocks__/fakeArticle.json'
import audienceSelection from './../../../../test/javascript/__mocks__/audienceSelection.json'
import updatedArticle from './../../../../test/javascript/__mocks__/fakeArticleFedWithText.json'

const getDataFromURL = jest.fn((url) => {

  if ( /^\/articles\/[0-9]+/.test(url) ) {
    return Promise.resolve(article)
  } else if (/^\/audience_selections/.test(url) ) {
    return Promise.resolve(audienceSelection)
  }

});

const map = article.maps[0]

const updateDataInURL = jest.fn((url, data, token) => {
  if ( /^\/articles\/[0-9]+/.test(url) ) {
    if (data.article.audience_selection_ids && data.article.audience_selection_ids.length ==  2) {
      return Promise.resolve(updatedArticle)
    } else {
      return Promise.resolve(article)
    }
  } else if ( /^\/maps/.test(url) ) {
    if (data.map.zoom) {
      let newMap = update(map, {zoom: {$set: 2}})
      return Promise.resolve(newMap)
    } else if (data.map.height) {
      let newMap = update(map, {height: {$set: 339}})
      return Promise.resolve(newMap)
    } else if (data.map.name) {
      let newMap = update(map, {name: {$set: data.map.name}})
      return Promise.resolve(newMap)
    } else if (data.map.lat) {
      let newMap = update(map, {lat: {$set: 1}, lng: {$set: 1}})
      return Promise.resolve(newMap)
    }
  }
});

const geocodePlace = jest.fn((adress) => { return Promise.resolve({name: adress}) })

module.exports = {
  getDataFromURL,
  updateDataInURL,
  geocodePlace
}
