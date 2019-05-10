import $ from 'jquery'
import { GOOGLEKEY } from './../config/config'

export default {


  async getDataFromURL(url) {
    let returnData = null

    await $.ajax({
      method: 'GET',
      url: url,
      dataType: "JSON"
    })
    .done(data => { returnData = data })
    .fail(data => console.log(data))

    return returnData
  },

  async updateDataInURL(url, data, token) {
    let returnData = null

     await $.ajax({
      method: "PUT",
      beforeSend: function(xhr) { xhr.setRequestHeader('X-CSRF-Token', token) },
      url: url,
      data: data
    })
    .done(data => { returnData = data })
    .fail(data => console.log(data))

    return returnData
  },

  async geocodePlace(adress) {
    const formattedAdress = adress.replace(/,/g, '').split(' ').join('+')
    let map = null

    await $.ajax({
      method: "GET",
      url: `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAdress}&key=${GOOGLEKEY.googleAPIBrowserKey}`
    }).done(data => {
      map = {
        lat: data.results[0].geometry.location.lat,
        lng: data.results[0].geometry.location.lng,
        name: data.results[0].formatted_address
    }})

    return map
  }

}
