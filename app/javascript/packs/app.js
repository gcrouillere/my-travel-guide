import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import AppHeader from './appHeader';
import ArticlesList from './articlesList'
import Article from './article'
import ArticleForm from './articleForm'
import { fetchUser, fetchArticle} from '../actions/index'

export class App extends Component {

  componentWillMount() {
    this.props.fetchUser();
    this.storeArticle()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.storeArticle()
  }

  storeArticle() {
    const articleID = this.getCurrentArticle(this.props.location.pathname)
    if (articleID) this.props.fetchArticle(articleID);
  }

  getCurrentArticle(pathname) {
    if(/\/articles\/\d+/.test(pathname))
      return pathname.split("/")
        .map(x => /^\d+$/.test(x) ? parseInt(x) : x)
        .filter(x => typeof(x) === "number")[0]
  }

  locationNeedsRedirect() {
    return !(/^\/(article\/?)?$|users/.test(this.props.location.pathname))
  }

  render() {
    if(this.props.currentUser === null && this.locationNeedsRedirect()) return window.location.href = `${window.origin}/users/sign_in`
    return (
      <div>
        <Route component={AppHeader} />
        {["/articles/:id/edit", "/articles/new"].map((path, index) =>
          <Route key={index} exact path={path} component={ArticleForm}/>
        )}
        {["/articles/:id", "/users/:id/articles/:id"].map((path, index) =>
          <Route key={index} exact path={path} component={Article}/>)
        }
        {["/", "/articles", "/users/:id/articles"].map((path, index) =>
          <Route key={index} exact path={path} component={ArticlesList}/>
        )}
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { fetchUser, fetchArticle },
    dispatch
  )
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
