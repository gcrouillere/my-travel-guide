import $ from 'jquery'

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
  }

}
