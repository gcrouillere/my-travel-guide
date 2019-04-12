import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import update from 'immutability-helper'
import $ from 'jquery'
import tempMarkerLogo from './../../../../assets/images/circle-full-black.svg'

class PolylineCustomization extends Component {
  constructor(props) {
    super(props)
    this.state = {
      googlePolyline: null,
      polyline: null,
      polylineMarkers: null,
      distanceDisplayed: null,
      polylineOnConstruction: false,
      polylineFilled: false,
      markerClicked: null,
      markerToDelete: false
    }
  }

  abandonPolylineCustomization = () => { document.getElementById(`polylineCustomization-${this.props.map.id}`).classList.remove("active") }

  initPolylineCustomization = (event, googlePolyline, polyline, googleMarker) => {
    if (!this.props.customizationOnGoing.status) {
      document.getElementById(`polylineCustomization-${this.props.map.id}`).classList.add("active")
      document.getElementById(`markerCustomization-${this.props.map.id}`).classList.remove("active")
      if (!this.state.polylineOnConstruction) this.setState({
        googlePolyline: googlePolyline,
        polyline: polyline,
        polylineMarkers: polyline.markers,
        distanceDisplayed: polyline.distance_displayed
      })
    }
    if (googleMarker) {
      this.setState({markerClicked: googleMarker})
      if (this.state.markerToDelete) this.deletePointFromPath()
    }
  }

  distanceDisplay = (event) => {
    this.setState({distanceDisplayed: event.target.value == "true"})
    this.updatePolyline({distance_displayed: event.target.value == "true"})
  }

  updatePolyline = (polylineCharacteristic) => {
    $.ajax({
      method: 'PUT',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/polylines/${this.state.polyline.id}`,
      dataType: "JSON",
      data: {polyline: polylineCharacteristic}
    }).done((data) => {
      document.getElementById(`polylineCustomization-${this.props.map.id}`).classList.remove("active")
      this.setState({googlePolyline: null, polyline: null, distanceDisplayed: null})
      this.props.updateMapDataList(data, "polylines", "change")
    }).fail((data) => {
      console.log(data)
    })
  }

  initcontinuePath = () => {
    if (this.state.polylineOnConstruction) {
      this.props.preventCustomizationMix()
      this.setState({polylineOnConstruction: false, polylineFilled: false})
      google.maps.event.clearListeners(this.props.googleMap, 'click')
      document.getElementById(`polylineCustomization-${this.props.map.id}`).classList.remove("active")
      this.props.updateMapDataList(this.state.polyline, "polylines", "change")
    } else {
      this.setState({polylineOnConstruction: true})
      this.props.preventCustomizationMix("initcontinuePath")
      this.props.googleMap.addListener('click', event => {this.continuePath(event, this.state.googlePolyline)})
    }
  }

  continuePath = (event, googlePolyline) => {
    this.setState({polylineFilled: true})
    var path = googlePolyline.getPath()
    path.push(event.latLng);
    var polylineMarkerCount = googlePolyline.getPath().getLength()
    var tempMarker = new google.maps.Marker({
      position: event.latLng,
      map: this.props.googleMap,
      icon: {
        url: tempMarkerLogo,
        size: new google.maps.Size(24, 24),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(6,6)
      }
    })
    $.ajax({
      method: 'POST',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/markers/`,
      dataType: "JSON",
      data: {marker: {lat: event.latLng.lat(), lng: event.latLng.lng(), position: polylineMarkerCount, polyline_id: this.state.polyline.id}}
    }).done((data) => {
      let markerIndex = data.position
      let polylineMarkers = update(this.state.polylineMarkers, {$splice: [[markerIndex, 1, data]]})
      let polyline = update(this.state.polyline, {markers: {$set: polylineMarkers}})
      this.setState({polylineMarkers: polylineMarkers, polyline: polyline})
    })
    .fail((data) => { console.log(data) })
  }

  initDeletePointFromPath = () => {
    this.props.preventCustomizationMix("initDeletePointFromPath")
    this.setState({markerToDelete: !this.state.markerToDelete})
  }

  deletePointFromPath = () => {
    $.ajax({
      method: 'DELETE',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/markers/${this.state.markerClicked.markerDBID}`,
      dataType: "JSON"
    }).done((data) => {
      document.getElementById(`polylineCustomization-${this.props.map.id}`).classList.remove("active")
      let markerIndex = data.position
      let polylineMarkers = update(this.state.polylineMarkers, {$splice: [[markerIndex, 1]]})
      let polyline = update(this.state.polyline, {markers: {$set: polylineMarkers}})
      this.setState({polylineMarkers: polylineMarkers, polyline: polyline, markerToDelete: false})
      this.props.preventCustomizationMix()
      this.props.updateMapDataList(this.state.polyline, "polylines", "change")
    })
  }

  deletePolyline = () => {
    $.ajax({
      method: 'DELETE',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/polylines/${this.state.polyline.id}`,
      dataType: "JSON"
    }).done((data) => {
      document.getElementById(`polylineCustomization-${this.props.map.id}`).classList.remove("active")
      this.setState({googlePolyline: null, polyline: null, distanceDisplayed: null})
      this.props.updateMapDataList(data, "polylines",  "delete")
    }).fail((data) => {console.log(data)})
  }

  render() {
    return (
      <div id={`polylineCustomization-${this.props.map.id}`} className="polylineCustomization">
        <div className="overflowContainer">
          {!this.props.customizationOnGoing.status &&
          <button onClick={this.abandonPolylineCustomization} className="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          }
          <h3>Path Customization:</h3>
          <div className="distanceDisplayRadios mapCustomizationBlock">
            <p>Display path length ?</p>
            {[true, false].map(x =>
            <div key={x} className="form-check form-check-inline">
              <input className="form-check-input markerLogoInput" type="radio" id={`radio-${x}`} name="inlineRadioOptions" value={x}
              checked={this.state.distanceDisplayed == null ? false : this.state.distanceDisplayed == x}
              onChange={this.distanceDisplay} disabled={this.props.customizationOnGoing.status ? this.props.customizationOnGoing.trigger !== "distanceDisplay" : false}/>
              <label className="form-check-label" htmlFor={`radio-${x}`}>{x ? "Yes" : "No"}</label>
            </div>
            )}
          </div>
          <button className={`btn btn-dark mapCustomizationBlock ${this.state.polylineOnConstruction ? "finishPath" : "startPath"}`}
            onClick={this.initcontinuePath} disabled={this.props.customizationOnGoing.status ? this.props.customizationOnGoing.trigger !== "initcontinuePath" : false}>
            {this.state.polylineOnConstruction ? (this.state.polylineFilled ? "Finish Path" : "Click on Map to continue Path") : "Continue Path"}
            {this.state.polylineOnConstruction && !this.state.polylineFilled && <p className="actionCancelInfo">Click button again to cancel action</p>}
          </button>
          <button className={`btn btn-dark mapCustomizationBlock ${this.state.markerToDelete ? "finishPath" : "startPath"}`}
            onClick={this.initDeletePointFromPath} disabled={this.props.customizationOnGoing.status ? this.props.customizationOnGoing.trigger !== "initDeletePointFromPath" : false}>
            {`${this.state.markerToDelete ? "Click on Point to delete" : "Delete a Point from Path"}`}
            {this.state.markerToDelete && <p className="actionCancelInfo">Click button again to cancel action</p>}
          </button>
          <button className="btn btn-dark" onClick={this.deletePolyline}
          disabled={this.props.customizationOnGoing.status ? this.props.customizationOnGoing.trigger !== "deletePolyline" : false}>
            Delete Path
          </button>
        </div>
      </div>
    )
  }
}

export default PolylineCustomization
