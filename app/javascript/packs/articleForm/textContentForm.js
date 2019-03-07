import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import ReactQuill from 'react-quill'; // ES6
import DropZone from './dropZone'
import $ from 'jquery'

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

  onDragStart = (event) => {this.props.onDragStart(event, this.props.id, "TextContent", this.props.position)}

  onDragOver = (event) => {this.props.onDragOver(event, this.props.id, this.props.position)}

  onDragEnter = (event) => {this.props.onDragEnter(event, this.props.id, this.props.position)}

  onDragLeave = (event) => {this.props.onDragLeave(event, this.props.id, this.props.position)}

  onDrop = (event) => {this.props.onDrop(event, this.props.id, this.props.position)}

  render() {
    return (
      <div className="textContentInput" id={`content-${this.props.position}`} draggable
      onDragStart={this.onDragStart}
      onDragOver={this.onDragOver}
      onDragEnter={this.onDragEnter}
      onDragLeave={this.onDragLeave}
      onDrop={this.onDrop}>
        <DropZone area={"before"} onDrop={(event) => this.onDrop(event, this.props.id, this.props.position)}/>
        <ReactQuill value={this.state.textContent} onBlur={this.saveOnBlur} onChange={this.handleChange} />
        <DropZone area={"after"} onDrop={(event) => this.onDrop(event, this.props.id, this.props.position)}/>
      </div>
    )
  }
}

export default TextContentForm
