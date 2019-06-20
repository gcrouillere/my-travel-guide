import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { logger } from 'redux-logger';
import reduxPromise from 'redux-promise';

import App from './app'
import currentUserReducer from '../reducers/currentUserReducer'
import currentArticleReducer from '../reducers/currentArticleReducer'

const reducers = combineReducers({
  currentUser: currentUserReducer,
  currentArticle: currentArticleReducer
})

const initialState = {
  currentUser: {},
  currentArticle: {}
}

const middlewares = applyMiddleware(reduxPromise, logger);

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    (
      <Provider store={createStore(reducers, initialState, middlewares)}>
        <Router>
          <App/>
        </Router>
      </Provider>),
    document.getElementById('root')
  )
});
