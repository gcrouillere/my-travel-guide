import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import $ from 'jquery'
import update from 'immutability-helper'

import htmlSanitizer from './../utils/htmlSanitizer'
import ajaxHelpers from './../utils/ajaxHelpers'

class ArticlesList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      articles: [],
      token: $('meta[name="csrf-token"]').attr('content')
    }
  }

  async componentDidMount () {
    const articles = await ajaxHelpers.ajaxCall('GET', "/articles")
    this.setState({articles: articles})
  }

  deleteArticle = async (event) => {
    const articleID = event.target.getAttribute('articlid')

    await ajaxHelpers.ajaxCall('DELETE', `/articles/${articleID}`, {}, this.state.token)

    const articleIndex = this.state.articles.findIndex(x => x.id == articleID)
    const articles = update(this.state.articles, {$splice: [[articleIndex, 1]]})
    this.setState({articles: articles})
  }

  sanitizeAndTruncateHTML(html) {
    return htmlSanitizer.sanitizeAndTruncateHTML(html, 100)
  }

  render() {
    return (
      <div className="container articles-container">
        <div className="row">
        {this.state.articles.map((article) => {
          return(
            <div key={article.id} className="col-6 col-md-4 article-card">
              <div className="card">
                  <div className="card-header">
                    <Link to={`articles/${article.id}`}>
                      <span className="card-title">{article.title}</span>
                    </Link>
                    <button onClick={this.deleteArticle} className="close" aria-label="Close">
                      <span aria-hidden="true" articlid={article.id}>&times;</span>
                    </button>
                  </div>
                <div className="card-body">
                  <p className="card-text">
                  { article.text_contents[0] ? this.sanitizeAndTruncateHTML(article.text_contents[0].text) : "" }
                  </p>
                  <Link to={`articles/${article.id}/edit`} className="btn btn-primary text-white">Edit</Link>
                </div>
               </div>
            </div>
         )})}
        </div>
      </div>
    )
  }
}

export default ArticlesList
