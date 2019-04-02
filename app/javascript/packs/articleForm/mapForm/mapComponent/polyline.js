import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import $ from 'jquery'
import update from 'immutability-helper'
import tempMarkerLogo from './../../../../../assets/images/circle-full-black.svg'
import pathStartLogo from './../../../../../assets/images/circle-black.svg'
import pathEndLogo from './../../../../../assets/images/path-end-black.svg'

class Polyline extends Component {

  constructor(props) {
    super(props)
    this.state = {
      polylineMarkers: this.props.polyline.markers
    }
  }

 componentDidUpdate(prevProps) {
    if (prevProps.googleMap != this.props.googleMap) { this.renderPolyline() }
  }

  renderPolyline() {
    this.googlePolyline = new google.maps.Polyline({
      map: this.props.googleMap,
      path: this.state.polylineMarkers,
      strokeColor: '#495057',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      geodesic: true

    })

    console.log(google.maps.geometry.spherical.computeLength(this.googlePolyline.getPath()))

    this.state.polylineMarkers.forEach((marker, index) => {
      let icon = {}
      if (index == 0) {
        icon = {url: pathStartLogo, size: new google.maps.Size(24, 24), anchor: new google.maps.Point(5,12)}
      } else if (index == this.state.polylineMarkers.length - 1) {
        icon = {url: pathEndLogo, size: new google.maps.Size(24, 24), anchor: new google.maps.Point(6,23)}
      } else {
        icon = {url: tempMarkerLogo, size: new google.maps.Size(24, 24), anchor: new google.maps.Point(6,6)}
      }
      let tempMarker = new google.maps.Marker({
        position: {lat: marker.lat, lng: marker.lng},
        map: this.props.googleMap,
        draggable: true,
        markerIndex: index,
        appMarker: marker,
        icon: icon
      })
      tempMarker.addListener('dragend', event => {this.updatePolylinePoint(event, tempMarker)})
      tempMarker.addListener('drag', event => {this.updatePolyline(event, this.googlePolyline, tempMarker)})
      tempMarker.addListener('click', event => {this.managePolyline(event, this.googlePolyline)})
    })
    this.googlePolyline.addListener('click', event => { this.managePolyline(event, this.googlePolyline) })
  }

  managePolyline = (event, googlePolyline) => {
    this.props.managePolyline(event, googlePolyline, this.props.polyline)
  }

  updatePolyline = (event, googlePolyline, tempGoogleMarker) => {
    tempGoogleMarker.setPosition(event.latLng);
    googlePolyline.getPath().setAt(tempGoogleMarker.markerIndex, tempGoogleMarker.getPosition());
  }

  updatePolylinePoint = (event, tempGoogleMarker) => {
    $.ajax({
      method: 'PUT',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/markers/${tempGoogleMarker.appMarker.id}`,
      dataType: "JSON",
      data: {marker: {lat: event.latLng.lat(), lng: event.latLng.lng()}}
    }).done((data) => {
      let markerIndex = tempGoogleMarker.markerIndex
      let polylineMarkers = update(this.state.polylineMarkers, {$splice: [[markerIndex, 1, data]]})
      this.setState({polylineMarkers: polylineMarkers})
    }).fail((data) => {
      console.log(data)
    })
  }

  render() {
    return null;
  }
}

export default Polyline
