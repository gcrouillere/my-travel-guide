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

  abandonPhotoCustomization = () => {
    document.getElementById(`photoCustomization-${this.props.photo.id}`).classList.remove("active")
  }

  handleTitle = (event) => {this.setState({title: event.target.value})}

  saveTitle = () => { this.props.updatePhoto({original_filename: this.state.title}) }

  changeTitleDisplay = () => {
    this.setState({displayTitle: event.target.value == "true"})
    this.props.updatePhoto({display_title: event.target.value == "true"})
  }

  manageCrop = () => {
    if (!this.props.cropped) {
      let photo = document.querySelector(`.photo-${this.props.photo.position}`)

      let cssWidth = photo.clientWidth
      let horizontalRatio = photo.clientWidth / this.props.photo.original_width > 1 ? 1 / (photo.clientWidth / this.props.photo.original_width) : photo.clientWidth / this.props.photo.original_width
      let newX = Math.round(this.props.crop.x / horizontalRatio)
      let newWidth =  Math.round(this.props.crop.width / horizontalRatio)

      let cssHeight = photo.clientHeight
      let verticalRatio = photo.clientHeight / this.props.photo.original_height > 1 ? 1 / (photo.clientHeight / this.props.photo.original_height) : photo.clientHeight / this.props.photo.original_height
      let newY = Math.round(this.props.crop.y / verticalRatio)
      let newHeight =  Math.round(this.props.crop.height / verticalRatio)

      let cropRefs = `c_crop,h_${newHeight},w_${newWidth},x_${newX},y_${newY}`
      let newUrl = `http://res.cloudinary.com/${CLOUDINARYKEYS.cloudName}/image/upload/${cropRefs}/${this.props.photo.public_id}`
      this.props.updatePhoto({ height: newHeight, width: newWidth, cropped_url: newUrl })
    } else {
      this.props.updatePhoto({ height: 0, width: 0, cropped_url: "" })
    }
  }

  onDragStart = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  render() {
    return (
      <div id={`photoCustomization-${this.props.photo.id}`} className="photoCustomization" draggable onDragStart={this.onDragStart}>
        <div className="overflowContainer">
          <button onClick={this.abandonPhotoCustomization} className="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h3>Photo Customization:</h3>
          <button className={`btn btn-dark photoCustomizationBlock ${this.props.cropped ? "cancelCrop" : ("crop")}`}
          onClick={this.manageCrop} disabled={!this.props.cropped && (this.props.crop.height < 0 || this.props.crop.width < 0)}>
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
