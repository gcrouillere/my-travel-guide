import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'
import renderer from 'react-test-renderer';
import update from 'immutability-helper'

import article from './__mocks__/fakeArticle'
import MapComponent from '../../app/javascript/packs/articleForm/mapForm/mapComponent'
import ElementResize from '../../app/javascript/packs/articleForm/formElementManagement/ElementResize'
import MapLocationInput from '../../app/javascript/packs/articleForm/mapLocationInput'

configure({ adapter: new Adapter() });

jest.mock('../../app/javascript/utils/ajaxHelpers')

let setGoogleMap = jest.fn()

describe('MapComponent tests', () => {

  it('renders component', () => {
    const mapComponentTree = renderer
      .create(<MapComponent map={article.maps[0]} setGoogleMap={setGoogleMap}/>)
      .toJSON()
      expect(mapComponentTree).toMatchSnapshot();
  })

  let setMap, manageMarker,  managePolyline, managePolylinePoint

  setMap = manageMarker = managePolyline = managePolylinePoint = jest.fn()

  let wrapper = mount(
    <MapComponent map={article.maps[0]} setGoogleMap={setGoogleMap} setMap={setMap} manageMarker={manageMarker}
     managePolyline={managePolyline} managePolylinePoint={managePolylinePoint}>
      <ElementResize />
    </MapComponent>
    )

  it('initiates map height on click', () => {
    wrapper.find(".elementResize").simulate('mousedown', { screenY: 10 })
    expect(wrapper.state('resizeOrigin')).toEqual(10)
    expect(wrapper.state('initialMapHeight')).toEqual(250)
  })

  it('changes map height on mousemove', () => {
    wrapper.instance().resizeOnMove({ screenY: 100 })
    wrapper.update()
    expect(wrapper.state().map.height).toEqual(340)
  })

  it('stops resizing on function call', async () => {
    await  wrapper.instance().stopResizing()
    wrapper.update()

    expect(setMap).toHaveBeenCalled()
    expect(wrapper.state().map.height).toEqual(339)
    expect(wrapper.state('resizeOrigin')).toEqual(null)
    expect(wrapper.state('initialMapHeight')).toEqual(null)
  })

  it('changes zoom on function call', async () => {
     await wrapper.instance().handleZoom({}, new google.maps.Map)
     wrapper.update()

     expect(setMap).toHaveBeenCalled()
     expect(wrapper.state().map.zoom).toEqual(2)
  })

  it('handles map center on function call', async () => {
    await wrapper.instance().handleCenter({}, new google.maps.Map)
    wrapper.update()

    expect(setMap).toHaveBeenCalled()
    expect(wrapper.state().map.lat).toEqual(1)
    expect(wrapper.state().map.lng).toEqual(1)
  })

  it('updates data list as exepcted', () => {
    const data = article.maps[0].markers[0]
    const marker2 = update(data, {id: {$set: 1}})
    wrapper.instance().updateMapDataList(marker2, "markers", "add")
    expect(wrapper.state().markers.length).toEqual(2)
    expect(wrapper.state().markers[0]).toEqual(marker2)

    const marker3 = update(marker2, {lat: {$set: 1}})
    wrapper.instance().updateMapDataList(marker3, "markers", "change")
    expect(wrapper.state().markers.length).toEqual(2)
    expect(wrapper.state().markers[0]).toEqual(marker3)

    wrapper.instance().updateMapDataList(marker3, "markers", "delete")
    expect(wrapper.state().markers.length).toEqual(1)
    expect(wrapper.state().markers[0]).toEqual(data)
  })

  it('updates map on input change', async () => {
    await wrapper.instance().handleMap({name: "ma ville"})
    wrapper.update()
    expect(wrapper.state().map.name).toEqual("ma ville")

    await wrapper.instance().handleMap({show_map_center_as_marker: true})
    wrapper.update()
    expect(wrapper.state().map.show_map_center_as_marker).toEqual(true)
  })

  it('passes functions to parent component on call', () => {
    wrapper.instance().manageMarker()
    expect(manageMarker).toHaveBeenCalled()

    wrapper.instance().managePolyline()
    expect(managePolyline).toHaveBeenCalled()

    wrapper.instance().managePolylinePoint()
    expect(managePolylinePoint).toHaveBeenCalled()
  })
})

