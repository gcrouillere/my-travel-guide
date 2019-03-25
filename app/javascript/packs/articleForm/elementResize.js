import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import resizeLogo from './../../../assets/images/resize-white.svg'

class ElementResize extends Component {

  preventDragging = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  initResize = (event) => {
    event.preventDefault()
    event.stopPropagation()
    this.props.initResize(event)
  }

  render() {

    return (
      <div className="elementResize" onDragStart={this.preventDragging} onMouseDown={this.initResize}>
        <div className="resizeLogo"><img src={resizeLogo}/></div>
      </div>
    )
  }
}

export default ElementResize
