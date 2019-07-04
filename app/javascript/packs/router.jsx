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
import currentAudienceSelectionReducer from '../reducers/currentAudienceSelectionReducer'
import articlesReducer from '../reducers/articlesReducer'
import mapCentersMarkersReducer from '../reducers/mapCentersMarkersReducer'


const reducers = combineReducers({
  currentUser: currentUserReducer,
  currentArticle: currentArticleReducer,
  currentAudienceSelection: currentAudienceSelectionReducer,
  audiencesSelection: (state = null, action) => state,
  articles: articlesReducer,
  mapCentersMarkers: mapCentersMarkersReducer
})

const initialState = {
  currentUser: {},
  currentArticle: {},
  audiencesSelection: JSON.parse(document.getElementById("root").getAttribute("data-audiences")),
  currentAudienceSelection: [],
  articles: [],
  mapCentersMarkers: []
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
