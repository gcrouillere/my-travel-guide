import React, { Component } from 'react'
import PropTypes from 'prop-types'

import update from 'immutability-helper'

import ajaxHelpers from './../../utils/ajaxHelpers'
import mainHelpers from './../../utils/mainHelpers'
import TextContentForm from './textContentForm'
import MapForm from './mapForm'
import PhotoForm from './photoForm'
import DropZone from './formElementManagement/dropZone'
import DragVisualElements from './formElementManagement/dragVisualElements'
import DeleteButton from './formElementManagement/deleteButton'
import ElementResize from './formElementManagement/elementResize'

class DoubleContentForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      doubleContent: this.props.doubleContent,
      resizeOrigin: null,
      initialContentHeight: null,
      textHeight: this.props.doubleContent.texts ? this.props.doubleContent.height : 0,
      secondContentActive: false
    }
  }

  onDragStart = (event) => {
    this.props.hideMapsCustomizations()
    this.props.onDragStart(event, this.props.id, this.props.position, this.props.doubleContent)
  }

  onDragOver = (event) => { this.props.onDragOver(event, this.props.id, this.props.position) }

  onDragEnter = (event) => { this.props.onDragEnter(event, this.props.id, this.props.position) }

  onDragLeave = (event) => { this.props.onDragLeave(event, this.props.id, this.props.position) }

  onDrop = (event) => { this.props.onDrop(event, this.props.id, this.props.position) }

  deleteElement = (event) => {this.props.deleteElement(event, this.props.id, this.props.position, "double_contents")}

  initMoveUp = () => {
    this.props.hideMapsCustomizations()
    this.props.moveUp(this.props.id, this.props.position)
  }

  initMoveDown = () => {
    this.props.hideMapsCustomizations()
    this.props.moveDown(this.props.id, this.props.position)
  }

  initResize = (event) => {
    const yOrigin = event.touches ? event.touches[0].screenY : event.screenY
    this.setState({ resizeOrigin: yOrigin, initialContentHeight: this.state.doubleContent.height });

    if (mainHelpers.isTouchDevice()) {
      ontouchmove = (event) => { this.resizeOnMove(event) }
      ontouchend  = () => { this.stopResizing() }
    } else {
      onmousemove = (event) => { this.resizeOnMove(event) }
      onmouseup = () => { this.stopResizing() }
    }
  }

  resizeOnMove(event) {
    let newHeight, validHeight = null
    const yMove = event.touches ? event.touches[0].screenY : event.screenY

    newHeight = (this.state.initialContentHeight + (yMove - this.state.resizeOrigin))
    console.log(this.state.textHeight, "this.state.textHeight")
    console.log(newHeight, "newHeight")
    validHeight = this.state.textHeight > 250 ?
      (this.state.textHeight < newHeight ? newHeight : this.state.textHeight) :
      (newHeight < 250 ? 250 : newHeight)

    let updatedDoubleContent = update(this.state.doubleContent, { height: { $set: validHeight }})
    this.setState({ doubleContent: updatedDoubleContent })
  }

  stopResizing() {
    this.setState({ resizeOrigin: null, initialContentHeight: null })
    onmousemove = null;
    this.updateDoubleContent({ height: this.state.doubleContent.height })
    onmouseup = null;
  }

  reportNewTextHeight = (newHeight) => {
    this.setState({ textHeight: newHeight })
    if (newHeight > this.state.doubleContent.height) {
      console.log(newHeight)
      this.updateDoubleContent({ height: newHeight })
    }
  }

  async updateDoubleContent(doubleContentCharacteristics) {
    let updatedContent = await ajaxHelpers.ajaxCall(
      'PUT', `/double_contents/${this.state.doubleContent.id}`,
      { double_content: doubleContentCharacteristics },
      this.props.token
    )

    this.setState({ doubleContent: updatedContent })
  }

  preventDraggingOnOtherElements = (trigger) => {
    this.props.preventDraggingOnOtherElements(trigger)
  }

  activateSecondContent = () => { this.setState({ secondContentActive: !this.state.secondContentActive })}

  render() {

    return(
      <div id={`double-content-${this.props.position}`}
        className={`doubleContentInput ${this.props.dragging ? "dragging" : ""} ${this.props.draggingElement ? "draggingElement" : ""}`}
        draggable={!this.props.mapCustomizationOnGoing.status && this.props.draggable}
        onDragStart={this.onDragStart}
        onTouchStart={this.onTouchStart}
        onTouchEnd={this.onTouchEnd}
        onTouchCancel={this.onTouchCancel}
        onTouchMove={this.onTouchMove}
        onDragOver={this.onDragOver}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}>
        <DragVisualElements initMoveDown={this.initMoveDown} initMoveUp={this.initMoveUp} active={this.props.draggable}/>
        <DeleteButton deleteElement={this.deleteElement} active={this.props.draggable}/>
        <DropZone area={"before"} onDrop={this.onDrop} dropTarget={this.props.dropTarget} active={this.props.draggable}/>
        <div className={`double-content-elements ${ this.state.secondContentActive ? "active" : "" }`}
        draggable={false} style={{ height: `${this.state.doubleContent.height}px`}}>
          <ElementResize initResize={this.initResize} direction="vertical" active={this.props.draggable}/>
          { this.props.doubleContent.associated_instances_mapping.map( (type, index) => {
            if (type[0] === "TextContent") {
              const text_content = this.props.doubleContent.text_contents[index] || this.props.doubleContent.text_contents[0]
              return <TextContentForm key={`text${text_content.id}`} textContent={text_content} draggable={false}
              mapCustomizationOnGoing={{ status: false, trigger: null }} hideMapsCustomizations={this.hideMapsCustomizations}
              token={this.props.token} doubleContentID={this.props.id} id={text_content.id} articleId={null}
              dragging={false} draggingElement={false} dropTarget={null} position={text_content.position}
              onDragStart={this.onDragStart} onDragOver={this.onDragOver} onDragEnter={this.onDragEnter}
              onDragLeave={this.onDragLeave} onDrop={this.onDrop} deleteElement={null} moveUp={null} moveDown={null}
              reportNewTextHeight={this.reportNewTextHeight} doubleContentHeight={this.state.doubleContent.height}
              activateSecondContent={this.activateSecondContent} height={this.state.doubleContent.height}/>
            }
            if (type[0] === "Map") {
              const map = this.props.doubleContent.maps[index] || this.props.doubleContent.maps[0]
              return <MapForm key={`map${map.id}`} map={map} name={map.name} draggable={false}
              position={map.position} id={map.id} token={this.props.token}
              dragging={false} draggingElement={false} dropTarget={null}
              onDragStart={this.onDragStart} onDragOver={this.onDragOver} onDragEnter={this.onDragEnter}
              onDragLeave={this.onDragLeave} onDrop={this.onDrop} deleteElement={null} moveUp={null} moveDown={null}
              preventDraggingOnOtherElements={this.preventDraggingOnOtherElements}
              activateSecondContent={this.activateSecondContent} height={this.state.doubleContent.height}/>
            }
            if (type[0] === "Photo") {
              const photo = this.props.doubleContent.photos[index] || this.props.doubleContent.photos[0]
              return <PhotoForm key={`photo${photo.id}`} photo={photo} draggable={false}
              mapCustomizationOnGoing={{ status: false, trigger: null }} hideMapsCustomizations={this.hideMapsCustomizations}
              id={photo.id} token={this.props.token}
              dragging={false} draggingElement={false} dropTarget={null} position={photo.position}
              onDragStart={this.onDragStart} onDragOver={this.onDragOver} onDragEnter={this.onDragEnter}
              onDragLeave={this.onDragLeave} onDrop={this.onDrop} deleteElement={null} moveUp={null} moveDown={null}
              activateSecondContent={this.activateSecondContent} />
            }
          })}
        </div>
        <DropZone area={"after"} onDrop={this.onDrop} dropTarget={this.props.dropTarget} active={this.props.draggable}/>
      </div>
    )
  }
}

export default DoubleContentForm

