import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Article from '../../app/javascript/packs/article'
import toJson from 'enzyme-to-json';

configure({ adapter: new Adapter() });

jest.mock('../../app/javascript/utils/ajaxHelpers')

describe('Article test Suite', () => {
  it('renders component', async () => {
    const ArticleTree = mount(<Article match={{ params: { id: 1}}}/>)
    ArticleTree.instance().createTextContentsHTML = jest.fn((textContents) => {
      return textContents.map(x => x.text).reduce((x, acc) => x + acc)
    })
    ArticleTree.update()
    await ArticleTree.instance().componentDidMount()
    ArticleTree.update()

    expect(toJson(ArticleTree)).toMatchSnapshot()
  })

})
