import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TextContentForm from './articleForm/textContentForm'
import $ from 'jquery'
import 'react-quill/dist/quill.snow.css';
import ajaxHelpers from './../utils/ajaxHelpers'

class Article extends Component {
  constructor(props) {
    super(props)
    this.state = {
      textContents: [],
      text: "",
      title: ""
    }
    this.articlesDivRef = React.createRef()
  }

  async componentDidMount() {
    const article = await ajaxHelpers.ajaxCall('GET', `/articles/${this.props.match.params.id}`, {}, {})

    this.setState({title: article.title, textContents: article.text_contents})
  }

  createTextContentsHTML(textContents) {
    textContents.forEach((textContent) => {
      this.articlesDivRef.current.insertAdjacentHTML('beforeend', textContent.text)
    })
  }

  render() {
    return (
      <div className="container article-container">

        <header className="text-center">
          <h1>{this.state.title}</h1>
        </header>

        <div ref={this.articlesDivRef} id="articleTextContents">
          {this.createTextContentsHTML(this.state.textContents)}
        </div>

      </div>
    )
  }
}

Article.propTypes = {
  match: PropTypes.object.isRequired
}

export default Article
