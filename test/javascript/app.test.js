import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'

import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from '../../app/javascript/packs/router';
import ArticlesList from '../../app/javascript/packs/articlesList';
import ArticleForm from '../../app/javascript/packs/articleForm';
import fakeArticle from './__mocks__/fakeArticle'

configure({ adapter: new Adapter() });

it('renders App without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

describe('Render Article Form as expected', () => {
  it('renders blank Articles List without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App><ArticlesList/></App>, div);
  });

  const articles = [
    {id: 1, title: 'Article 1', text_contents: [{id: 1, text: "<h1>Tristique urna eu augue maximus vulputate ante.</h1><p>vulputate ante</p>"}]},
    {id: 2, title: 'Article 2', text_contents: [{id: 1, text: "<h1>Vulputate ante.</h1><p><br></p>"}]}
  ];
  const wrapper = shallow(<ArticlesList articles={articles}/>);

  it('renders 2 articles in the list with appropriate card content', () => {
    expect(wrapper.find('.articles-container .article-card').length).toEqual(2)
    expect(wrapper.find('.articles-container .card-header').length).toEqual(2)
    expect(wrapper.find('.articles-container .card-title').map(node => node.text())).toEqual(["Article 1", "Article 2"])
    expect(wrapper.find('.articles-container .card-text').length).toEqual(2)
    expect(wrapper.find('.articles-container .card-text').map(node => node.text())).toEqual(["Tristique urna eu augue maximus vulputate ante.vulputate ante", "Vulputate ante."])
  });
})
