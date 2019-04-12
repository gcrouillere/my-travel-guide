import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import $ from 'jquery'
import tempMarkerLogo from './../../../../assets/images/circle-full-black.svg'

class MapCustomization extends Component {

  constructor(props) {
    super(props)
    this.state = {
      polylineOnConstruction: false,
      polyline: null,
      polylineFilled: false,
      markerOnConstruction: false,
    }
  }

  abandonMapCustomization = () => { document.getElementById(`mapCustomization-${this.props.map.id}`).classList.remove("active") }

  handleInput = (event) => {
    this.setState({content: event.target.value})
  }

  initAddMarker = (event) => {
    if (!this.state.markerOnConstruction) {
      this.setState({markerOnConstruction: true})
      this.props.preventCustomizationMix("initAddMarker")
      this.props.googleMap.addListener('click', event => {
        this.addMarker(
          event,
          {lat: event.latLng.lat(), lng: event.latLng.lng(), description: this.state.content, map_id: this.props.map.id, logo: "markerLogo"},
          'click'
        )
      })
    } else {
      this.props.preventCustomizationMix()
      google.maps.event.clearListeners(this.props.googleMap, 'click')
      this.setState({markerOnConstruction: false})
    }
  }

  addMarker = (event, markerCharacteristics, eventType) => {
    $.ajax({
      method: 'POST',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/markers/`,
      dataType: "JSON",
      data: {marker: markerCharacteristics}
    }).done((data) => {
      google.maps.event.clearListeners(this.props.googleMap, eventType);
      this.setState({markerOnConstruction: false})
      this.props.preventCustomizationMix()
      this.props.updateMapDataList(data, "markers", "add")
    }).fail((data) => {
      console.log(data)
    })
  }

  initPolyLine = (event) => {
    if (!this.state.polylineOnConstruction) {
      this.polyline = new google.maps.Polyline({
        map: this.props.googleMap,
        strokeColor: '#495057',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        geodesic: true
      });
      this.props.preventCustomizationMix("initPolyLine")
      this.props.googleMap.addListener('click', event => {this.addPolylinePoint(event, this.polyline)})
      this.setState({polylineOnConstruction: true, polyline: null})
      this.createPolyline()
    } else {
      this.props.preventCustomizationMix()
      google.maps.event.clearListeners(this.props.googleMap, 'click');
      this.setState({polylineOnConstruction: false})
      if (this.state.polylineFilled) {
        this.getPolyline()
        this.setState({polylineFilled: false})
      } else {
        this.deleteEmptyPolyline()
      }
    }
  }

  addPolylinePoint = (event, polyline) => {
    var path = polyline.getPath()
    var polylineMarkerCount = polyline.getPath().getLength()
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
    path.push(event.latLng);
    $.ajax({
      method: 'POST',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/markers/`,
      dataType: "JSON",
      data: {marker: {lat: event.latLng.lat(), lng: event.latLng.lng(), position: polylineMarkerCount, polyline_id: this.state.polyline.id}}
    }).done((data) => { this.setState({polylineFilled: true}) })
    .fail((data) => { console.log(data) })
  }

  createPolyline = () => {
    $.ajax({
      method: 'POST',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/polylines/`,
      dataType: "JSON",
      data: {polyline: {map_id: this.props.map.id}}
    }).done((data) => { this.setState({polyline: data}) })
    .fail((data) => { console.log(data) })
  }

  getPolyline = () => {
    $.ajax({
      method: 'GET',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/polylines/${this.state.polyline.id}`,
      dataType: "JSON"
    }).done((data) => {
      this.setState({polyline: data})
      this.props.updateMapDataList(this.state.polyline, "polylines", "add")
    })
    .fail((data) => { console.log(data) })
  }

  deleteEmptyPolyline = () => {
    $.ajax({
      method: 'DELETE',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/polylines/${this.state.polyline.id}`,
      dataType: "JSON"
    }).done((data) => {
      document.getElementById(`polylineCustomization-${this.props.map.id}`).classList.remove("active")
      this.setState({polyline: null})
    }).fail((data) => {console.log(data)})
  }

  render() {

    return (
      <div id={`mapCustomization-${this.props.map.id}`} className="mapCustomization">
        <div className="overflowContainer">
          {!this.props.customizationOnGoing.status &&
          <button onClick={this.abandonMapCustomization} className="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          }
          <h3>Map Customization:</h3>
          <button className={`btn btn-dark mapCustomizationBlock ${this.state.markerOnConstruction ? "finishPath" : "startPath"}`}
            onClick={this.initAddMarker} disabled={this.props.customizationOnGoing.status ? this.props.customizationOnGoing.trigger !== "initAddMarker" : false}>
            {this.state.markerOnConstruction ? "Click on Map to place Marker" : "Add a Marker"}
            {this.state.markerOnConstruction && <p className="actionCancelInfo">Click button again to cancel action</p>}
          </button>
          <button className={`btn btn-dark mapCustomizationBlock ${this.state.polylineOnConstruction ? "finishPath" : "startPath"}`}
            onClick={this.initPolyLine} disabled={this.props.customizationOnGoing.status ? this.props.customizationOnGoing.trigger !== "initPolyLine" : false}>
            {this.state.polylineOnConstruction ? (this.state.polylineFilled ? "Finish Path" : "Click on Map to draw Path") : "Add a Path"}
            {this.state.polylineOnConstruction && !this.state.polylineFilled && <p className="actionCancelInfo">Click button again to cancel action</p>}
          </button>
        </div>
      </div>
    )
  }
}

export default MapCustomization
