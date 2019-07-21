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
      textContent: this.props.textContent.text
    }
    this.textContentRef = React.createRef();
  }

  modules = {
    toolbar: [
      [{ 'header': [2, 3, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link']
    ],
  }

  handleChange = (value) => {
    this.setState({textContent: value})
    this.updateHeightOnChange()
  }

  updateHeightOnChange = () => {
    const toolBarHeight = document.querySelector(`#content-${this.props.position} .ql-toolbar.ql-snow `).offsetHeight
    const containerHeight = Array.from(document.querySelectorAll(`#content-${this.props.position} .ql-container.ql-snow .ql-editor`))
      .map(x => x.offsetHeight).reduce((acc, x) => acc + x)
    const textContentHeight = toolBarHeight + containerHeight

    if (this.props.reportNewTextHeight) this.props.reportNewTextHeight(textContentHeight)
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
      <div id={`content-${this.props.position}`} ref={this.textContentRef}
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
  onDragStart: PropTypes.func,
  onDragOver: PropTypes.func,
  onDragEnter: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDrop: PropTypes.func,
  deleteElement: PropTypes.func,
  hideMapsCustomizations: PropTypes.func,
  mapCustomizationOnGoing: PropTypes.object,
  draggingElement: PropTypes.bool.isRequired,
  dragging: PropTypes.bool.isRequired,
  dropTarget: PropTypes.object
}

export default TextContentForm
