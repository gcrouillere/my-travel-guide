import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import $ from 'jquery'

import photoHelpers from './../../../utils/photoHelpers'
import { CLOUDINARYKEYS } from './../../../config/config'

class PhotoInitialFileOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      photo: null,
      fileName: null
    }
  }

  abandonPhotoCreation = () => {
    this.props.abandonPhotoCreation()
  }

  buildFormData(event) {
    let file = event.target.files[0]
    this.setState({fileName: file.name})
    var formData = new FormData();
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARYKEYS.uploadPreset)
    formData.append('tags', `mytravelguide,${file.name}`)
    formData.append('context', `photo=${file.name}`)
    return formData
  }

  onPhotoSelected = async (event) => {
      let formData = this.buildFormData(event)
      let photo = await photoHelpers.photoUpload(event, formData, this)

      this.props.abandonPhotoCreation()
      this.setState({progress: 0, fileName: null})
      this.props.addNewPhotoBloc(photo)
  }

  render() {
    return (
      <div className={`photoInitialFileOverlay ${this.props.photoOverlayActive ? "active" : ""}`}>
        <button onClick={this.abandonPhotoCreation} className="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <p className="mapOverlayTitle">Select a photo on your disk</p>
        <div className="input-group mb-3">
          <div className="custom-file">
            <input type="file" className="custom-file-input" id="fileupload" aria-describedby="inputGroupFileAddon01"
             accept="image/*" multiple={false} onChange={this.onPhotoSelected} />
            <label className="custom-file-label"
            htmlFor="fileupload">{this.state.fileName ? this.state.fileName : "Click here to browse your files" }</label>
          </div>
        </div>
        {this.state.progress > 0 &&
          <div className="progress">
            <div className="progress-bar progress-bar-striped progress-bar-animated bg-dark" role="progressbar"
            aria-valuenow={this.state.progress} aria-valuemin="0" aria-valuemax="100" style={{width: this.state.progress + '%'}}></div>
          </div>
        }
      </div>
    )
  }
}

PhotoInitialFileOverlay.propTypes = {
  photoOverlayActive: PropTypes.bool.isRequired,
  addNewPhotoBloc: PropTypes.func.isRequired,
  abandonPhotoCreation: PropTypes.func.isRequired,
}

export default PhotoInitialFileOverlay
