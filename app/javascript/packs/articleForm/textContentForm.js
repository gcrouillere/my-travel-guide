import React, { Component } from 'react'
import PropTypes from 'prop-types'
import $ from 'jquery'
import ReactQuill from 'react-quill'

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
  }

  modules = {
    toolbar: [
      [{ 'header': [2, 3, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}]
    ],
  }

  formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
  ]

  handleChange = (value) => {
    this.setState({textContent: value})
  }

  saveOnBlur = async () => {
    await ajaxHelpers.ajaxCall(
      'PUT',
      `/text_contents/${this.props.id}`,
      { text_content: {text: this.state.textContent, article_id: this.props.articleId} },
      this.props.token
    )
  }

  deleteElement = (event) => {this.props.deleteElement(event, this.props.id, this.props.position, "text_contents")}

  onDragStart = (event) => {
    this.props.hideMapsCustomizations()
    this.props.onDragStart(event, this.props.id, this.props.position, this.props.textContent)
  }

  onDragOver = (event) => {this.props.onDragOver(event, this.props.id, this.props.position)}

  onDragEnter = (event) => {this.props.onDragEnter(event, this.props.id, this.props.position)}

  onDragLeave = (event) => {this.props.onDragLeave(event, this.props.id, this.props.position)}

  onDrop = (event) => {this.props.onDrop(event, this.props.id, this.props.position)}

  preventTextAreaDragging = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  render() {

    return (
      <div id={`content-${this.props.position}`}
      className={`textContentInput ${this.props.dragging ? "dragging" : ""} ${this.props.draggingElement ? "draggingElement" : ""}`}
      draggable={!this.props.mapCustomizationOnGoing.status}
      onDragStart={this.onDragStart}
      onDragOver={this.onDragOver}
      onDragEnter={this.onDragEnter}
      onDragLeave={this.onDragLeave}
      onDrop={this.onDrop}>
        <DragVisualElements />
        <DeleteButton deleteElement={this.deleteElement}/>
        <DropZone area={"before"} onDrop={this.onDrop} dropTarget={this.props.dropTarget}/>
        <ReactQuill value={this.state.textContent} onBlur={this.saveOnBlur} onChange={this.handleChange} modules={this.modules}
        formats={this.formats} draggable={true} onDragStart={this.preventTextAreaDragging}/>
        <DropZone area={"after"} onDrop={this.onDrop} dropTarget={this.props.dropTarget}/>
      </div>
    )
  }
}

TextContentForm.propTypes = {
  textContent: PropTypes.object.isRequired,
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
  hideMapsCustomizations: PropTypes.func.isRequired,
  mapCustomizationOnGoing: PropTypes.object.isRequired,
  draggingElement: PropTypes.bool.isRequired,
  dragging: PropTypes.bool.isRequired,
  dropTarget: PropTypes.object
}

export default TextContentForm
