import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import dragLogo from './../../../../assets/images/drag-order-white.svg'
import tuneLogo from './../../../../assets/images/tune-white.svg'

class DragVisualElements extends Component {

  constructor(props) {
    super(props)
  }

  activeCustomization = () => {
    if (this.props.map) document.getElementById(`mapCustomization-${this.props.map.id}`).classList.add("active")
    if (this.props.photo) document.getElementById(`photoCustomization-${this.props.photo.id}`).classList.add("active")
  }

  render() {

    return (
      <div className="DragVisualElements">
        <div className="dragLogo"><img src={dragLogo}/></div>
        {(this.props.photo || this.props.map) && <div className="tuneLogo" onMouseDown={this.activeCustomization}><img src={tuneLogo}/></div>}
        <div className="dragOverlay"><p>Content being dragged</p></div>
      </div>
    )
  }
}

export default DragVisualElements
