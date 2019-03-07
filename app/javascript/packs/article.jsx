import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import TextContentForm from './articleForm/textContentForm'
import $ from 'jquery'
import 'react-quill/dist/quill.snow.css';

class Article extends Component {
  constructor(props) {
    super(props)
    this.state = {
      textContents: [],
      text: "",
      title: ""
    }
  }

  componentDidMount() {
    $.ajax({
      method: 'GET',
      url: `/articles/${this.props.match.params.id}`,
      dataType: "JSON"
    }).done((data) => {
      this.setState({title: data.title, textContents: data.text_contents});
    });
  }

  createTextContentsHTML(textContents) {
    var textContentsReceiver = document.getElementById('articleTextContents');
    textContents.forEach((textContent) => {
      textContentsReceiver.insertAdjacentHTML('beforeend', textContent.text);
    })
  }

  render() {
    return (
      <div className="container article-container">

        <header className="text-center">
          <h1>{this.state.title}</h1>
        </header>

        <div id="articleTextContents">
          {this.createTextContentsHTML(this.state.textContents)}
        </div>

      </div>
    )
  }
}

export default Article
