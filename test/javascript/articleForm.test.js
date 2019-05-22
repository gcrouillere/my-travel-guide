import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'
import renderer from 'react-test-renderer';

import ArticleForm from '../../app/javascript/packs/articleForm'
import ContentMenu from '../../app/javascript/packs/articleForm/contentMenu'
import TextContentForm from '../../app/javascript/packs/articleForm/textContentForm'
import MapForm from '../../app/javascript/packs/articleForm/mapForm'
import PhotoForm from '../../app/javascript/packs/articleForm/photoForm'
import fakeArticle from './__mocks__/fakeArticle'
import fakeArticleFedWithText from './__mocks__/fakeArticleFedWithText'

configure({ adapter: new Adapter() });

jest.mock('../../app/javascript/utils/ajaxHelpers')
jest.mock('react-quill', () => { return "textarea" })

const ajaxHelpers = require('../../app/javascript/utils/ajaxHelpers')

describe('Article Form without content', () => {

  const match = {params: {}}

  it('renders a blank article form without crashing', () => {
    const articleFormTree = renderer
      .create(<ArticleForm match={match} history={[]}/>)
      .toJSON()
    expect(articleFormTree).toMatchSnapshot();
  });

  let wrapper = shallow(<ArticleForm match={match} history={[]}/>);

  it('renders title input', () => {
    wrapper.setState({audienceForm: true})

    expect(wrapper.find('header.maintTitle.incomplete').length).toEqual(1)
    expect(wrapper.find('.articleContent').length).toEqual(0)
  });

  it('renders article form when input is valid', () => {
    wrapper.find('.maintTitle input').simulate('change', { "target": { "value": "10 characters long article title" } })
    wrapper.update()

    expect(wrapper.find('.articleContent').length).toEqual(1)
    expect(wrapper.find(".maintTitle input[value='10 characters long article title']").length).toEqual(1)
  });

  it('saves title on blur', () => {
    wrapper.find('.maintTitle input').simulate('blur')
    expect(ajaxHelpers.ajaxCall).toHaveBeenCalled()
  })

})

describe('Article Form with content', () => {

    const match = {params: {id: 1}}
    let wrapper2 = shallow(<ArticleForm match={match}/>);
    wrapper2.setState({audienceForm: true})

  it('renders an article with text, map and photo in proper order', async () => {
    await wrapper2.instance().componentDidMount()
    wrapper2.update()

    expect(wrapper2.find(TextContentForm).length + wrapper2.find(MapForm).length + wrapper2.find(PhotoForm).length).toEqual(3)
    expect(wrapper2.find(TextContentForm).prop('position')).toEqual(0)
    expect(wrapper2.find(MapForm).prop('position')).toEqual(1)
    expect(wrapper2.find(PhotoForm).prop('position')).toEqual(2)
  });
})

describe('Article content updates', () => {

  const match = {params: {id: 1}}
  let wrapper3 = mount(<ArticleForm match={match}/>);

  it('adds textContent on last position on click', async () => {
    await wrapper3.instance().componentDidMount()
    wrapper3.setState({audienceForm: true})
    wrapper3.update()

    await wrapper3.find(".blocAddition.text .addNew").simulate('click')
    await wrapper3.update()

    expect(wrapper3.state().articleElements[3].class_name).toEqual("TextContent")
  })

  it('set proper state on dragstart', async () => {
    await wrapper3.update()
    await wrapper3.find("#content-2").simulate('dragstart', { dataTransfer: new DataTransfer })

    expect(wrapper3.state().initialPosition).toEqual(2)
    expect(wrapper3.state().previousHoveredElementPosition).toEqual(2)
    expect(wrapper3.state().draggingElement).toEqual(2)
    expect(wrapper3.state().dragging).toEqual(true)
    expect(wrapper3.state().activeDragImage).toEqual(true)
    expect(wrapper3.state().dragContent.class_name).toEqual("Photo")
    expect(wrapper3.find("#dragImage p").text()).toEqual("Image : artificial-background-blue-1282170")
  })

  it('set proper drop zones on dragstart', () => {
    wrapper3.setState({previousHoveredElementPosition: 0})
    wrapper3.find("#content-0").simulate('dragenter')
    wrapper3.update()

    expect(wrapper3.find("#content-0 .dropZone-before.drop-before.active").length).toEqual(1)

    wrapper3.find("#content-3").simulate('dragenter')
    wrapper3.update()
    wrapper3.find("#content-3").simulate('dragenter')
    wrapper3.update()
    expect(wrapper3.find("#content-3 .dropZone-after.drop-after.active").length).toEqual(1)
  })

  it('updates element position on drop', async () => {
    let dataTransfer = new DataTransfer()
    dataTransfer.setData("type", "positionUpdate")

    await wrapper3.find("#content-3").simulate('drop', { dataTransfer: dataTransfer})
    wrapper3.update()
    expect(ajaxHelpers.ajaxCall.mock.calls[ajaxHelpers.ajaxCall.mock.calls.length - 1]).toEqual([
      "POST",
      "/articles/element_position_update/",
      {"article": 1, "positions": {"init": {"id": 1, "position": 2}, "target": {"id": 1, "position": 3}}},
      undefined
    ])
  })

  it('add new component on drag', async () => {
    let dataTransfer = new DataTransfer()
    dataTransfer.setData("type", "textCreation")

    wrapper3.find(".blocAddition.text .addNew").simulate('dragstart', { dataTransfer: dataTransfer})
    wrapper3.update()
    await wrapper3.find("#content-1").simulate('drop', { dataTransfer: dataTransfer})
    wrapper3.update()

    expect(ajaxHelpers.ajaxCall.mock.calls[ajaxHelpers.ajaxCall.mock.calls.length - 1]).toEqual([
      "POST",
      "/articles/element_position_update/",
      {"article": 1, "positions": {"init": {"id": 1, "position": -1}, "target": {"id": 1, "position": 2}}},
      undefined
    ])
  })

})
