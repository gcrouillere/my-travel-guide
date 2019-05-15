import update from 'immutability-helper'
import article from './../../../../test/javascript/__mocks__/fakeArticle.json'
import audienceSelection from './../../../../test/javascript/__mocks__/audienceSelection.json'
import updatedArticle from './../../../../test/javascript/__mocks__/fakeArticleFedWithText.json'

const map = article.maps[0]

const marker = map.markers[0]

const polyline = map.polylines[0]

const photo = article.photos[0]

const ajaxCall = jest.fn((method, url, data, token) => {
  if ( /^\/articles\/[0-9]+/.test(url) ) {
    if (method == 'GET') { return Promise.resolve(article) }
    if  (method == 'PUT') {
      if (data.article.audience_selection_ids && data.article.audience_selection_ids.length ==  2) {
        return Promise.resolve(updatedArticle)
      } else {
        return Promise.resolve(article)
      }
    }
  }

  if (/^\/audience_selections/.test(url) ) {
    if (method == 'GET') { return Promise.resolve(audienceSelection) }
  }

  if ( /^\/maps/.test(url) ) {
    if  (method == 'PUT') {
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
      } else if (data.map.show_map_center_as_marker != null) {
        let newMap = update(map, { show_map_center_as_marker: { $set: data.map.show_map_center_as_marker }})
        return Promise.resolve(newMap)
      }
    }
  }

  if ( /^\/markers/.test(url) ) {
    if  (method == 'POST') {
      if (data.marker.position) {
        let newMarker = update(marker, {id: {$set: 1}, position: {$set: 3}})
        return Promise.resolve(newMarker)
      } else {
        let newMarker = update(marker, {id: {$set: 1}, lat: {$set: 6}, lng: {$set: 6}})
        return Promise.resolve(newMarker)
      }
    }
    if  (method == 'PUT') {
      if (data.marker.description) {
        let newMarker = update(marker, {description: {$set: "my description"}})
        return Promise.resolve(newMarker)
      }
      if (data.marker.logo) {
        let newMarker = update(marker, {logo: {$set: "restaurantLogo"}})
        return Promise.resolve(newMarker)
      }
      if (data.marker.lat) {
        let newMarker = update(marker, {lat: {$set: 69}, lng: {$set: 69}})
        return Promise.resolve(newMarker)
      }
    }
    if  (method == 'DELETE') { return Promise.resolve(marker) }
  }

  if ( /^\/polylines/.test(url) ) {
    if  (method == 'GET') {
      let newPolyline = update(polyline, {id: {$set: 1}})
      return Promise.resolve(newPolyline)
    }
    if  (method == 'PUT') {
      if (data.polyline.distance_displayed) {
        let newPolyline = update(polyline, {distance_displayed: {$set: data.polyline.distance_displayed}})
        return Promise.resolve(newPolyline)
      }
    }
    if  (method == 'DELETE') {
      return Promise.resolve(polyline)
    }
  }

  if(/^\/photos/.test(url)) {
    if (method == 'PUT') {
      let newPhoto = update(photo, {css_width: {$set: 30}})
      return Promise.resolve(newPhoto)
    }
  }
})

const geocodePlace = jest.fn((adress) => { return Promise.resolve({name: adress}) })

module.exports = {
  ajaxCall,
  geocodePlace
}
