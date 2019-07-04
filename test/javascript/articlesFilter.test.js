import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';

import ArticlesFilter from '../../app/javascript/packs/articlesFilter';
import audienceSelection from './__mocks__/audienceSelection'

configure({ adapter: new Adapter() });

describe('Renders component without crashing', () => {

  it('renders blank filter from', () => {
    const articlesFilterTree = renderer.create(<ArticlesFilter />).toJSON();
    expect(articlesFilterTree).toMatchSnapshot();
  })

  it('passes params to articlesList on audience click', () => {
    const filterArticlesList = jest.fn()
    let wrapper = shallow(<ArticlesFilter filterArticlesList={filterArticlesList}/>)
    wrapper.find(".articlesFilter .audienceFilter #audienceFilter-0").simulate('click')

    expect(wrapper.filterArticlesList.mock.calls[0]).toEqual([ { audience_selection: [0] } ])
  })
})
