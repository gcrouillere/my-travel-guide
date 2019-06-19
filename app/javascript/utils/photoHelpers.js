import $ from 'jquery'
import { CLOUDINARYKEYS } from './../config/config'

export default {

  async photoUpload(event, formData, context) {
    var self = context
    let returnData = null

    await $.ajax({
    xhr: function() {
        var xhr = new window.XMLHttpRequest()
        //Upload progress
        xhr.upload.addEventListener("progress", function(evt){
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total * 100;
            self.setState({progress: percentComplete})
          }
        }, false)
        return xhr;
      },
      method: 'POST',
      url: `https://api.cloudinary.com/v1_1/${CLOUDINARYKEYS.cloudName}/upload`,
      data: formData,
      processData: false,
      contentType: false,
      success: function(data) { returnData = data },
      error: function(error) { console.log(error) }
    })

    return returnData
  },

  retrievePhotoSRC(photo) {
    return photo.cropped_url ?
      (photo.cropped_url == "false" ? photo.url : photo.cropped_url) :
      photo.url
  }

}
