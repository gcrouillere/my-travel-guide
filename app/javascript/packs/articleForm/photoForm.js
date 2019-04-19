import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import DropZone from './formElementManagement/dropZone'
import DragVisualElements from './formElementManagement/dragVisualElements'
import DeleteButton from './formElementManagement/deleteButton'
import $ from 'jquery'

class PhotoForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  deleteElement = (event) => {this.props.deleteElement(event, this.props.id, this.props.position, "photos")}

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
          <img src={this.props.photo.url} alt=""/>
        </div>
        <DropZone area={"after"} onDrop={this.onDrop}/>
      </div>
    )
  }
}
export default PhotoForm
