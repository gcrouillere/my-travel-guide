import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'

import ContentMenu from '../../app/javascript/packs/articleForm/contentMenu'
import MapInitialCenterOverlay from '../../app/javascript/packs/articleForm/contentMenu/mapInitialCenterOverlay'
import PhotoInitialFileOverlay from '../../app/javascript/packs/articleForm/contentMenu/photoInitialFileOverlay'

configure({ adapter: new Adapter() });

describe('ContentMenu test suite', () => {
  let addNewTextContent, addNewMap, addNewPhotoBloc, addNewComponentOnDrag = jest.fn()
  addNewTextContent = addNewMap = addNewPhotoBloc = addNewComponentOnDrag = jest.fn()

  const wrapper = mount(<ContentMenu addNewTextContent={addNewTextContent}
    addNewPhotoBloc={addNewPhotoBloc} addNewMap={addNewMap} id={1} addNewComponentOnDrag={addNewComponentOnDrag}/>)

  it('displays Content Menu', () => {
    expect(wrapper.find('.buttons .blocAddition').length).toEqual(3)
    expect(wrapper.find('.expand').length).toEqual(1)
  })

  it('displays photo overlay on click', () => {
    wrapper.find('.buttons .photo .addNew').simulate('click')
    expect(wrapper.find(PhotoInitialFileOverlay).prop('photoOverlayActive')).toEqual(true)
  })

  it('passes photo addition to upper component', () => {
    wrapper.instance().addNewPhotoBloc()
    expect(addNewPhotoBloc).toHaveBeenCalled();
  })

  it('displays map overlay on click', () => {
    wrapper.find('.buttons .map .addNew').simulate('click')
    expect(wrapper.find(MapInitialCenterOverlay).prop('mapOverlayActive')).toEqual(true)
  })

  it('defines map characteristics before creation', () => {
    wrapper.instance().addNewMap("mapLocation", 2)
    expect(addNewMap).toHaveBeenCalledWith(1, {lat: 0, lng: 0}, "mapLocation", 2)
  })

  it('passes text bloc addition to upper component', () => {
    wrapper.find('.buttons .text .addNew').simulate('click')
    expect(addNewTextContent).toHaveBeenCalled();
    expect(wrapper.state.initPositionAtCreation).toEqual(undefined)
  })

  it('triggers proper component creation on drag', () => {
    wrapper.find(".buttons .map .addNew").simulate('dragstart')
    expect(addNewComponentOnDrag).toHaveBeenCalled();
    expect(addNewComponentOnDrag).toHaveBeenCalledWith(expect.anything(), "mapCreation");
  })

  it('sets overlay to inactive on function call', () => {
    wrapper.instance().abandonMapCreation()
    expect(wrapper.state('mapOverlayActive')).toEqual(false)
    wrapper.instance().abandonPhotoCreation()
    expect(wrapper.state('photoOverlayActive')).toEqual(false)
  })

  it('gets location from lower component', () => {
    let event = {target: {value: "foo"}}
    wrapper.instance().printLocation(event)
    expect(wrapper.state('location')).toEqual("foo")
  })
})

