import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { Route } from 'react-router-dom'
import AppHeader from './appHeader';
import ArticlesList from './articlesList'
import Article from './article'
import ArticleForm from './articleForm'

export default class App extends Component {

  render() {
    return (
      <div>
        <Route component={AppHeader} />
        {["/", "/articles"].map((path, index) =>
          <Route key={index} exact path={path} component={ArticlesList}/>
        )}
        <Route exact path="/articles/:id" component={Article}/>
        {["/articles/:id/edit", "/articles/new"].map((path, index) =>
          <Route key={index} exact path={path} component={ArticleForm}/>
        )}
      </div>
    )
  }
}
