import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'
import renderer from 'react-test-renderer';

import audienceSelection from './__mocks__/audienceSelection'
import AudienceForm from '../../app/javascript/packs/articleForm/audienceForm'

configure({ adapter: new Adapter() });

jest.mock('../../app/javascript/utils/audienceFormHelpers')

describe('AudienceForm test suite', () => {

  let updateArticleCompletion = jest.fn()

  const audienceFormTree = renderer
    .create(<AudienceForm id={1} updateArticleCompletion={updateArticleCompletion}/>)
    .toJSON()
  expect(audienceFormTree).toMatchSnapshot();

  const wrapper = mount(<AudienceForm id={1} updateArticleCompletion={updateArticleCompletion}/>)

  it('renders audience form with check boxes', async () => {

    await wrapper.instance().componentDidMount()
    wrapper.update()

    for (let i = 2; i <= 3; i ++) {
      expect(wrapper.find(`input#category-${i}`).length).toEqual(1)
      expect(wrapper.find(`label[htmlFor='category-${i}']`).length).toEqual(1)
    }
  })

  it('updates audience selection / shows checbox status / shows next step button if selection valid', async () => {
    await wrapper.find("#category-3").simulate('change', { target: { id: "category-3" }})
    wrapper.update()
    expect(wrapper.find("#category-3[checked=true]").length).toEqual(1)
    expect(wrapper.find(".AudienceSubmitComplete").length).toEqual(1)


    await wrapper.find("#category-3").simulate('change', { target: { id: "category-3" }})
    wrapper.update()
    expect(wrapper.find("#category-3[checked=true]").length).toEqual(0)
    expect(wrapper.find(".AudienceSubmit").length).toEqual(1)
  });

  it ('hides button when audience selection is valid', async () => {
    expect(wrapper.find(".AudienceSubmit").length).toEqual(1)
    await wrapper.find(".AudienceSubmit").simulate('click')
    wrapper.update()
    expect(wrapper.find(".AudienceSubmit").length).toEqual(0)
  })

})
