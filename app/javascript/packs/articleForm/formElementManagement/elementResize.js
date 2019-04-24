import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import resizeLogo from './../../../../assets/images/resize-white.svg'
import resizeHorizontalLogo from './../../../../assets/images/resize-horizontal-white.svg'

class ElementResize extends Component {

    constructor(props) {
      super(props)
    }

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
        <div className={`resizeLogo ${this.props.direction}`}>
          <img src={this.props.direction == "vertical" ? resizeLogo : resizeHorizontalLogo}/>
        </div>
      </div>
    )
  }
}

export default ElementResize
