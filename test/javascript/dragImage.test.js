import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'
import renderer from 'react-test-renderer';

import DragImage from '../../app/javascript/packs/articleForm/dragImage'
import article from './__mocks__/fakeArticle'

const map = article.maps[0]
const text_content = article.text_contents[0]
const photo = article.photos[0]

configure({ adapter: new Adapter() });

describe('DragImage test suite', () => {

  it('renders component with a photo', () => {
    const DragImageTreePhoto = renderer
      .create(<DragImage activeDragImage={true} dragContent={photo}/>)
      .toJSON()
    expect(DragImageTreePhoto).toMatchSnapshot();
  })

  it('renders component with a text_content', () => {
    const DragImageTreeText = renderer
      .create(<DragImage activeDragImage={true} dragContent={text_content}/>)
      .toJSON()
    expect(DragImageTreeText).toMatchSnapshot();
  })

  it('renders component with a map', () => {
    const DragImageTreeMap = renderer
      .create(<DragImage activeDragImage={true} dragContent={map}/>)
      .toJSON()
    expect(DragImageTreeMap).toMatchSnapshot();
  })

})

