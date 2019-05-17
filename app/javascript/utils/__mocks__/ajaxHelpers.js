import update from 'immutability-helper'
import article from './../../../../test/javascript/__mocks__/fakeArticle.json'
import audienceSelection from './../../../../test/javascript/__mocks__/audienceSelection.json'
import updatedArticle from './../../../../test/javascript/__mocks__/fakeArticleFedWithText.json'

const map = article.maps[0]

const marker = map.markers[0]

const polyline = map.polylines[0]

const photo = article.photos[0]

const text_content = article.text_contents[0]

const instances = {
  map: article.maps[0],
  marker: article.maps[0].markers[0],
  polyline: article.maps[0].polylines[0],
  photo: article.photos[0],
  text_content: article.text_contents[0],
  article: article,
  audience_selection: audienceSelection
}

const ajaxCall = jest.fn((method, url, data, token) => {

  let pluralmodel = url.split("/")[1]
  let model = pluralmodel.substr(0, pluralmodel.length - 1)
  let newInstance = instances[model]

  if (/\/articles\/element_position_update\//.test(url)) {
    let newTextContent = update(instances.text_content, {
      id: {$set: 1},
      text: {$set: "caca"},
      position: {$set: data.positions.target.position}
    })
    newInstance = update(newInstance, { text_contents: {$push: [newTextContent] }})
    return Promise.resolve(newInstance)
  }

  if (method == 'PUT' || method == 'POST') {
    Object.keys(data).map(modelKey => {
      Object.keys(data[modelKey]).map(characteristic => {
        newInstance = update(newInstance, { [characteristic]: {$set: data[modelKey][characteristic]}})
      })
    })

    if (newInstance.audience_selection_ids) {
      return newInstance.audience_selection_ids.length > 1 ? Promise.resolve(updatedArticle) : Promise.resolve(article)
    }
  }

  if (method = 'GET' || method == 'POST') {
    newInstance = update(newInstance, {id: {$set: 1}})
    return Promise.resolve(newInstance)
  }

  if (method == 'DELETE') {
    return Promise.resolve(instances[model])
  }

  return Promise.resolve(newInstance)
})

const geocodePlace = jest.fn((adress) => { return Promise.resolve({name: adress}) })

module.exports = {
  ajaxCall,
  geocodePlace
}
