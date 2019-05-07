import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'
import PhotoInitialFileOverlay from '../../app/javascript/packs/articleForm/contentMenu/photoInitialFileOverlay'
import photoHelpers from '../../app/javascript/utils/photoHelpers'

jest.mock('../../app/javascript/utils/photoHelpers')

configure({ adapter: new Adapter() });

describe('PhotoInitialFileOverlay test suite', () => {

  let abandonPhotoCreation, printLocation, addNewPhotoBloc
  abandonPhotoCreation = printLocation = addNewPhotoBloc = jest.fn()

  const wrapper = mount(<PhotoInitialFileOverlay abandonPhotoCreation={abandonPhotoCreation} printLocation={printLocation}
    addNewPhotoBloc={addNewPhotoBloc} />)

  it('renders overlay', () => {
    expect(wrapper.find(".photoInitialFileOverlay #fileupload").length).toEqual(1)
    expect(wrapper.find(".photoInitialFileOverlay .custom-file-label").length).toEqual(1)
    expect(wrapper.find(".mapInitialCenterOverlay .progress").length).toEqual(0)
  })

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
