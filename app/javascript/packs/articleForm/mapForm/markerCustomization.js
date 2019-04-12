import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import $ from 'jquery'
import markerLogo from './../../../../assets/images/place-black.svg'
import restaurantLogo from './../../../../assets/images/restaurant-black.svg'
import hotelLogo from './../../../../assets/images/hotel-black.svg'
import barLogo from './../../../../assets/images/bar-black.svg'
import cafeLogo from './../../../../assets/images/cafe-black.svg'
import busLogo from './../../../../assets/images/bus-black.svg'
import boatLogo from './../../../../assets/images/boat-black.svg'
import trainLogo from './../../../../assets/images/train-black.svg'
import parkingLogo from './../../../../assets/images/parking-black.svg'
import seeLogo from './../../../../assets/images/see-black.svg'

class MarkerCustomization extends Component {

  constructor(props) {
    super(props)
    this.state = {
      googleMarker: null,
      marker: null,
      logo: null,
      description: "",
      logos: {
        markerLogo: {url: markerLogo},
        restaurantLogo: {url: restaurantLogo},
        hotelLogo: {url: hotelLogo},
        barLogo: {url: barLogo},
        cafeLogo: {url: cafeLogo},
        busLogo: {url: busLogo},
        boatLogo: {url: boatLogo},
        trainLogo: {url: trainLogo},
        parkingLogo: {url: parkingLogo},
        seeLogo: {url: seeLogo}
      }
    }
  }

  initMarkerCustomization = (event, googleMarker, marker) => {
    if (!this.props.customizationOnGoing.status) {
      this.setState({googleMarker: googleMarker, marker: marker, description: marker.description || "", logo: marker.logo})
      document.getElementById(`markerCustomization-${this.props.map.id}`).classList.add("active")
      document.getElementById(`polylineCustomization-${this.props.map.id}`).classList.remove("active")
    }
  }

  abandonMarkerCustomization = () => { document.getElementById(`markerCustomization-${this.props.map.id}`).classList.remove("active") }

  handleDescription = (event) => {this.setState({description: event.target.value})}

  saveDescription = (event) => {
    this.updateMarker({description: this.state.description})
  }

  logoChange = (event) => {
    this.setState({logo: event.target.value})
    this.updateMarker({logo: event.target.value})
  }

  updateMarker = (markerCharacteristic) => {
    $.ajax({
      method: 'PUT',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/markers/${this.state.marker.id}`,
      dataType: "JSON",
      data: {marker: markerCharacteristic}
    }).done((data) => {
      document.getElementById(`markerCustomization-${this.props.map.id}`).classList.remove("active")
      this.setState({googleMarker: null, marker: null, logo: null})
      this.props.updateMapDataList(data, "markers", "change")
    }).fail((data) => {
      console.log(data)
    })
  }

  deleteMarker = () => {
    $.ajax({
      method: 'DELETE',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/markers/${this.state.marker.id}`,
      dataType: "JSON"
    }).done((data) => {
      document.getElementById(`markerCustomization-${this.props.map.id}`).classList.remove("active")
      this.setState({googleMarker: null, marker: null, logo: null})
      this.props.updateMapDataList(data, "markers", "delete")
    }).fail((data) => {console.log(data)})
  }

  render() {
    return (
      <div id={`markerCustomization-${this.props.map.id}`} className="markerCustomization">
        <div className="overflowContainer">
          <button onClick={this.abandonMarkerCustomization} className="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h3>Marker Customization:</h3>
          <div className="mapCustomizationBlock">
            <textarea value={this.state.description} onChange={this.handleDescription}/>
            <button className="btn btn-dark" onClick={this.saveDescription}
            disabled={this.props.customizationOnGoing.status ? this.props.customizationOnGoing.trigger !== "saveDescription" : false}>
              Update description
            </button>
          </div>
          <div className="mapCustomizationBlock">
          {Object.keys(this.state.logos).map(logosKey =>
            <div key={`${logosKey}`} className="form-check form-check-inline">
              <input className="form-check-input markerLogoInput" type="radio" id={`radio-${logosKey}`} name="inlineRadioOptions"
              value={logosKey} checked={this.state.logo == null ? false : this.state.logo == logosKey} onChange={this.logoChange}
              disabled={this.props.customizationOnGoing.status ? this.props.customizationOnGoing.trigger !== "logoChange" : false}/>
              <label className="form-check-label" htmlFor={`radio-${logosKey}`}><img src={this.state.logos[logosKey].url}/></label>
            </div>
          )}
          </div>
          <button className="btn btn-dark mapCustomizationBlock" onClick={this.deleteMarker}
          disabled={this.props.customizationOnGoing.status ? this.props.customizationOnGoing.trigger !== "deleteMarker" : false}>
            Delete Marker
          </button>
        </div>
      </div>
    )
  }
}
export default MarkerCustomization
