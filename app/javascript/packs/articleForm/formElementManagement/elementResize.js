import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import resizeLogo from './../../../../assets/images/resize-white.svg'
import resizeHorizontalLogo from './../../../../assets/images/resize-horizontal-white.svg'

class ElementResize extends Component {

  constructor(props) {
    super(props)
    this.state = {
      clientWidth: document.body.clientWidth
    }
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
    return this.state.clientWidth >= 768 || this.props.direction == "vertical" && this.props.active ?
    (
      <div className="elementResize" onDragStart={this.preventDragging} onMouseDown={this.initResize} onTouchStart={this.initResize}>
        <div className={`resizeLogo ${this.props.direction}`}>
          <img src={this.props.direction == "vertical" ? resizeLogo : resizeHorizontalLogo}/>
        </div>
      </div>
    ) : null
  }
}

ElementResize.propTypes = {
  direction: PropTypes.string.isRequired,
  dropTarget: PropTypes.object,
  preventDragging: PropTypes.func
}

export default ElementResize
