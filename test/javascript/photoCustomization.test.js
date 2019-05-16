import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'
import renderer from 'react-test-renderer';

import article from './__mocks__/fakeArticle'
import PhotoCustomization from '../../app/javascript/packs/articleForm/photoForm/photoCustomization'
import PhotoForm from '../../app/javascript/packs/articleForm/photoForm'

const photo = article.photos[0]

configure({ adapter: new Adapter() });

jest.mock('../../app/javascript/utils/ajaxHelpers')

describe('PhotoCustomization tests', () => {

  it('renders component', () => {
    const PhotoCustomizationTree = renderer
      .create(<PhotoCustomization photo={photo} crop={{ height:0, width:0 }}/>)
      .toJSON()
      expect(PhotoCustomizationTree).toMatchSnapshot();
  })

  let wrapper = mount( <PhotoForm photo={photo} mapCustomizationOnGoing={false}/>)

  it('reveals PhotoCustomization overlay on click', () => {
    wrapper.instance().activeCustomization()
    wrapper.update()

    expect(wrapper.find(".photoCustomization.active").length).toEqual(1)
  })

  it('updates photo title on change', () => {
    wrapper.find(".photoCustomization .photoCustomizationBlock").at(1).find("input").simulate(
      'change',
      { target: { value: 'my title' }}
    )
    wrapper.update()

    expect(wrapper.find(".photoCustomization .photoCustomizationBlock input[value='my title']").length).toEqual(1)
  })

  it('saves photo title on change', async () => {
    await wrapper.find(".photoCustomization .photoCustomizationBlock").at(1).find("button").simulate('click')
    wrapper.update()

    expect(wrapper.state().photo.original_filename).toEqual('my title')
  })

  it('changes title display on click', async () => {
    await wrapper.find(".photoCustomization .photoCustomizationBlock #radio-true").simulate('change', { target: { value: "true" }})
    wrapper.update()

    expect(wrapper.find(".photoCustomization .photoCustomizationBlock #radio-true[checked=true]").length)
    .toEqual(1)
  })

  it('crops image on click', async () => {
    wrapper.instance().onCropChange({ x: 10, y: 10, width: 100, height: 100})
    wrapper.update()
    wrapper.instance().activeCustomization()
    wrapper.update()
    wrapper.instance().photoRef = { current: { componentRef: { clientWidth: 1000, clientHeight: 700 }}}
    await wrapper.find("button.photoCustomizationBlock").simulate('click')
    wrapper.update()

    expect(wrapper.state().photo.cropped_url).toContain( "c_crop,h_381,w_400,x_40,y_38" )
  })

  it('cancels crop on click', async () => {
    await wrapper.find("button.photoCustomizationBlock").simulate('click')
    wrapper.update()

    expect(wrapper.state().photo.cropped_url).toEqual(false)
    expect(wrapper.state().photo.width).toEqual(0)
    expect(wrapper.state().photo.height).toEqual(0)
  })

})
