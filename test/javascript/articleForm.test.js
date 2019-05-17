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

// describe('Article Form without content', () => {

//   const match = {params: {}}

//   it('renders a blank article form without crashing', () => {
//     const articleFormTree = renderer
//       .create(<ArticleForm match={match} history={[]}/>)
//       .toJSON()
//     expect(articleFormTree).toMatchSnapshot();
//   });

//   let wrapper = shallow(<ArticleForm match={match} history={[]}/>);

//   it('renders title input', () => {
//     wrapper.setState({audienceForm: true})

//     expect(wrapper.find('header.maintTitle.incomplete').length).toEqual(1)
//     expect(wrapper.find('.articleContent').length).toEqual(0)
//   });

//   it('renders article form when input is valid', () => {
//     wrapper.find('.maintTitle input').simulate('change', { "target": { "value": "10 characters long article title" } })
//     wrapper.update()

//     expect(wrapper.find('.articleContent').length).toEqual(1)
//     expect(wrapper.find(".maintTitle input[value='10 characters long article title']").length).toEqual(1)
//   });

//   it('saves title on blur', () => {
//     wrapper.find('.maintTitle input').simulate('blur')
//     expect(ajaxHelpers.ajaxCall).toHaveBeenCalled()
//   })

// })

// describe('Article Form with content', () => {

//     const match = {params: {id: 1}}
//     let wrapper2 = shallow(<ArticleForm match={match}/>);
//     wrapper2.setState({audienceForm: true})

//   it('renders an article with text, map and photo in proper order', async () => {
//     await wrapper2.instance().componentDidMount()
//     wrapper2.update()

//     expect(wrapper2.find(TextContentForm).length + wrapper2.find(MapForm).length + wrapper2.find(PhotoForm).length).toEqual(3)
//     expect(wrapper2.find(TextContentForm).prop('position')).toEqual(0)
//     expect(wrapper2.find(MapForm).prop('position')).toEqual(1)
//     expect(wrapper2.find(PhotoForm).prop('position')).toEqual(2)
//   });

//   it('returns correct position after click on text bloc addition', () => {
//     wrapper2.setState({initialPosition: -1})
//     let finalPositionAtCreation = wrapper2.instance().definePositionAtCreation(undefined)
//     expect(finalPositionAtCreation).toEqual(3)
//   })

//   // it('updates article content with appropriate positions', () => {
//   //   wrapper.instance().updateElementsState(fakeArticleFedWithText)
//   //   wrapper.update()
//   //   expect(wrapper.find(TextContentForm).at(1).prop('position')).toEqual(3)
//   // })
// })

describe('Article content updates', () => {

    const match = {params: {id: 1}}
    let wrapper3 = mount(<ArticleForm match={match}/>);

  it('adds textContent on click', async () => {
    await wrapper3.instance().componentDidMount()
    wrapper3.setState({audienceForm: true})
    wrapper3.update()

    await wrapper3.find(".blocAddition.text .addNew").simulate('click')
    wrapper3.update()
    console.log(wrapper3.state())
  })
})
