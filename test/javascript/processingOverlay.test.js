import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'
import renderer from 'react-test-renderer';

import ProcessingOverlay from '../../app/javascript/packs/articleForm/photoForm/processingOverlay'

describe('processingOverlay test suite', () => {
  it('renders component', () => {
    let processingOverlayTree = renderer.create(<ProcessingOverlay processing={false}/>).toJSON()
    expect(processingOverlayTree).toMatchSnapshot()
  })
})
