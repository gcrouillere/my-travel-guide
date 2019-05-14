import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'
import renderer from 'react-test-renderer';

import article from './__mocks__/fakeArticle'
import MarkerCustomization from '../../app/javascript/packs/articleForm/mapForm/markerCustomization'
import MapComponent from '../../app/javascript/packs/articleForm/mapForm/mapComponent'
import Marker from '../../app/javascript/packs/articleForm/mapForm/mapComponent/marker'
import MapForm from '../../app/javascript/packs/articleForm/mapForm'

const map = article.maps[0]

const marker = map.markers[0]

configure({ adapter: new Adapter() });

jest.mock('../../app/javascript/utils/ajaxHelpers')

describe('MarkerCustomization tests', () => {

  it('renders component', () => {
    const markerCustomizationTree = renderer
      .create(<MarkerCustomization map={map} customizationOnGoing={false}/>)
      .toJSON()
      expect(markerCustomizationTree).toMatchSnapshot();
  })

  let preventDraggingOnOtherElements = jest.fn()

  let wrapper = mount(
    <MapForm map={map} preventDraggingOnOtherElements={preventDraggingOnOtherElements}>
      <MarkerCustomization map={map} customizationOnGoing={false}/>
    </MapForm>
    )

  it('reveals markerCustomization overlay on click', () => {
    wrapper.find(MarkerCustomization).instance().initMarkerCustomization({}, new google.maps.Marker, marker)
    wrapper.update()

    expect(wrapper.find(Marker).length).toEqual(2)
    expect(wrapper.find(".markerCustomization.active").length).toEqual(1)
    expect(wrapper.find(".markerCustomization .form-check.form-check-inline input[type='radio']").length).toEqual(10)
  })

  it('updates markers description on change', () => {
    wrapper.find(".markerCustomization textarea").simulate('change', {target: {value: "my description"}})
    wrapper.update()

    expect(wrapper.find(".markerCustomization textarea").text()).toEqual("my description")
  })

  it('saves description on click', async () => {
    await wrapper.find(".markerCustomization .mapCustomizationBlock").at(0).find(".btn").simulate('click')
    wrapper.update()

    expect(wrapper.find(MapComponent).state().markers[0].description).toEqual("my description")
  })

  it('changes logo on click', async () => {
    wrapper.find(MarkerCustomization).instance().initMarkerCustomization({}, new google.maps.Marker, marker)
    wrapper.update()
    await wrapper.find("#radio-restaurantLogo").simulate('change')
    wrapper.update()

    expect(wrapper.find(MapComponent).state().markers[0].logo).toEqual("restaurantLogo")
  })

  it('changes logo on click', async () => {
    wrapper.find(MarkerCustomization).instance().initMarkerCustomization({}, new google.maps.Marker, marker)
    wrapper.update()
    await wrapper.find(".markerCustomization button.mapCustomizationBlock").simulate('click')
    wrapper.update()

    expect(wrapper.find(Marker).length).toEqual(1)
  })

})
