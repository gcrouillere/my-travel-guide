import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'

import audienceSelection from './__mocks__/audienceSelection'
import AudienceForm from '../../app/javascript/packs/articleForm/audienceForm'

configure({ adapter: new Adapter() });

const wrapper = shallow(<AudienceForm />)
wrapper.setState({allowedAudienceSelections: audienceSelection})

describe('AudienceForm test suite', () => {

  it('renders audience form with check boxes', () => {
    for (let i = 2; i < 4; i ++) {
      expect(wrapper.find(`input#category-${i}`).length).toEqual(1)
      expect(wrapper.find(`label[htmlFor='category-${i}']`).length).toEqual(1)
    }
  })

  it('updates audience selection', () => {
    wrapper.setState({ audiencesSelection: [{id: 3}] })
    const instance = wrapper.instance()
    let newSelectionIDs = instance.manageAudience({ "target": { "id": "category-2" } })
    expect(newSelectionIDs).toEqual([3, 2])
    wrapper.setState({ audiencesSelection: [{id: 3}, {id: 2}] })
    newSelectionIDs = instance.manageAudience({ "target": { "id": "category-2" } })
    expect(newSelectionIDs).toEqual([3])
  });

  it('shows checkboxes current status', () => {
    wrapper.setState({ audiencesSelection: [{id: 2}] })
    expect(wrapper.find(`input#category-2[checked]`).length).toEqual(1)
  })

  it ('shows next step button if selection valid', () => {
    expect(wrapper.find(".AudienceSubmitComplete").length).toEqual(0)
    wrapper.setState({ audiencesSelection: [{id: 3}], audienceValid: true })
    expect(wrapper.find(".AudienceSubmitComplete").length).toEqual(1)
  })

})
