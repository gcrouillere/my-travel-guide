import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import update from 'immutability-helper'

import ArticlesList from '../../app/javascript/packs/articlesList'
import article from './__mocks__/fakeArticle'
import ajaxHelpers from '../../app/javascript/utils/ajaxHelpers'

configure({ adapter: new Adapter() });

const articleslist = [article, update(article, {id: {$set: 1}})]

jest.mock('../../app/javascript/utils/ajaxHelpers', () => jest.fn())

ajaxHelpers.ajaxCall = jest.fn(() => { return Promise.resolve(articleslist) })

describe('ArticlesList test Suite', () => {

  it('renders component', async () => {
    const articlesListTree = mount(<Router><ArticlesList/></Router>)
    await articlesListTree.find(ArticlesList).instance().componentDidMount()
    articlesListTree.update()

    expect(toJson(articlesListTree)).toMatchSnapshot()
  })
})
