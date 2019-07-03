import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import { MemoryRouter } from 'react-router'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import currentUserReducer from '../../app/javascript/reducers/currentUserReducer'
import currentArticleReducer from '../../app/javascript/reducers/currentArticleReducer'

const reducers = combineReducers({
  currentUser: currentUserReducer,
  currentArticle: currentArticleReducer
})

const initialState = {
  currentUser: { id: 1, email: "test@emaiL.fr" },
  currentArticle: { id: 4, title: "My fake title" }
}

jest.mock('../../app/javascript/actions/index')

import App from '../../app/javascript/packs/app';
import Article from '../../app/javascript/packs/article';
import ArticleForm from '../../app/javascript/packs/articleForm';

configure({ adapter: new Adapter() });

 describe('App test suite', () => {
  it('renders App without crashing', () => {
    const AppTree = renderer.create(
      <Provider store={createStore(reducers, initialState)}>
        <Router><App/></Router>
      </Provider>
    ).toJSON()
    expect(AppTree).toMatchSnapshot()
  });

  it('renders Article according to path', () => {
    const AppTreeArticle = mount(
      <Provider store={createStore(reducers, initialState)}>
        <MemoryRouter initialEntries={["/articles/4"]} initialIndex={0} >
          <App/>
        </MemoryRouter>
      </Provider>
    )

    expect(AppTreeArticle.find(Article).length).toEqual(1)
  });

  it('renders ArticleForm according to path', () => {
      const AppTreeArticleNew = mount(
      <Provider store={createStore(reducers, initialState)}>
        <MemoryRouter initialEntries={["/articles/new"]} initialIndex={0}>
          <App/>
        </MemoryRouter>
      </Provider>
    )

    expect(AppTreeArticleNew.find(ArticleForm).length).toEqual(1)
  });
 })
