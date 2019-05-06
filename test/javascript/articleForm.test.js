import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'

import ArticleForm from '../../app/javascript/packs/articleForm'
import ContentMenu from '../../app/javascript/packs/articleForm/contentMenu'
import TextContentForm from '../../app/javascript/packs/articleForm/textContentForm'
import MapForm from '../../app/javascript/packs/articleForm/mapForm'
import PhotoForm from '../../app/javascript/packs/articleForm/photoForm'
import fakeArticle from './__mocks__/fakeArticle'
import fakeArticleFedWithText from './__mocks__/fakeArticleFedWithText'

configure({ adapter: new Adapter() });

const match = {params: {}}
let wrapper = shallow(<ArticleForm match={match}/>);

describe('Render Article Form without content', () => {

  it('renders a blank article form without crashing', () => {
    expect(wrapper.find('header.maintTitle').length).toEqual(0)
  });

  it('renders title input', () => {
    wrapper.setState({audienceForm: true})
    expect(wrapper.find('header.maintTitle.incomplete').length).toEqual(1)
    expect(wrapper.find('.articleContent').length).toEqual(0)
  });

  it('renders article form when input is valid', () => {
    wrapper.find('.maintTitle input').simulate('change', { "target": { "value": "10 characters long article title" } })
    wrapper.update()
    expect(wrapper.find('.articleContent').length).toEqual(1)
    expect(wrapper.find('.maintTitle input').props().value).toEqual("10 characters long article title")
  });

})

describe('Render Article Form with content', () => {

  let articleElements = wrapper.instance().orderArticleElements(fakeArticle)

  it('renders an article with text, map and photo in proper order', () => {
    wrapper.setState({articleElements: articleElements, titleValid: true})
    wrapper.update()
    expect(wrapper.find(TextContentForm).length + wrapper.find(MapForm).length + wrapper.find(PhotoForm).length).toEqual(3)
    expect(wrapper.find(TextContentForm).prop('position')).toEqual(0)
    expect(wrapper.find(MapForm).prop('position')).toEqual(1)
    expect(wrapper.find(PhotoForm).prop('position')).toEqual(2)
  });

  it('returns correct position after click on text bloc addition', () => {
    wrapper.setState({initialPosition: -1})
    let finalPositionAtCreation = wrapper.instance().definePositionAtCreation(undefined)
    expect(finalPositionAtCreation).toEqual(3)
  })

  it('updates article content with appropriate positions', () => {
    wrapper.instance().updateElementsState(fakeArticleFedWithText)
    wrapper.update()
    expect(wrapper.find(TextContentForm).at(1).prop('position')).toEqual(3)
  })
})
