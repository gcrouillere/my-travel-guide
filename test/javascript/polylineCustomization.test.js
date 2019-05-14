import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'
import renderer from 'react-test-renderer';

import article from './__mocks__/fakeArticle'
import PolylineCustomization from '../../app/javascript/packs/articleForm/mapForm/polylineCustomization'
import MapComponent from '../../app/javascript/packs/articleForm/mapForm/mapComponent'
import Polyline from '../../app/javascript/packs/articleForm/mapForm/mapComponent/polyline'
import MapForm from '../../app/javascript/packs/articleForm/mapForm'

const map = article.maps[0]

const polyline = map.polylines[0]

configure({ adapter: new Adapter() });

jest.mock('../../app/javascript/utils/ajaxHelpers')

describe('PolylineCustomization tests', () => {

  it('renders component', () => {
    const PolylineCustomizationTree = renderer
      .create(<PolylineCustomization map={map} customizationOnGoing={false}/>)
      .toJSON()
      expect(PolylineCustomizationTree).toMatchSnapshot();
  })

  let preventDraggingOnOtherElements = jest.fn()

  let wrapper = mount(
    <MapForm map={map} preventDraggingOnOtherElements={preventDraggingOnOtherElements}>
      <PolylineCustomization map={map} customizationOnGoing={false}/>
    </MapForm>
    )

  it('reveals PolylineCustomization overlay on click', () => {
    wrapper.find(PolylineCustomization).instance().initPolylineCustomization({}, {}, polyline, {})
    wrapper.update()

    expect(wrapper.find(Polyline).length).toEqual(1)
    expect(wrapper.find(".polylineCustomization.active").length).toEqual(1)
  })

  it('displays distance on click', async () => {
    await wrapper.find(".polylineCustomization #radio-true").simulate('change')
    wrapper.update()

    expect(wrapper.find(Polyline).at(0).state().polyline.distance_displayed).toEqual(true)
  })

  it('adds a point on function call', async () => {
    let event = { latLng: {
      lat: jest.fn().mockImplementation(x => { return 2 }),
      lng: jest.fn().mockImplementation(x => { return 2 })
    }}
    let googlePolyline = new google.maps.Polyline
    wrapper.find(PolylineCustomization).setState({polyline: {id: 1}})
    await wrapper.find(PolylineCustomization).instance().continuePath(event, googlePolyline)

    expect(wrapper.find(PolylineCustomization).state().polylineMarkers.length).toEqual(3)
  })

  it('deletes a marker on function call', async () => {
    await wrapper.find(PolylineCustomization).instance().deletePointFromPath()

    expect(wrapper.find(PolylineCustomization).state().polylineMarkers.length).toEqual(2)
  })

  it('deletes polyline on function call', async () => {
    await wrapper.find(PolylineCustomization).instance().deletePolyline()

    expect(wrapper.find(MapComponent).state().polylines.length).toEqual(0)
  })
})
