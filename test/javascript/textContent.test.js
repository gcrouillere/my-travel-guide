import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'
import renderer from 'react-test-renderer';

import TextContentForm from '../../app/javascript/packs/articleForm/textContentForm'
import article from './__mocks__/fakeArticle'

jest.mock('../../app/javascript/utils/ajaxHelpers')
jest.mock('react-quill', () => { return "textarea" })

const text_content = article.text_contents[0]

configure({ adapter: new Adapter() });

describe('TextContentForm test suite', () => {

  it('renders component', () => {
    const TextContentFormTree = renderer
      .create(
        <TextContentForm textContent={text_content} dragging={false} articleId={article.id} position={text_content.position}
        id={text_content.id} mapCustomizationOnGoing={false}/>)
      .toJSON()
    expect(TextContentFormTree).toMatchSnapshot();
  })

})
