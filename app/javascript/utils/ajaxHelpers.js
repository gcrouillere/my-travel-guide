import $ from 'jquery';
import { GOOGLEKEY } from '../config/config';

export default {

  async ajaxCall(method, url, data, token) {
    let returnData = null;
    let deleteArticle = method === 'DELETE' ? "delete" : ""
    await $.ajax({
      method: method,
      beforeSend: function AttachHeadeToRequest(xhr) { xhr.setRequestHeader('X-CSRF-Token', token); },
      url: url,
      dataType: 'JSON',
      data: data,
      delete: deleteArticle
    })
      .done((reponse) => { returnData = reponse; })
      .fail((reponse) => { console.log(reponse); });

    return returnData;
  },

  async geocodePlace(adress) {
    const formattedAdress = adress.replace(/,/g, '').split(' ').join('+');
    let map = null;

    await $.ajax({
      method: 'GET',
      url: `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAdress}&key=${GOOGLEKEY.googleAPIBrowserKey}`
    }).done(data => {
      map = {
        lat: data.results[0].geometry.location.lat,
        lng: data.results[0].geometry.location.lng,
        name: data.results[0].formatted_address
      };
    });

    return map;
  }
};
