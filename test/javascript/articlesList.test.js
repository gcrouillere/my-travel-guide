import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import toJson from 'enzyme-to-json';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import update from 'immutability-helper'

import ArticlesList from '../../app/javascript/packs/articlesList'
import article from './__mocks__/fakeArticle'
import ajaxHelpers from '../../app/javascript/utils/ajaxHelpers'

import currentUserReducer from '../../app/javascript/reducers/currentUserReducer'
import currentArticleReducer from '../../app/javascript/reducers/currentArticleReducer'

const reducers = combineReducers({
  currentUser: currentUserReducer,
  currentArticle: currentArticleReducer
})

configure({ adapter: new Adapter() });

const articleslist = [article, update(article, {id: {$set: 1}})]

jest.mock('../../app/javascript/utils/ajaxHelpers', () => jest.fn())

ajaxHelpers.ajaxCall = jest.fn(() => { return Promise.resolve(articleslist) })

describe('ArticlesList test Suite', () => {

  it('renders component', async () => {
    const articlesListTree = await mount(
      <Provider store={createStore(reducers)}>
        <Router><ArticlesList/></Router>
      </Provider>
      )

    expect(toJson(articlesListTree)).toMatchSnapshot()
  })
})
