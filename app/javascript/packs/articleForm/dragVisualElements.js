import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import dragLogo from './../../../assets/images/drag-white.svg'

class DragVisualElements extends Component {

  render() {

    return (
      <div>
        <div className="dragLogo"><img src={dragLogo}/></div>
        <div className="dragOverlay"><p>Content being dragged</p></div>
      </div>
    )
  }
}

export default DragVisualElements
