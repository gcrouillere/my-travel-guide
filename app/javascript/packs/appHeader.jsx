import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';

import $ from 'jquery'

import ajaxHelpers from '../utils/ajaxHelpers'

class AppHeader extends Component {

  constructor(props) {
    super(props)
    this.state = {
      token: $('meta[name="csrf-token"]').attr('content'),
      currentLocation: this.props.location.pathname,
      currentArticleID: this.getCurrentArticle(this.props.location.pathname)
    }
  }

  getCurrentArticle(pathname) {
      return pathname.split("/")
      .map(x => /^\d+$/.test(x) ? parseInt(x) : x)
      .filter(x => typeof(x) === "number")[0]
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      currentLocation: newProps.location.pathname,
      currentArticleID: this.getCurrentArticle(newProps.location.pathname)
    })
  }

  deleteArticle = async () => {
    await ajaxHelpers.ajaxCall('DELETE', `/articles/${this.state.currentArticleID}`, {}, this.state.token)
    this.props.history.push(`/articles/`)
  }

  renderLinkSet() {
    if (this.state.currentLocation.match(/^\/$|^\/articles$/)) {
      return(
        <Link to="/articles/new" className="nav-link text-white">Create an article</Link>
      )
    }
    else if(this.state.currentLocation.match(/^\/articles\/\d+$/) && this.props.currentUser) {
      return(
        <div className="menu">
          <Link to={`/articles/${this.state.currentArticleID}/edit`} className="nav-link text-white">Edit article</Link>
          <a href="" className="nav-link text-white" onClick={this.deleteArticle}>Delete Article</a>
        </div>
      )
    }
    else if(this.state.currentLocation.match(/^\/articles\/\d+/)) {
     return(
       <a href="" className="nav-link text-white" onClick={this.deleteArticle}>Delete Article</a>
      )
    }
  }

  render() {
    return(
      <div>
        <nav className="navbar navbar-light bg-dark">
          <div className="brand">
            <Link to="/" className="navbar-brand nav-link text-white">
              My Travel Guide
            </Link>
          </div>
          <div className="menu">
            { this.renderLinkSet() }
          </div>
        </nav>
      </div>
    )
  }
}

AppHeader.propTypes = {
  location: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  }
}

export default withRouter(connect(mapStateToProps, null)(AppHeader))
