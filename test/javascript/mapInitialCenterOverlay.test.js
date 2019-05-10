import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'
import renderer from 'react-test-renderer';

import MapInitialCenterOverlay from '../../app/javascript/packs/articleForm/contentMenu/mapInitialCenterOverlay'

configure({ adapter: new Adapter() });

describe('MapInitialCenterOverlay test suite', () => {

  let abandonMapCreation, printLocation
  abandonMapCreation = printLocation = jest.fn()

  const mapInitialCenterOverlayTree = renderer
    .create(<MapInitialCenterOverlay abandonMapCreation={abandonMapCreation} printLocation={printLocation}/>)
    .toJSON()
  expect(mapInitialCenterOverlayTree).toMatchSnapshot();

  const wrapper = mount(<MapInitialCenterOverlay abandonMapCreation={abandonMapCreation} printLocation={printLocation}/>)

  it('passes location to upper component', () => {
    wrapper.find("#initialMapLocation").simulate('change', {target: {value: "foo"}})
    expect(printLocation).toHaveBeenCalled()
  })

  it('passes overlay closing to upper component', () => {
    wrapper.find(".close").simulate('click')
    expect(abandonMapCreation).toHaveBeenCalled()
  })

})
