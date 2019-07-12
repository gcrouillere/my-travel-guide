import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import $ from 'jquery'
import ajaxHelpers from './../../../utils/ajaxHelpers'
import markerLogos from './markerLogos'

class MarkerCustomization extends Component {

  constructor(props) {
    super(props)
    this.state = {
      googleMarker: null,
      marker: null,
      logo: null,
      description: "",
      markerCustomizationActive: false,
      logos: markerLogos
    }
    this.textareaRef = React.createRef()
  }

  initMarkerCustomization = (event, googleMarker, marker) => {
    if (!this.props.customizationOnGoing.status) {
      this.setState({
        googleMarker: googleMarker,
        marker: marker,
        description: marker.description || "",
        logo: marker.logo,
        markerCustomizationActive: true
      })
      this.props.hidePolylineCustomization()
      this.textareaRef.current.focus()
    }
  }

  hideMarkerCustomization = () => { this.setState({ markerCustomizationActive: false }) }

  handleDescription = (event) => { this.setState({ description: event.target.value }) }

  saveDescription = (event) => {
    this.state.googleMarker.mapCenter ?
      this.props.updateMap({ name: this.state.description }) :
      this.updateMarker({ description: this.state.description })
  }

  logoChange = (event) => {
    this.setState({logo: event.target.value})
    this.updateMarker({logo: event.target.value})
  }

  updateMarker = async (markerCharacteristic) => {
    const newMarker = await ajaxHelpers.ajaxCall(
      'PUT',
      `/markers/${this.state.marker.id}`,
      { marker: markerCharacteristic },
      this.props.token
    )

    this.setState({ googleMarker: null, marker: null, logo: null, markerCustomizationActive: false })
    this.props.updateMapDataList(newMarker, "markers", "change")
  }

  deleteMarker = async () => {
    const deletedMarker = await ajaxHelpers.ajaxCall(
      'DELETE',
      `/markers/${this.state.marker.id}`,
      {},
      this.props.token
    )
    this.setState({ googleMarker: null, marker: null, logo: null, markerCustomizationActive: false })
    this.props.updateMapDataList(deletedMarker, "markers", "delete")
  }

  onDragStart = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  render() {
    return (
      <div id={`markerCustomization-${this.props.map.id}`}
      className={`markerCustomization ${this.state.markerCustomizationActive ? "active" : ""}`}
      draggable onDragStart={this.onDragStart}>
        <div className="overflowContainer">
          <button onClick={this.hideMarkerCustomization} className="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h3>Marker Customization:</h3>
          <div className="mapCustomizationBlock">
            <textarea id={`description-${this.props.map.id}`} value={this.state.description} onChange={this.handleDescription}
            ref={this.textareaRef}/>
            <button className="btn btn-dark" onClick={this.saveDescription}
            disabled={this.props.customizationOnGoing.status ? this.props.customizationOnGoing.trigger !== "saveDescription" : false}>
              Save description
            </button>
          </div>
          {this.state.googleMarker ? !this.state.googleMarker.mapCenter &&
            <div>
              <div className="mapCustomizationBlock">
              {Object.keys(this.state.logos).map(logosKey =>
                <div key={`${logosKey}`} className="form-check form-check-inline">
                  <input className="form-check-input markerLogoInput" type="radio" id={`radio-${logosKey}`}
                  name="inlineRadioOptions" onChange={this.logoChange}
                  value={logosKey} checked={this.state.logo == null ? false : this.state.logo == logosKey}
                  disabled={this.props.customizationOnGoing.status ? this.props.customizationOnGoing.trigger !== "logoChange" : false}/>
                  <label className="form-check-label" htmlFor={`radio-${logosKey}`}>
                    <img src={this.state.logos[logosKey].url}/>
                  </label>
                </div>
              )}
              </div>
              <button className="btn btn-dark mapCustomizationBlock" onClick={this.deleteMarker}
              disabled={this.props.customizationOnGoing.status ? this.props.customizationOnGoing.trigger !== "deleteMarker" : false}>
                Delete Marker
              </button>
            </div> : false
          }
        </div>
      </div>
    )
  }
}

MarkerCustomization.propTypes = {
  googleMap: PropTypes.object,
  map: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
  customizationOnGoing: PropTypes.object.isRequired,
  updateMapDataList: PropTypes.func.isRequired,
  updateMap: PropTypes.func.isRequired,
  hidePolylineCustomization: PropTypes.func.isRequired,
}

export default MarkerCustomization
