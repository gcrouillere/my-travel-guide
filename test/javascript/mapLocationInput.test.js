import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'
import renderer from 'react-test-renderer';

import MapLocationInput from '../../app/javascript/packs/articleForm/MapLocationInput'
import MapComponent from '../../app/javascript/packs/articleForm/mapForm/mapComponent'
import article from './__mocks__/fakeArticle'

const map = article.maps[0]

jest.mock('../../app/javascript/utils/ajaxHelpers')

configure({ adapter: new Adapter() });

describe('MapLocationInput test suite', () => {

  it('renders component with a photo', () => {
    const MapLocationInputTree = renderer
      .create(<MapLocationInput />)
      .toJSON()
    expect(MapLocationInputTree).toMatchSnapshot();
  })

  let wrapper = shallow(<MapLocationInput id={1}/>)

  it('updates location on input change', () => {
    wrapper.find("#mapLocation1").simulate("change", {target: {value: "new location"}})
    expect(wrapper.find("#mapLocation1[value='new location']").length).toEqual(1)
  })

  let setGoogleMap, setMap
  setGoogleMap = setMap = jest.fn()

  let wrapper2 = mount(<MapComponent setGoogleMap={setGoogleMap} setMap={setMap} map={map}><MapLocationInput/></MapComponent>)

  it('updates location on place select', async () => {
    await wrapper2.find("MapLocationInput").instance().handleAutoComplete("my adress")
    wrapper2.update()

    expect(wrapper2.find("#mapLocation2[value='my adress']").length).toEqual(1)
  })

})

