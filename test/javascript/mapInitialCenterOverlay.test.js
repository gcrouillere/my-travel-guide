import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'

import MapInitialCenterOverlay from '../../app/javascript/packs/articleForm/contentMenu/mapInitialCenterOverlay'

configure({ adapter: new Adapter() });

describe('MapInitialCenterOverlay test suite', () => {

  let abandonMapCreation, printLocation
  abandonMapCreation = printLocation = jest.fn()

  const wrapper = mount(<MapInitialCenterOverlay abandonMapCreation={abandonMapCreation} printLocation={printLocation}/>)

  it('renders overlay', () => {
    expect(wrapper.find(".mapInitialCenterOverlay #initialMapLocation").length).toEqual(1)
    expect(wrapper.find(".mapInitialCenterOverlay .mapOverlayTitle").length).toEqual(1)
    expect(wrapper.find(".mapInitialCenterOverlay .mapOverlaydescription").length).toEqual(1)
  })

  it('passes location to upper component', () => {
    wrapper.find("#initialMapLocation").simulate('change', {target: {value: "foo"}})
    expect(printLocation).toHaveBeenCalled()
  })

  it('passes overlay closing to upper component', () => {
    wrapper.find(".close").simulate('click')
    expect(abandonMapCreation).toHaveBeenCalled()
  })

})
