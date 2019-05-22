import React, { Component } from 'react'
import PropTypes from 'prop-types'

import $ from 'jquery'
import update from 'immutability-helper'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/lib/ReactCrop.scss'

import DropZone from './formElementManagement/dropZone'
import DragVisualElements from './formElementManagement/dragVisualElements'
import DeleteButton from './formElementManagement/deleteButton'
import ElementResize from './formElementManagement/elementResize'
import PhotoCustomization from './photoForm/photoCustomization'
import ProcessingOverlay from './photoForm/processingOverlay'
import ajaxHelpers from './../../utils/ajaxHelpers'

class PhotoForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      photo: this.props.photo,
      src: this.retrievePhotoSRC(this.props.photo),
      cropped: /c_crop/.test(this.retrievePhotoSRC(this.props.photo)),
      processing: false,
      customizationActive: false,
      resizeOrigin: null,
      crop: {
        x: 0,
        y: 0
      }
    }
    this.photoRef = React.createRef()
    this.photoContentRef = React.createRef()
  }

  retrievePhotoSRC(photo) {
    return photo.cropped_url ?
      (photo.cropped_url == "false" ? photo.url : photo.cropped_url) :
      photo.url
  }

  initResize = (event) => {
    this.setState({
      resizeOrigin: event.screenX,
      initialPhotoWidth: this.state.photo.css_width,
      maxWidth: this.photoContentRef.current.clientWidth
    })

    onmousemove = (event) => { this.resizeOnMove(event) }
    onmouseup = () => { this.stopResizing() }
  }

  resizeOnMove = (event) => {
    let newWidth, validWidth = null

    newWidth = this.state.initialPhotoWidth + ((event.screenX - this.state.resizeOrigin) / this.state.maxWidth) * 100
    validWidth = newWidth > 100 ? 100 : (newWidth < 20 ? 20 : newWidth)

    let newPhotoState = update(this.state.photo, { css_width: { $set: validWidth }})

    this.setState({photo: newPhotoState})
  }

  stopResizing = () => {
    onmousemove = null;
    this.updatePhoto({css_width: this.state.photo.css_width})
    onmouseup = null;
  }

  updatePhoto = async (photoCharacteristics) => {
    const newPhoto = await ajaxHelpers.ajaxCall(
      'PUT',
      `/photos/${this.state.photo.id}`,
      { photo: photoCharacteristics },
      this.props.token
    )

    this.setState({
      photo: newPhoto,
      cropped: /c_crop/.test(this.retrievePhotoSRC(newPhoto)),
      src: this.retrievePhotoSRC(newPhoto),
      processing: false,
      customizationActive: false
    })
  }

  deleteElement = (event) => { this.props.deleteElement(event, this.props.id, this.props.position, "photos") }

  onCropChange = (crop) => {  this.setState({ crop, customizationActive: true }) }

  onDragStart = (event) => {
    this.props.hideMapsCustomizations()
    this.props.onDragStart(event, this.props.id, this.props.position, this.props.photo)
  }

  onDragOver = (event) => { this.props.onDragOver(event, this.props.id, this.props.position) }

  onDragEnter = (event) => { this.props.onDragEnter(event, this.props.id, this.props.position) }

  onDragLeave = (event) => { this.props.onDragLeave(event, this.props.id, this.props.position) }

  onDrop = (event) => { this.props.onDrop(event, this.props.id, this.props.position)}

  getPhotoNode = () => { return this.photoRef.current.componentRef }

  abandonCustomization = () => { this.setState({ customizationActive: false }) }

  activeCustomization = () => { this.setState({ customizationActive: true }) }

  render() {
    return (
      <div id={`content-${this.props.position}`}
      className={`photoInput ${this.props.dragging ? "dragging" : ""} ${this.props.draggingElement ? "draggingElement" : ""}`}
      draggable={!this.props.mapCustomizationOnGoing.status} ref={this.photoContentRef}
      onDragStart={this.onDragStart}
      onDragOver={this.onDragOver}
      onDragEnter={this.onDragEnter}
      onDragLeave={this.onDragLeave}
      onDrop={this.onDrop}>
        <DragVisualElements photo={this.state.photo} activeCustomization={this.activeCustomization}/>
        <DeleteButton deleteElement={this.deleteElement}/>
        <DropZone area={"before"} onDrop={this.onDrop} dropTarget={this.props.dropTarget}/>
        <div className="photoContainer">
          <ProcessingOverlay processing={this.state.processing}/>
          <PhotoCustomization photo={this.state.photo} cropped={this.state.cropped} crop={this.state.crop}
          customizationActive={this.state.customizationActive} abandonCustomization={this.abandonCustomization}
          updatePhoto={this.updatePhoto} getPhotoNode={this.getPhotoNode}/>
          <ElementResize initResize={this.initResize} direction="horizontal"/>
          <ReactCrop
          className={`photo-${this.props.position} ${this.state.cropped ? "cropped" : "original"}`} src={this.state.src} alt=""
          style={{width: `${this.state.photo.css_width}%`}}
          crop={this.state.crop} onChange={this.onCropChange} ref={this.photoRef}/>
        </div>
        <DropZone area={"after"} onDrop={this.onDrop} dropTarget={this.props.dropTarget}/>
      </div>
    )
  }
}

PhotoForm.propTypes = {
  photo: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  articleId: PropTypes.number.isRequired,
  position: PropTypes.number.isRequired,
  token: PropTypes.string.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
  onDragEnter: PropTypes.func.isRequired,
  onDragLeave: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  deleteElement: PropTypes.func.isRequired,
  mapCustomizationOnGoing: PropTypes.object,
  hideMapsCustomizations: PropTypes.func.isRequired,
  draggingElement: PropTypes.bool,
  dragging: PropTypes.bool,
  dropTarget: PropTypes.object
}

export default PhotoForm
