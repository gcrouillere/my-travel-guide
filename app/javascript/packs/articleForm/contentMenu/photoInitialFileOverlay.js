import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import $ from 'jquery'
import { CLOUDINARYKEYS } from './../../../config/config'

class PhotoInitialFileOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0
    }
  }

  abandonPhotoCreation = () => {
    document.querySelector(".photoInitialFileOverlay").classList.remove("active")
  }

  onPhotoSelected = (event) => {
    let file = event.target.files[0]
    var formData = new FormData();
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARYKEYS.uploadPreset)
    formData.append('tags', `mytravelguide,${file.name}`)
    formData.append('context', `photo=${file.name}`)

    var self = this

    $.ajax({
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
      contentType: false
    }).done((data) => {
      document.querySelector(".photoInitialFileOverlay").classList.remove("active")
      this.setState({progress: 0})
      this.props.addNewPhotoBloc(data)
    }).fail((data) => { console.log(data) })
  }

  render() {
    return (
      <div className="photoInitialFileOverlay">
        <button onClick={this.abandonPhotoCreation} className="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <p className="mapOverlayTitle">Select a photo on your disk</p>
        <div className="input-group mb-3">
          <div className="custom-file">
            <input type="file" className="custom-file-input" id="fileupload" aria-describedby="inputGroupFileAddon01"
             accept="image/*" multiple={false} onChange={this.onPhotoSelected}/>
            <label className="custom-file-label" htmlFor="fileupload">Click here to browse your files</label>
          </div>
        </div>
        {this.state.progress > 0 &&
          <div className="progress">
            <div className="progress-bar progress-bar-striped progress-bar-animated bg-dark" role="progressbar" aria-valuenow={this.state.progress} aria-valuemin="0" aria-valuemax="100" style={{width: this.state.progress + '%'}}></div>
          </div>
        }
      </div>
    )
  }
}

export default PhotoInitialFileOverlay
