import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'
import renderer from 'react-test-renderer';

import article from './__mocks__/fakeArticle'
import Marker from '../../app/javascript/packs/articleForm/mapForm/mapComponent/marker'
import MapComponent from '../../app/javascript/packs/articleForm/mapForm/mapComponent'

const map = article.maps[0]

const marker = map.markers[0]

configure({ adapter: new Adapter() });

jest.mock('../../app/javascript/utils/ajaxHelpers')

describe('Marker tests', () => {

  let preventDraggingOnOtherElements = jest.fn()

  let setGoogleMap, manageMarker

  manageMarker = setGoogleMap = jest.fn()

  let wrapper = shallow(<Marker map={map} manageMarker={manageMarker} customizationOnGoing={false}/>)

  it('passes marker to parent component on click', () => {
    wrapper.instance().manageMarker()

    expect(manageMarker).toHaveBeenCalled()
  })

  let wrapper2 = mount(
    <MapComponent map={map} setGoogleMap={setGoogleMap}>
      <Marker map={map} manageMarker={manageMarker} customizationOnGoing={false}/>
    </MapComponent>
  )

  it('updates marke position on drag', async () => {
    let event = { latLng: {
      lat: jest.fn().mockImplementation(() => {return 2}),
      lng: jest.fn().mockImplementation(() => {return 2})
    }}
    await wrapper2.find(Marker).at(0).instance().updateMarkerPosition(event, marker)

    expect(wrapper2.state().markers[0].lat + wrapper2.state().markers[0].lng).toEqual(138)
  })

})
