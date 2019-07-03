import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer';
import { shallow, configure, mount } from 'enzyme';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';

import AppHeader from '../../app/javascript/packs/appHeader'

configure({ adapter: new Adapter() });

import currentUserReducer from '../../app/javascript/reducers/currentUserReducer'
import currentArticleReducer from '../../app/javascript/reducers/currentArticleReducer'

const reducers = combineReducers({
  currentUser: currentUserReducer,
  currentArticle: currentArticleReducer
})

describe('AppHeader test Suite', () => {
  it('renders component', () => {
    const appHeaderTree = renderer.create(
      <Provider store={createStore(reducers)}>
        <Router>
          <AppHeader location={{pathname: "/articles"}}/>
        </Router>
      </Provider>
    ).toJSON()
    expect(appHeaderTree).toMatchSnapshot()
  })
})
