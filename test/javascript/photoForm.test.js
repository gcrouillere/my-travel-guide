import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'
import renderer from 'react-test-renderer';

import PhotoForm from '../../app/javascript/packs/articleForm/photoForm'
import article from './__mocks__/fakeArticle'

jest.mock('../../app/javascript/utils/ajaxHelpers')
jest.mock('react-image-crop', () => { return "img" })

const photo = article.photos[0]

configure({ adapter: new Adapter() });

describe('PhotoForm test suite', () => {

  it('renders component', () => {
    const PhotoFormTreePhoto = renderer
      .create(
        <PhotoForm photo={photo} dragging={false} articleId={article.id} position={photo.position}
        id={photo.id} mapCustomizationOnGoing={false}/>)
      .toJSON()
    expect(PhotoFormTreePhoto).toMatchSnapshot();
  })

  let wrapper = mount(<PhotoForm photo={photo} dragging={false} articleId={article.id} position={photo.position}
        id={photo.id} mapCustomizationOnGoing={false}/>)

  it('initiates photo resizes on function call', () => {
    wrapper.instance().photoContentRef = { current: { clientWidth: 900 }}
    wrapper.instance().initResize({ screenX: 450 })

    expect(wrapper.state().resizeOrigin).toEqual(450)
    expect(wrapper.state().initialPhotoWidth).toEqual(80)
    expect(wrapper.state().maxWidth).toEqual(900)
  })

  it('resizes photo on function call', () => {
    wrapper.instance().resizeOnMove({ screenX: 460 })

    expect(wrapper.state().photo.css_width).toBeCloseTo(81.111)
  })

  it('updates photo on resize stop', async () => {
    await wrapper.instance().stopResizing()

    expect(wrapper.state().photo.css_width).toBeCloseTo(81.111)
  })

  it('displays photo customization on click and strore crop', () => {
    wrapper.instance().onCropChange({ x: 10, y: 10 })
    wrapper.update()

    expect(wrapper.find(".photoCustomization.active").length).toEqual(1)
    expect(wrapper.state().crop.x).toEqual(10)
  })

})
