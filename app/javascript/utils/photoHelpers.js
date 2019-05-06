import $ from 'jquery'
import { CLOUDINARYKEYS } from './../config/config'

export default {

  photoUpload(event, formData, context) {
    var self = context
    const data = $.ajax({
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
      succes: function(data) { return data },
      error: function(xhr, error) { console.log(error) }
    })
    return data
  }

}
