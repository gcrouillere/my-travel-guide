import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, configure, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router'

import DeleteButton from '../../app/javascript/packs/articleForm/formElementManagement/deleteButton'
import DragVisualElements from '../../app/javascript/packs/articleForm/formElementManagement/dragVisualElements'
import DropZone from '../../app/javascript/packs/articleForm/formElementManagement/dropZone'
import ElementResize from '../../app/javascript/packs/articleForm/formElementManagement/elementResize'

configure({adapter: new Adapter()})

describe('DeleteButton tests', () => {

  const deleteButtonTree = renderer
    .create(<DeleteButton deleteElement={deleteElement}/>)
    .toJSON()
  expect(deleteButtonTree).toMatchSnapshot();

  const deleteElement = jest.fn()
  const wrapper = mount(<DeleteButton deleteElement={deleteElement}/>)

  it('passes element to delete to parent component', () => {
    wrapper.find(".contentDelete").simulate('click')
    expect(deleteElement).toHaveBeenCalled()
  })
})

describe('DragVisualElements tests', () => {

  const dragVisualElementsTree = renderer
    .create(<DragVisualElements activeCustomization={activeCustomization} map={"my map"}/>)
    .toJSON()
  expect(dragVisualElementsTree).toMatchSnapshot();

  const activeCustomization = jest.fn()
  const wrapper = mount(<DragVisualElements activeCustomization={activeCustomization} map={"my map"}/>)

  it('loads tune logo with appropriate props', () => {
    expect(wrapper.find(".DragVisualElements .tuneLogo img").length).toEqual(1)
  })

  it('activates customization on mousedown', () => {
    wrapper.find(".DragVisualElements .tuneLogo").simulate('mousedown')
    expect(activeCustomization).toHaveBeenCalled()
  })
})

describe('DropZone tests', () => {

  const dropZoneTree = renderer
    .create(<DropZone area={"after"}/>)
    .toJSON()
    expect(dropZoneTree).toMatchSnapshot();

})

describe('ElementResize tests', () => {

  const ElementResizeTree = renderer
  .create(<ElementResize initResize={initResize} direction={"horizontal"}/>)
  .toJSON()
  expect(ElementResizeTree).toMatchSnapshot();

  const initResize = jest.fn()
  const wrapper = mount(<ElementResize initResize={initResize} direction={"horizontal"}/>)

  it('passes component resize to parent component', () => {
    wrapper.find(".elementResize").simulate('mousedown')
    expect(initResize).toHaveBeenCalled()
  })
})
