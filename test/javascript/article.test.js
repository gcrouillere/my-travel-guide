import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom'
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Article } from '../../app/javascript/packs/article'
import toJson from 'enzyme-to-json';
import article from './__mocks__/fakeArticle'

configure({ adapter: new Adapter() });


jest.mock('../../app/javascript/utils/ajaxHelpers')

describe('Article test Suite', () => {
  it('renders component', async () => {
    const ArticleTree = mount(
      <Article match={{ params: { id: 1}}} currentArticle={article}/>
    )

    ArticleTree.instance().componentDidUpdate({article: {}})
    ArticleTree.update()

    expect(toJson(ArticleTree)).toMatchSnapshot()
  })

})
