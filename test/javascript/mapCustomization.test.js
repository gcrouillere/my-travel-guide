import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'
import renderer from 'react-test-renderer';

import article from './__mocks__/fakeArticle'
import MapCustomization from '../../app/javascript/packs/articleForm/mapForm/mapCustomization'
import MapForm from '../../app/javascript/packs/articleForm/mapForm'

const map = article.maps[0]

configure({ adapter: new Adapter() });

jest.mock('../../app/javascript/utils/ajaxHelpers')

describe('MapComponent tests', () => {

  it('renders component', () => {
    const mapCustomizationTree = renderer
      .create(<MapCustomization map={map} customizationOnGoing={false}/>)
      .toJSON()
      expect(mapCustomizationTree).toMatchSnapshot();
  })

  let preventDraggingOnOtherElements = jest.fn()

  let wrapper = mount(
    <MapForm map={map} preventDraggingOnOtherElements={preventDraggingOnOtherElements}>
      <MapCustomization map={map} customizationOnGoing={false}/>
    </MapForm>
    )

  it('reveals mapCustomization overlay on click', () => {
    wrapper.find(".tuneLogo").simulate('mousedown')
    wrapper.update()
    expect(wrapper.find(".mapCustomization.active").length).toEqual(1)
  })

  it('hides mapCenter on click', async () => {
    await wrapper.find("#radio-false.mapCenterShowinput").simulate('change', { target: { value: "false" }})
    wrapper.update()

    expect(wrapper.find("#radio-false.mapCenterShowinput[checked=true]").length).toEqual(1)
  })

  it('initiates marker creation on click', () => {
    wrapper.find(".mapCustomizationBlock.startPath").at(0).simulate('click')
    wrapper.update()

    expect(wrapper.find(".mapCustomizationBlock.startPath[disabled=true]").length).toEqual(3)
    expect(wrapper.find(".mapCustomizationBlock.finishPath").text()).toEqual(expect.stringContaining("Click on Map to place Marker"))
    expect(wrapper.find(".mapCustomizationBlock.finishPath .actionCancelInfo").text()).toEqual("Click button again to cancel action")
    expect(wrapper.find(".mapCustomization .close").length).toEqual(0)
  })

  it('adds a marker on map', async () => {
    let event = { latLng: {
      lat: jest.fn().mockImplementation(x => { return 2 }),
      lng: jest.fn().mockImplementation(x => { return 2 })
    }}

    await wrapper.find(MapCustomization).instance().addMarker(event, 'click')
    wrapper.update()
    expect(wrapper.find("Marker").length).toEqual(2)
  })

  it('initiates polyline creation on click', async () => {
    await wrapper.find(".mapCustomizationBlock.startPath").at(1).simulate('click')
    wrapper.update()

    expect(wrapper.find(".mapCustomizationBlock.startPath[disabled=true]").length).toEqual(3)
    expect(wrapper.find(".mapCustomizationBlock.finishPath").text()).toEqual(expect.stringContaining("Click on Map to draw Path"))
    expect(wrapper.find(".mapCustomizationBlock.finishPath .actionCancelInfo").text()).toEqual("Click button again to cancel action")
    expect(wrapper.find(".mapCustomization .close").length).toEqual(0)
  })

  it('creates a polyine with a point on click', async () => {
    await wrapper.find(".mapCustomizationBlock.startPath").at(1).simulate('click')
    wrapper.update()
    let event  = { latLng: { lat: jest.fn(), lng: jest.fn() }}
    let polyline = new google.maps.Polyline
    wrapper.find(MapCustomization).setState({polyline: {id: 1}})
    await wrapper.find(MapCustomization).instance().addPolylinePoint(event, polyline)
    wrapper.update()

    expect(wrapper.find(".mapCustomizationBlock.finishPath").text()).toEqual("Finish Path")
  })

  it('uploads map with polyline on completion click', async () => {
    await wrapper.find(".mapCustomizationBlock.finishPath").simulate('click')
    wrapper.update()

    expect(wrapper.find("Polyline").length).toEqual(2)
  })

  it('hides mapCustomization overlay on click', () => {
    wrapper.find(".mapCustomization .close").simulate('click')
    wrapper.update()
    expect(wrapper.find(".mapCustomization.active").length).toEqual(0)
  })

})
