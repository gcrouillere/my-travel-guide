import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class MapInitialCenterOverlay extends Component {
  constructor(props) {
    super(props)
  }

  abandonMapCreation = () => {
    document.querySelector(".mapInitialCenterOverlay").classList.remove("active")
  }

  render() {
    return (
      <div className="mapInitialCenterOverlay">
        <button onClick={this.abandonMapCreation} className="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <p className="mapOverlayTitle">Which area do you want to show ?</p>
        <p className="mapOverlaydescription">If no suggestion is given, try a near match. You 'll be able to fine tune the map in the article editor.</p>
        <div className="input-group input-group-lg">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-large">Map's center</span>
          </div>
          <input type="text" className="form-control" aria-label="Large" aria-describedby="inputGroup-sizing-large" id="initialMapLocation" defaultValue=""/>
        </div>
      </div>
    )
  }
}

export default MapInitialCenterOverlay
