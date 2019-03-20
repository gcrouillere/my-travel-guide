import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import ReactQuill from 'react-quill'; // ES6
import DropZone from './dropZone'
import $ from 'jquery'
import DragVisualElements from './dragVisualElements'

class TextContentForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      textContent: this.props.textContent.text
    }
  }

  handleChange = (value) => {
    this.setState({textContent: value})
  }

  saveOnBlur = () => {
    $.ajax({
      type: "PATCH",
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/text_contents/${this.props.id}`,
      dataType: "JSON",
      data: {text_content: {text: this.state.textContent, article_id: this.props.articleId}}
    }).done((data) => {
      console.log(data)
    }).fail((data) => {
      console.log(data)
    });
  }

  deleteElement = (event) => {this.props.deleteElement(event, this.props.id, this.props.position, "text_contents")}

  onDragStart = (event) => {this.props.onDragStart(event, this.props.id, this.props.position, this.props.textContent)}

  onDragOver = (event) => {this.props.onDragOver(event, this.props.id, this.props.position)}

  onDragEnter = (event) => {this.props.onDragEnter(event, this.props.id, this.props.position)}

  onDragLeave = (event) => {this.props.onDragLeave(event, this.props.id, this.props.position)}

  onDrop = (event) => {this.props.onDrop(event, this.props.id, this.props.position)}

  render() {
    return (
      <div id={`content-${this.props.position}`} className="textContentInput" draggable
      onDragStart={this.onDragStart}
      onDragOver={this.onDragOver}
      onDragEnter={this.onDragEnter}
      onDragLeave={this.onDragLeave}
      onDrop={this.onDrop}>
        <DropZone area={"before"} onDrop={this.onDrop}/>
        <button onClick={this.deleteElement} className="contentDelete">
          <div>&times;</div>
        </button>
        <ReactQuill value={this.state.textContent} onBlur={this.saveOnBlur} onChange={this.handleChange} />
        <DragVisualElements />
        <DropZone area={"after"} onDrop={this.onDrop}/>
      </div>
    )
  }
}

export default TextContentForm
