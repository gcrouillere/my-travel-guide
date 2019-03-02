import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import ReactQuill from 'react-quill'; // ES6
import $ from 'jquery'
import Article from './article'

class TextContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      textContent: this.props.textContent,
      id: this.props.id
    }
  }

  handleChange = (value) => {
    this.setState({textContent: value})
  }

  saveOnBlur = () => {
    $.ajax({
      type: "PATCH",
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/text_contents/${this.state.id}`,
      dataType: "JSON",
      data: {text_content: {text: this.state.textContent}}
    }).done((data) => {
      console.log(data)
    }).fail((data) => {
      console.log(data)
    });
  }

  render() {
    return (
      <div className="textContentInput">
        <ReactQuill value={this.state.textContent} onBlur={this.saveOnBlur} onChange={this.handleChange} />
      </div>
    )
  }
}

export default TextContent
