import React, { Component } from 'react'
import PropTypes from 'prop-types'
import $ from 'jquery'
import ReactQuill from 'react-quill'

import update from 'immutability-helper'

import ajaxHelpers from './../../utils/ajaxHelpers'
import DropZone from './formElementManagement/dropZone'
import DragVisualElements from './formElementManagement/dragVisualElements'
import DeleteButton from './formElementManagement/deleteButton'

class TextContentForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      textContent: this.props.textContent.text,
    }
  }

  componentDidMount() {
    this.adjustHeight()
  }

  modules = {
    toolbar: [
      [{ 'header': [2, 3, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link']
    ],
  }

  adjustHeight = () => {
    const toolBarHeight = document.querySelector(`#text-content-${this.props.id} .ql-toolbar`).offsetHeight
    const textBodyHeight = Array.from(document.querySelectorAll(`#text-content-${this.props.id} .ql-editor > *`))
      .map(x => x.offsetHeight).reduce((acc, x) => acc + x)
    // eventually add container padding + 1px to round up toolbar height
    const newHeight = toolBarHeight + textBodyHeight + 24 + 1

    if (this.props.reportNewTextHeight) this.props.reportNewTextHeight(newHeight)
  }

  handleChange = (value) => {
    this.setState({textContent: value})
    this.adjustHeight()
  }

  saveOnBlur = () => {
    let data
    if (this.props.articleId) {
      data = { text_content: { text: this.state.textContent, article_id: this.props.articleId }}
    } else {
      data = { text_content: { text: this.state.textContent, double_content_id: this.props.doubleContentID }}
    }

    ajaxHelpers.ajaxCall('PUT', `/text_contents/${this.props.id}`, data, this.props.token)
  }

  deleteElement = (event) => {this.props.deleteElement(event, this.props.id, this.props.position, "text_contents")}

  onDragStart = (event) => {
    if (this.props.draggable) {
      this.props.hideMapsCustomizations()
      this.props.onDragStart(event, this.props.id, this.props.position, this.props.textContent)
    }
  }

  onDragOver = (event) => { this.props.onDragOver(event, this.props.id, this.props.position) }

  onDragEnter = (event) => { this.props.onDragEnter(event, this.props.id, this.props.position) }

  onDragLeave = (event) => { this.props.onDragLeave(event, this.props.id, this.props.position) }

  onDrop = (event) => { this.props.onDrop(event, this.props.id, this.props.position) }

  preventTextAreaDragging = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  initMoveUp = () => {
    this.props.hideMapsCustomizations()
    this.props.moveUp(this.props.id, this.props.position)
  }

  initMoveDown = () => {
    this.props.hideMapsCustomizations()
    this.props.moveDown(this.props.id, this.props.position)
  }

  render() {

    return (
      <div id={`text-content-${this.props.id}`} ref={this.textContentRef}
      className={`textContentInput ${this.props.dragging ? "dragging" : ""} ${this.props.draggingElement ? "draggingElement" : ""}`}
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
        <ReactQuill value={this.state.textContent} onBlur={this.saveOnBlur} onChange={this.handleChange} modules={this.modules}
        draggable={true} onDragStart={this.preventTextAreaDragging}/>
        <DropZone area={"after"} onDrop={this.onDrop} dropTarget={this.props.dropTarget} active={this.props.draggable}/>
      </div>
    )
  }
}

TextContentForm.propTypes = {
  textContent: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  articleId: PropTypes.number,
  position: PropTypes.number,
  token: PropTypes.string.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
  onDragEnter: PropTypes.func.isRequired,
  onDragLeave: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  deleteElement: PropTypes.func,
  hideMapsCustomizations: PropTypes.func,
  mapCustomizationOnGoing: PropTypes.object,
  draggingElement: PropTypes.bool.isRequired,
  dragging: PropTypes.bool.isRequired,
  dropTarget: PropTypes.object
}

export default TextContentForm
