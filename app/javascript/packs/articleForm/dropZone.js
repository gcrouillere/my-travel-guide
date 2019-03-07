import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class DropZone extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={`dropZone-${this.props.area}`}>
        Drop your content here
      </div>
    )
  }
}

export default DropZone
