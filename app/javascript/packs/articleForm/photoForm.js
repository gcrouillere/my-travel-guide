import React, { Component } from 'react'
import PropTypes from 'prop-types'

import $ from 'jquery'
import update from 'immutability-helper'
import ReactCrop from 'react-image-crop'

import DropZone from './formElementManagement/dropZone'
import DragVisualElements from './formElementManagement/dragVisualElements'
import DeleteButton from './formElementManagement/deleteButton'
import ElementResize from './formElementManagement/elementResize'
import PhotoCustomization from './photoForm/photoCustomization'
import ShowSecondContentButton from './formElementManagement/showSecondContentButton'
import ajaxHelpers from './../../utils/ajaxHelpers'
import photoHelpers from './../../utils/photoHelpers'
import mainHelpers from './../../utils/mainHelpers'

class PhotoForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      photo: this.props.photo,
      src: photoHelpers.retrievePhotoSRC(this.props.photo),
      cropped: /c_crop/.test(photoHelpers.retrievePhotoSRC(this.props.photo)),
      processing: false,
      customizationActive: false,
      resizeOrigin: null,
      crop: {
        x: 0,
        y: 0,
        height: 0,
        width: 0
      },
      clientWidth: document.body.clientWidth
    }
    this.photoRef = React.createRef()
    this.photoContentRef = React.createRef()
  }

  initResize = (event) => {
    const xOrigin = event.touches ? event.touches[0].screenX : event.screenX
    this.setState({
      resizeOrigin: xOrigin,
      initialPhotoWidth: this.state.photo.css_width,
      maxWidth: this.photoContentRef.current.clientWidth
    })

    if (mainHelpers.isTouchDevice()) {
      ontouchmove = (event) => { this.resizeOnMove(event) }
      ontouchend  = () => { this.stopResizing() }
    } else {
      onmousemove = (event) => { this.resizeOnMove(event) }
      onmouseup = () => { this.stopResizing() }
    }
  }

  resizeOnMove = (event) => {
    const xMove = event.touches ? event.touches[0].screenX : event.screenX
    let newWidth, validWidth, pictureRatio, minPCWidth, maxPCWidth = null

    pictureRatio = this.state.photo.original_width / this.state.photo.original_height
    minPCWidth = (pictureRatio * 330) / this.state.maxWidth * 100
    maxPCWidth = this.state.photo.original_width / this.state.maxWidth > 1 ? 100 : this.state.photo.original_width / this.state.maxWidth * 100
    newWidth = this.state.initialPhotoWidth + ((xMove - this.state.resizeOrigin) / this.state.maxWidth) * 100
    validWidth = newWidth > maxPCWidth  ? maxPCWidth : (newWidth < minPCWidth ? minPCWidth : newWidth)

    let newPhotoState = update(this.state.photo, { css_width: { $set: validWidth }})
    this.setState({photo: newPhotoState})
  }

  stopResizing = () => {
    if (mainHelpers.isTouchDevice()) {
      ontouchmove = null;
      ontouchend = null;
    } else {
      onmousemove = null;
      onmouseup = null
    }

    this.updatePhoto({css_width: this.state.photo.css_width})
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
      cropped: /c_crop/.test(photoHelpers.retrievePhotoSRC(newPhoto)),
      src: photoHelpers.retrievePhotoSRC(newPhoto),
      processing: false,
      customizationActive: false
    })
  }

  deleteElement = (event) => { this.props.deleteElement(event, this.props.id, this.props.position, "photos") }

  onCropChange = (crop) => {  this.setState({ crop, customizationActive: true }) }

  onDragStart = (event) => {
    if (this.props.draggable) {
      this.props.hideMapsCustomizations()
      this.props.onDragStart(event, this.props.id, this.props.position, this.props.photo)
    }
  }

  onDragOver = (event) => { this.props.onDragOver(event, this.props.id, this.props.position) }

  onDragEnter = (event) => { this.props.onDragEnter(event, this.props.id, this.props.position) }

  onDragLeave = (event) => { this.props.onDragLeave(event, this.props.id, this.props.position) }

  onDrop = (event) => { this.props.onDrop(event, this.props.id, this.props.position)}

  getPhotoNode = () => { return this.photoRef.current.componentRef }

  abandonCustomization = () => { this.setState({ customizationActive: false }) }

  activeCustomization = () => { this.setState({ customizationActive: true }) }

  definePhotoWidth = () => { return this.state.clientWidth >= 768 ? this.state.photo.css_width : 100 }

  initMoveUp = () => {
    this.props.hideMapsCustomizations()
    this.props.moveUp(this.props.id, this.props.position)
  }

  initMoveDown = () => {
    this.props.hideMapsCustomizations()
    this.props.moveDown(this.props.id, this.props.position)
  }

  activateSecondContent = () => { this.props.activateSecondContent(this.state.active) }

  render() {
    return (
      <div id={`photo-content-${this.props.id}`}
      className={`photoInput ${this.props.dragging ? "dragging" : ""} ${this.props.draggingElement ? "draggingElement" : ""}
      ${!this.props.draggable && this.props.position === 0 ? "firstContent" : "secondContent"}`}
      draggable={!this.props.mapCustomizationOnGoing.status && this.props.draggable} ref={this.photoContentRef}
      onDragStart={this.onDragStart}
      onDragOver={this.onDragOver}
      onDragEnter={this.onDragEnter}
      onDragLeave={this.onDragLeave}
      onDrop={this.onDrop}>

        { !this.props.draggable &&
          <ShowSecondContentButton activateSecondContent={this.activateSecondContent}/>
        }

        <DragVisualElements photo={this.state.photo} activeCustomization={this.activeCustomization}
        initMoveDown={this.initMoveDown} initMoveUp={this.initMoveUp} active={this.props.draggable}/>
        <DeleteButton deleteElement={this.deleteElement} active={this.props.draggable}/>
        <DropZone area={"before"} onDrop={this.onDrop} dropTarget={this.props.dropTarget} active={this.props.draggable}/>
        <div className="photoContainer">
        { this.props.draggable ?
          <PhotoCustomization photo={this.state.photo} cropped={this.state.cropped} crop={this.state.crop}
          customizationActive={this.state.customizationActive} abandonCustomization={this.abandonCustomization}
          updatePhoto={this.updatePhoto} getPhotoNode={this.getPhotoNode}/>
          : null
        }
        { this.props.draggable ?
          <ElementResize initResize={this.initResize} direction="horizontal" active={this.props.draggable}/>
          : null
        }
        { this.props.draggable ?
          <ReactCrop
          className={`photo-${this.props.position} ${this.state.cropped ? "cropped" : "original"}`} src={this.state.src} alt=""
          style={{width: `${this.definePhotoWidth()}%`}}
          crop={this.state.crop} onChange={this.onCropChange} ref={this.photoRef}/>
          : <div className="mixedPhoto" style={{ backgroundImage: `url(${this.state.src})`}}>
              <img className="mixedPhotoMobile"src={this.state.src} alt=""/>
            </div>
        }
        </div>
        <DropZone area={"after"} onDrop={this.onDrop} dropTarget={this.props.dropTarget} active={this.props.draggable}/>
      </div>
    )
  }
}

PhotoForm.propTypes = {
  photo: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  position: PropTypes.number,
  token: PropTypes.string.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
  onDragEnter: PropTypes.func.isRequired,
  onDragLeave: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  deleteElement: PropTypes.func,
  mapCustomizationOnGoing: PropTypes.object,
  hideMapsCustomizations: PropTypes.func,
  draggingElement: PropTypes.bool,
  dragging: PropTypes.bool,
  dropTarget: PropTypes.object
}

export default PhotoForm
