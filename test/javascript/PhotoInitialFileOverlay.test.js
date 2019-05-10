import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'
import renderer from 'react-test-renderer';

import PhotoInitialFileOverlay from '../../app/javascript/packs/articleForm/contentMenu/photoInitialFileOverlay'
import photoHelpers from '../../app/javascript/utils/photoHelpers'

jest.mock('../../app/javascript/utils/photoHelpers')

configure({ adapter: new Adapter() });

describe('PhotoInitialFileOverlay test suite', () => {

  let abandonPhotoCreation, printLocation, addNewPhotoBloc
  abandonPhotoCreation = printLocation = addNewPhotoBloc = jest.fn()

  const photoInitialFileOverlayTree = renderer
    .create(<PhotoInitialFileOverlay abandonPhotoCreation={abandonPhotoCreation}
      printLocation={printLocation} addNewPhotoBloc={addNewPhotoBloc} />)
    .toJSON()
  expect(photoInitialFileOverlayTree).toMatchSnapshot();

  const wrapper = mount(<PhotoInitialFileOverlay abandonPhotoCreation={abandonPhotoCreation} printLocation={printLocation}
    addNewPhotoBloc={addNewPhotoBloc} />)

  it('loads a photo on input change', async () => {
    const photo = photoHelpers.photo
    await wrapper.instance().onPhotoSelected({ target: { files: [{name: "my photo"}] }})

    expect(addNewPhotoBloc).toHaveBeenCalledWith(photo)
    expect(abandonPhotoCreation).toHaveBeenCalled()
    expect(wrapper.state('progress')).toEqual(0)
    expect(wrapper.state('fileName')).toEqual(null)
  })

  it('builds a formData on function call', () => {
    const formData = wrapper.instance().buildFormData({ target: { files: [{name: "my photo"}] }})
    expect(formData).toEqual({
      file: { name: 'my photo' },
      upload_preset: expect.anything(),
      tags: 'mytravelguide,my photo',
      context: 'photo=my photo'
    })
    expect(wrapper.state('fileName')).toEqual('my photo')
    expect(wrapper.find(".custom-file-label").text()).toEqual('my photo')
  })

  it('passes overlay closing to upper component', () => {
    wrapper.find(".close").simulate('click')
    expect(abandonPhotoCreation).toHaveBeenCalled()
  })

})
