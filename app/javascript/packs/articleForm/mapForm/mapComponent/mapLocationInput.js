import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class MapLocationInput extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="mapLocation">
        <div className="locationInput input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-default">Map's center</span>
          </div>
          <input type="text" className="form-control mapLocationInput" aria-label="Default" aria-describedby="inputGroup-sizing-default" id={`mapLocation${this.props.id}`} defaultValue={this.props.location}/>
        </div>
      </div>
    )
  }
}

export default MapLocationInput
