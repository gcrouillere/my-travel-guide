import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import $ from 'jquery'
import ReactQuill from 'react-quill'
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

  onDragStart = (event) => {
    document.querySelectorAll(".mapCustomization, .markerCustomization, .polylineCustomization").forEach(x => {x.classList.remove("active")})
    this.props.onDragStart(event, this.props.id, this.props.position, this.props.textContent)
  }

  onDragOver = (event) => {this.props.onDragOver(event, this.props.id, this.props.position)}

  onDragEnter = (event) => {this.props.onDragEnter(event, this.props.id, this.props.position)}

  onDragLeave = (event) => {this.props.onDragLeave(event, this.props.id, this.props.position)}

  onDrop = (event) => {this.props.onDrop(event, this.props.id, this.props.position)}

  render() {
    return (
      <div id={`content-${this.props.position}`} className="textContentInput" draggable={!this.props.mapCustomizationOnGoing.status}
      onDragStart={this.onDragStart}
      onDragOver={this.onDragOver}
      onDragEnter={this.onDragEnter}
      onDragLeave={this.onDragLeave}
      onDrop={this.onDrop}>
        <DragVisualElements />
        <DeleteButton deleteElement={this.deleteElement}/>
        <DropZone area={"before"} onDrop={this.onDrop}/>
        <ReactQuill value={this.state.textContent} onBlur={this.saveOnBlur} onChange={this.handleChange} />
        <DropZone area={"after"} onDrop={this.onDrop}/>
      </div>
    )
  }
}

export default TextContentForm
