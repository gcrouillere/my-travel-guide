import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom'
import  { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
    this.props.history.push("/")
  }

  renderLinkSet() {
    if (this.props.currentUser && this.state.currentLocation.match(/^\/$|^\/articles$|^\/users\/\d+\/articles$/)) {
      const publicArticles = this.state.currentLocation.match(/^\/$|^\/articles$/) ? "active" : ""
      const userArticles = this.state.currentLocation.match(/^\/users\/\d+\/articles$/) ? "active" : ""
      return(
        <div className="menu">
          <Link to="/articles/new" className="nav-link text-white">Create an article</Link>
          <Link to={`/users/${this.props.currentUser.id}/articles`} className={`nav-link text-white ${userArticles}`}>
            Your articles
          </Link>
          <Link to="/articles" className={`nav-link text-white ${publicArticles}`}>
            Public articles
          </Link>
        </div>
      )
    }
    if (this.state.currentLocation.match(/^\/$|^\/articles$|^\/users\/\d+\/articles$/)) {
      return(
        <Link to="/articles/new" className="nav-link text-white">Create an article</Link>
      )
    }
    if (this.props.currentUser.id === this.props.currentArticle.user_id) {
      if(this.state.currentLocation.match(/^\/articles\/\d+$/) && this.props.currentUser) {
        return(
          <div className="menu">
            <Link to={`/articles/${this.state.currentArticleID}/edit`} className="nav-link text-white">Edit article</Link>
            <p className="nav-link text-white" onClick={this.deleteArticle}>Delete article</p>
          </div>
        )
      }
      else if(this.state.currentLocation.match(/^\/articles\/\d+/)) {
       return(
         <div className="menu">
           <Link to={`/articles/${this.state.currentArticleID}`} className="nav-link text-white">See article</Link>
           <p className="nav-link text-white" onClick={this.deleteArticle}>Delete article</p>
         </div>
        )
      }
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
    currentUser: state.currentUser,
    currentArticle: state.currentArticle
  }
}

export default withRouter(connect(mapStateToProps, null)(AppHeader))
