import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';

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
    console.log("constructor appheader")
  }

  async componentDidMount () {
    const articles = await ajaxHelpers.ajaxCall('GET', "/articles")
    this.setState({ articles: articles }, () => {console.log(this.state, "list did mount")})
  }

  componentDidUpdate() {
    console.log("component didupdate")
  }

  sanitizeAndTruncateHTML(html) {
    return htmlSanitizer.sanitizeAndTruncateHTML(html, 100)
  }

  render() {
    console.log("article list render")
    console.log(this.state, "article list state")
    return (
      <div className="container articles-container">
        <div className="row">
        {this.state.articles.map((article) => {
          return(
            <div key={article.id} className="col-6 col-md-4 article-card">
            <Link to={`articles/${article.id}`}>
              <div className="card">
                <div className="card-header">
                  <p className="card-title">{article.title}</p>
                </div>
                <div className="card-body">
                  <p className="card-text">
                  { article.text_contents[0] ? this.sanitizeAndTruncateHTML(article.text_contents[0].text) : "" }
                  </p>
                  <div className="articleList-audienceSelection">
                    <div className="row justify-content-center">
                      { article.audience_selections.map(audience_selection =>
                        <label key={audience_selection.audience}
                        className="form-check-label col-2">
                          { audience_selection.audience }
                         </label>
                      )}
                    </div>
                  </div>
                </div>
               </div>
             </Link>
            </div>
         )})}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  }
}

export default withRouter(connect(mapStateToProps, null)(ArticlesList))
