import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'
import renderer from 'react-test-renderer';

import article from './__mocks__/fakeArticle'
import Polyline from '../../app/javascript/packs/articleForm/mapForm/mapComponent/polyline'
import MapComponent from '../../app/javascript/packs/articleForm/mapForm/mapComponent'

const map = article.maps[0]

const polyline = map.polylines[0]

configure({ adapter: new Adapter() });

jest.mock('../../app/javascript/utils/ajaxHelpers')

describe('Polyline tests', () => {

  let setGoogleMap, managePolyline, managePolylinePoint

  managePolyline = setGoogleMap = managePolylinePoint = jest.fn()

  let wrapper = shallow(<Polyline map={map} polyline={polyline} managePolylinePoint={managePolylinePoint}
    managePolyline={managePolyline} customizationOnGoing={false}/>)

  it('loads Polyline', () => {
    expect(wrapper.state().polylineMarkers.length).toEqual(2)
  })

  it('passes polyline to parent component', () => {
    wrapper.instance().managePolyline()
    expect(managePolyline).toHaveBeenCalled

    wrapper.instance().managePolylinePoint()
    expect(managePolylinePoint).toHaveBeenCalled
  })

  let wrapper2 = mount(
    <MapComponent map={map} setGoogleMap={setGoogleMap}>
      <Polyline map={map} polyline={polyline} managePolyline={managePolyline} customizationOnGoing={false}/>
    </MapComponent>
  )

  it('updates polyline point position on drag', async () => {
    let event = { latLng: {
      lat: jest.fn().mockImplementation(() => { return 2 }),
      lng: jest.fn().mockImplementation(() => { return 2 })
    }}
    let googleMarker = {appMarker: {id: 1}, markerIndex: 0}
    await wrapper2.find(Polyline).instance().updatePolylinePoint(event, googleMarker)

    expect(
      wrapper2.find(Polyline).state().polylineMarkers[0].lat +
      wrapper2.find(Polyline).state().polylineMarkers[0].lng)
    .toEqual(138)
  })

})
