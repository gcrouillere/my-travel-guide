import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import $ from 'jquery'
import { CLOUDINARYKEYS } from './../../../config/config'

class PhotoCustomization extends Component {

  constructor(props) {
    super(props)
    this.state = {
      title: this.props.photo.original_filename,
      displayTitle: this.props.photo.display_title
    }
  }

  handleTitle = (event) => {this.setState({title: event.target.value})}

  saveTitle = () => { this.props.updatePhoto({original_filename: this.state.title}) }

  changeTitleDisplay = (event) => {
    this.setState({displayTitle: event.target.value == "true"})
    this.props.updatePhoto({display_title: event.target.value == "true"})
  }

  manageCrop = () => {
    if (!this.props.cropped) {
      let photo = this.props.getPhotoNode()

      let horizontalRatio = this.getRatio(photo.clientWidth, "original_width")
      let newXRefs = this.getRefAndLengthOnAxis("horizontal", horizontalRatio)

      let verticalRatio = this.getRatio(photo.clientHeight, "original_height")
      let newYRefs = this.getRefAndLengthOnAxis("vertical", verticalRatio)

      let cropRefs = `c_crop,h_${newYRefs.newHeight},w_${newXRefs.newWidth},x_${newXRefs.newX},y_${newYRefs.newY}`
      let newUrl = `http://res.cloudinary.com/${CLOUDINARYKEYS.cloudName}/image/upload/${cropRefs}/${this.props.photo.public_id}`

      this.props.updatePhoto({ height: newYRefs.newHeight, width: newXRefs.newWidth, cropped_url: newUrl })
    } else {
      this.props.updatePhoto({ height: 0, width: 0, cropped_url: false })
    }
  }

  getRefAndLengthOnAxis(axis, ratio) {
    if (axis == "horizontal") {
      return { newX: Math.round(this.props.crop.x / ratio), newWidth: Math.round(this.props.crop.width / ratio)}
    }
    if (axis == "vertical") {
      return { newY: Math.round(this.props.crop.y / ratio), newHeight: Math.round(this.props.crop.height / ratio)}
    }
  }

  getRatio(clientLength, originalLength) {
    return clientLength / this.props.photo[originalLength] > 1 ?
      1 / (clientLength / this.props.photo[originalLength]) :
      clientLength / this.props.photo[originalLength]
  }

  onDragStart = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  abandonCustomization = () => { this.props.abandonCustomization() }

  render() {

    let disableCrop = this.props.crop.height <= 0 || this.props.crop.width <= 0

    return (
      <div id={`photoCustomization-${this.props.photo.id}`}
      className={`photoCustomization ${this.props.customizationActive ? "active" : ""}`}
      draggable onDragStart={this.onDragStart}>
        <div className="overflowContainer">
          <button onClick={this.abandonCustomization} className="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h3>Photo Customization:</h3>
          <button className={`btn btn-dark photoCustomizationBlock ${this.props.cropped ?
            "cancelCrop" :
             (disableCrop ? "disableCrop" : "crop")}`
          }
          onClick={this.manageCrop} disabled={!this.props.cropped && disableCrop}>
            {this.props.cropped ? "Cancel Crop" : "Crop"}
          </button>
          <div className="photoCustomizationBlock">
            <input type="text" className="titleInput" value={this.state.title} onChange={this.handleTitle}/>
            <button className="btn btn-dark" onClick={this.saveTitle}>
              Save Photo Title
            </button>
          </div>
          <div className="distanceDisplayRadios photoCustomizationBlock">
            <p>Display photo Title ?</p>
            {[true, false].map(x =>
            <div key={x} className="form-check form-check-inline">
              <input className="form-check-input markerLogoInput" type="radio" id={`radio-${x}`} name="inlineRadioOptions" value={x}
              checked={this.state.displayTitle == null ? false : this.state.displayTitle == x}
              onChange={this.changeTitleDisplay} />
              <label className="form-check-label" htmlFor={`radio-${x}`}>{x ? "Yes" : "No"}</label>
            </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default PhotoCustomization
