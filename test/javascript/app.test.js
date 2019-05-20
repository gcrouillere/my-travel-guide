import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import { MemoryRouter } from 'react-router'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import App from '../../app/javascript/packs/app';
import Article from '../../app/javascript/packs/article';
import ArticleForm from '../../app/javascript/packs/articleForm';

configure({ adapter: new Adapter() });

 describe('App test suite', () => {
  it('renders App without crashing', () => {
    const AppTree = renderer.create(<Router><App/></Router>).toJSON()
    expect(AppTree).toMatchSnapshot()
  });

  it('renders Article according to path', () => {
    const AppTreeArticle = mount(
      <MemoryRouter initialEntries={["/articles/4"]} initialIndex={0} >
        <App/>
      </MemoryRouter>)
    expect(AppTreeArticle.find(Article).length).toEqual(1)
  });

  it('renders ArticleForm according to path', () => {
    const AppTreeArticleNew = mount(
      <MemoryRouter initialEntries={["/articles/new"]} initialIndex={0}>
        <App/>
      </MemoryRouter>)
    expect(AppTreeArticleNew.find(ArticleForm).length).toEqual(1)
  });
 })
