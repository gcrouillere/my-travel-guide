import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import $ from 'jquery'
import update from 'immutability-helper'
import htmlSanitizer from './../utils/htmlSanitizer'

class ArticlesList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      articles: this.props.articles || []
    }
  }

  componentDidMount () {
    $.ajax({
      method: 'GET',
      url: "/articles",
      dataType: "JSON"
    }).then(response => {
      this.setState({articles: response});
    }).fail( response => {
      console.log(response)
    })
  }

  deleteArticle = (event) => {
    const articleID = event.target.getAttribute('articlid')
    const articleIndex = this.state.articles.findIndex(x => x.id == articleID)
    $.ajax({
      type: "DELETE",
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/articles/${articleID}`,
      dataType: "JSON",
    }).done((data) => {
      const articles = update(this.state.articles, {$splice: [[articleIndex, 1]]})
      this.setState({articles: articles})
    }).fail((response) => {
      console.log(response);
    })
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
