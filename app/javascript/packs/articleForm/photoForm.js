import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import DropZone from './formElementManagement/dropZone'
import DragVisualElements from './formElementManagement/dragVisualElements'
import DeleteButton from './formElementManagement/deleteButton'
import $ from 'jquery'
import ElementResize from './formElementManagement/elementResize'

class PhotoForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      photo: this.props.photo
    }
  }

  initResize = (event) => {
    let photo = document.getElementById(`photo-${this.props.position}`)
    let maxWidth = document.getElementById(`content-${this.props.position}`).clientWidth
    let originalcursorPosition = event.screenX
    let initialPhotoWidth = this.state.photo.css_width
    let newWidth, validWidth = null
    onmousemove = (event) => {
       newWidth = initialPhotoWidth + ((event.screenX - originalcursorPosition) / maxWidth) * 100
       validWidth = newWidth > 100 ? 100 : (newWidth < 20 ? 20 : newWidth)
       photo.style.width = `${validWidth}%`
    }
    onmouseup = () => {
      onmousemove = null;
      this.updatePhoto({css_width: validWidth})
      onmouseup = null;
    }
  }

  updatePhoto(photoCharacteristics) {
    $.ajax({
      method: 'PUT',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/photos/${this.props.photo.id}`,
      dataType: "JSON",
      data: {photo: photoCharacteristics}
    }).done((data) => {
      this.setState({photo: data})
      console.log()
    }).fail((data) => {
      console.log(data)
    })
  }

  deleteElement = (event) => { this.props.deleteElement(event, this.props.id, this.props.position, "photos") }

  onDragStart = (event) => {
    document
    .querySelectorAll(".mapCustomization, .markerCustomization, .polylineCustomization")
    .forEach(x => {x.classList.remove("active")})
    this.props.onDragStart(event, this.props.id, this.props.position, this.props.photo)
  }

  onDragOver = (event) => {this.props.onDragOver(event, this.props.id, this.props.position)}

  onDragEnter = (event) => {this.props.onDragEnter(event, this.props.id, this.props.position)}

  onDragLeave = (event) => {this.props.onDragLeave(event, this.props.id, this.props.position)}

  onDrop = (event) => {this.props.onDrop(event, this.props.id, this.props.position)}

  render() {
    return (
      <div id={`content-${this.props.position}`} className="photoInput" draggable={!this.props.mapCustomizationOnGoing.status}
      onDragStart={this.onDragStart}
      onDragOver={this.onDragOver}
      onDragEnter={this.onDragEnter}
      onDragLeave={this.onDragLeave}
      onDrop={this.onDrop}>
        <DragVisualElements />
        <DeleteButton deleteElement={this.deleteElement}/>
        <DropZone area={"before"} onDrop={this.onDrop}/>
        <div className="photoContainer">
          <ElementResize initResize={this.initResize} direction="horizontal"/>
          <div className="cropTop"></div>
          <div className="cropRight"></div>
          <div className="cropBottom"></div>
          <div className="cropLeft"></div>
          <img id={`photo-${this.props.position}`} src={this.props.photo.url} alt="" style={{width: `${this.state.photo.css_width}%`}}/>
        </div>
        <DropZone area={"after"} onDrop={this.onDrop}/>
      </div>
    )
  }
}
export default PhotoForm
