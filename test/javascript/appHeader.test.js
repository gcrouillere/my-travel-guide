import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer';
import { shallow, configure, mount } from 'enzyme';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Adapter from 'enzyme-adapter-react-16';
import AppHeader from '../../app/javascript/packs/appHeader'

configure({ adapter: new Adapter() });

describe('AppHeader test Suite', () => {
  it('renders component', () => {
    const appHeaderTree = renderer.create(<Router><AppHeader location={{pathname: "/articles"}}/></Router>).toJSON()
    expect(appHeaderTree).toMatchSnapshot()
  })
})
