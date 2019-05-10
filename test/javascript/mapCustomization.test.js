import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'
import renderer from 'react-test-renderer';

import MapCustomization from '../../app/javascript/packs/articleForm/mapForm/mapCustomization'

configure({ adapter: new Adapter() });

jest.mock('../../app/javascript/utils/ajaxHelpers')

describe('MapComponent tests', () => {

  it('renders component', () => {
    const mapCustomizationTree = renderer
      .create(<MapCustomization />)
      .toJSON()
      expect(mapCustomizationTree).toMatchSnapshot();
  })
})
