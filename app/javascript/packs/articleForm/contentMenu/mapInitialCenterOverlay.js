import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import MapLocationInput from './../mapLocationInput'

class MapInitialCenterOverlay extends Component {
  constructor(props) {
    super(props)
  }

  abandonMapCreation = () => {
    this.props.abandonMapCreation()
  }

  handleMap = (map) => {
    this.props.addNewMap(map)
  }

  render() {

    return (
      <div className={`mapInitialCenterOverlay ${this.props.mapOverlayActive ? "active" : ""}`}>
        <button onClick={this.abandonMapCreation} className="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <p className="mapOverlayTitle">Which area do you want to show ?</p>
        <p className="mapOverlaydescription">If no suggestion is given, try a near match. You 'll be able to fine tune the map in the article editor.</p>
        <MapLocationInput id={"menu"} handleMap={this.handleMap} menu={true}/>
      </div>
    )
  }
}

MapInitialCenterOverlay.propTypes = {
  mapOverlayActive: PropTypes.bool.isRequired,
  abandonMapCreation: PropTypes.func.isRequired,
  addNewMap: PropTypes.func.isRequired
}

export default MapInitialCenterOverlay
