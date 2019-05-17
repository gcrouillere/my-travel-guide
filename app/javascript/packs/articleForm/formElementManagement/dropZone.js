import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class DropZone extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    let active = this.props.dropTarget ?
      (this.props.dropTarget.where == this.props.area ? "active" : "") :
      ""

    return (
      <div className={`dropZone-${this.props.area} drop-${this.props.area} ${active}`}>
        <p className={`drop-${this.props.area}`}>Drop your content here</p>
      </div>
    )
  }
}

export default DropZone
