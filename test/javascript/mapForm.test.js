import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'
import renderer from 'react-test-renderer';

import MapForm from '../../app/javascript/packs/articleForm/mapForm'
import article from './__mocks__/fakeArticle'

const map = article.maps[0]

configure({ adapter: new Adapter() });

describe('MapForm test suite', () => {

  it('renders component', () => {
    const MapFormTreePhoto = renderer
      .create(
        <MapForm map={map} name={map.name} dragging={false} articleId={article.id} position={map.position}
        id={map.id} />)
      .toJSON()
    expect(MapFormTreePhoto).toMatchSnapshot();
  })

})
