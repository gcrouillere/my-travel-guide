import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import $ from 'jquery'

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

  cancelCrop = () => {
    this.props.updatePhoto({cropped_url: ""})
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
          {this.props.photo.cropped == null &&
            <button className="btn btn-dark photoCustomizationBlock" onClick={this.cancelCrop}>
              Cancel Crop
            </button>
        }
        </div>
      </div>
    )
  }
}

export default PhotoCustomization
