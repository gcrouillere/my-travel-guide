import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import dragLogo from './../../../../assets/images/drag-order-white.svg'
import dragTop from './../../../../assets/images/drag-top-white.svg'
import dragDown from './../../../../assets/images/drag-down-white.svg'
import tuneLogo from './../../../../assets/images/tune-white.svg'
import mainHelpers from './../../../utils/mainHelpers'

class DragVisualElements extends Component {

  constructor(props) {
    super(props)
  }

  activeCustomization = () => {
    this.props.activeCustomization()
  }

  initMoveUp = () => { this.props.initMoveUp() }

  initMoveDown = () => { this.props.initMoveDown() }

  render() {

    return (
      this.props.active ?
      <div className="DragVisualElements">
        { mainHelpers.isTouchDevice() ?
          <div>
            <div className="dragTop" onClick={this.initMoveUp}><img src={dragTop}/></div>
            <div className="dragDown" onClick={this.initMoveDown}><img src={dragDown}/></div>
          </div> :
          <div className="dragLogo"><img src={dragLogo}/></div>
        }
        {(this.props.photo || this.props.map) && <div className="tuneLogo" onMouseDown={this.activeCustomization}><img src={tuneLogo}/></div>}
        <div className="dragOverlay"><p>Content being dragged</p></div>
      </div>
      : null
    )
  }
}

DragVisualElements.propTypes = {
  activeCustomization: PropTypes.func,
  photo: PropTypes.object,
  map: PropTypes.object
}

export default DragVisualElements
