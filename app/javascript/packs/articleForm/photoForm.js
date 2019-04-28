import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import DropZone from './formElementManagement/dropZone'
import DragVisualElements from './formElementManagement/dragVisualElements'
import DeleteButton from './formElementManagement/deleteButton'
import $ from 'jquery'
import ElementResize from './formElementManagement/elementResize'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/lib/ReactCrop.scss'
import PhotoCustomization from './photoForm/photoCustomization'

class PhotoForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      photo: this.props.photo,
      src: this.props.photo.cropped_url ? this.props.photo.cropped_url : this.props.photo.url,
      cropped: this.props.photo.cropped_url ? (this.props.photo.cropped_url.length > 0 ? true : false) : false ,
      crop: {
        x: 0,
        y: 0
      }
    }
  }

  initResize = (event) => {
    let photo = document.querySelector(`.photo-${this.props.position}`)
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

  updatePhoto = (photoCharacteristics) => {
    $.ajax({
      method: 'PUT',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/photos/${this.state.photo.id}`,
      dataType: "JSON",
      data: {photo: photoCharacteristics}
    }).done((data) => {
      this.setState({photo: data, cropped: data.cropped_url ? (this.props.photo.cropped_url.length > 0 ? true : false) : false,
       src: data.cropped_url ? (data.cropped_url.length > 0 ? data.cropped_url : data.url) : data.url})
       document.getElementById(`photoCustomization-${this.props.photo.id}`).classList.remove("active")
    }).fail((data) => {
      console.log(data)
    })
  }

  deleteElement = (event) => { this.props.deleteElement(event, this.props.id, this.props.position, "photos") }

  onCropChange = crop => {
    this.setState({ crop })
    document.getElementById(`photoCustomization-${this.props.photo.id}`).classList.add("active")
  }

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
        <DragVisualElements photo={this.state.photo}/>
        <DeleteButton deleteElement={this.deleteElement}/>
        <DropZone area={"before"} onDrop={this.onDrop}/>
        <div className="photoContainer">
          <PhotoCustomization photo={this.state.photo} cropped={this.state.cropped}
          crop={this.state.crop} updatePhoto={this.updatePhoto}/>
          <ElementResize initResize={this.initResize} direction="horizontal"/>
          <ReactCrop
          className={`photo-${this.props.position} ${this.state.cropped ? "cropped" : "original"}`} src={this.state.src} alt="" style={{width: `${this.state.photo.css_width}%`}}
          crop={this.state.crop} onComplete={this.onCropComplete} onChange={this.onCropChange}/>
        </div>
        <DropZone area={"after"} onDrop={this.onDrop}/>
      </div>
    )
  }
}
export default PhotoForm
