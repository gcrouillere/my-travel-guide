import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class DropZone extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={`dropZone-${this.props.area} drop-${this.props.area}`}>
        <p className={`drop-${this.props.area}`}>Drop your content here</p>
      </div>
    )
  }
}

export default DropZone
