import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class ProcessingOverlay extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    return (
        <div className={`processingOverlay ${this.props.processing ? "processing" : "inactive"}`}>
          <button className="btn btn-dark" type="button" disabled>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Processing ...
          </button>
        </div>
    )
  }
}

ProcessingOverlay.propTypes = {
  processing: PropTypes.bool.isRequired
}

export default ProcessingOverlay
