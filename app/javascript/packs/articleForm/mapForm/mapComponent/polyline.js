import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import $ from 'jquery'
import update from 'immutability-helper'
import ajaxHelpers from './../../../../utils/ajaxHelpers'
import tempMarkerLogo from './../../../../../assets/images/circle-full-black.svg'
import pathStartLogo from './../../../../../assets/images/circle-black.svg'
import pathEndLogo from './../../../../../assets/images/path-end-black.svg'

class Polyline extends Component {

  constructor(props) {
    super(props)
    this.state = {
      polylineMarkers: this.props.polyline.markers,
      polyline: this.props.polyline
    }
  }

 componentDidUpdate(prevProps) {
    if (prevProps.googleMap != this.props.googleMap) {
      this.setState({polyline: this.props.polyline, polylineMarkers: this.props.polyline.markers}, () => { this.renderPolyline() })
    }
  }

  renderPolyline() {
    this.googlePolyline = new google.maps.Polyline({
      map: this.props.googleMap,
      path: this.state.polyline.markers,
      strokeColor: '#495057',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      geodesic: true

    })

    this.state.polyline.markers.forEach((marker, index) => {

      let icon = this.getPolylinePointLogo(index)
      let tempMarker = new google.maps.Marker({
        position: {lat: marker.lat, lng: marker.lng},
        map: this.props.googleMap,
        draggable: true,
        markerIndex: index,
        markerDBID: marker.id,
        appMarker: marker,
        icon: icon
      })
      this.manageDistanceInfoWindow(index, this.state.polyline.distance_displayed, this.googlePolyline, tempMarker)

      tempMarker.addListener('dragend', event => {this.updatePolylinePoint(event, tempMarker)})
      tempMarker.addListener('drag', event => {this.updatePolyline(event, this.googlePolyline, tempMarker)})
      tempMarker.addListener('click', event => {this.managePolylinePoint(event, this.googlePolyline, tempMarker)})

    })

    this.googlePolyline.addListener('click', event => { this.managePolyline(event, this.googlePolyline) })
  }

  managePolyline = (event, googlePolyline) => { this.props.managePolyline(event, googlePolyline, this.state.polyline) }

  managePolylinePoint = (event, googlePolyline, googleMarker) => {
    this.props.managePolylinePoint(event, googlePolyline, this.state.polyline, googleMarker)
  }

  getPolylinePointLogo = (index) => {
    let icon = {}
    if (index == 0) {
      icon = {url: pathStartLogo, size: new google.maps.Size(24, 24), anchor: new google.maps.Point(12, 12)}
    } else if (index == this.state.polylineMarkers.length - 1) {
      icon = {url: pathEndLogo, size: new google.maps.Size(24, 24), anchor: new google.maps.Point(6, 23)}
    } else {
      icon = {url: tempMarkerLogo, size: new google.maps.Size(24, 24), anchor: new google.maps.Point(6, 6)}
    }
    return icon
  }

  manageDistanceInfoWindow = (index, distanceDisplayed, googlePolyline, googleMarker) => {
    if ( distanceDisplayed && index == this.state.polylineMarkers.length - 1) {
      let distance = Math.round(google.maps.geometry.spherical.computeLength(googlePolyline.getPath()) / 1000 * 100) / 100;
      this.infowindow = new google.maps.InfoWindow({content: `Path length: ${distance} km`, disableAutoPan: true});
      this.infowindow.open(this.props.googleMap, googleMarker);
    }
  }

  updatePolyline = (event, googlePolyline, tempGoogleMarker) => {
    tempGoogleMarker.setPosition(event.latLng);
    googlePolyline.getPath().setAt(tempGoogleMarker.markerIndex, tempGoogleMarker.getPosition());
  }

  updatePolylinePoint = async (event, tempGoogleMarker) => {
    const newMarker = await ajaxHelpers.ajaxCall(
      'PUT',
      `/markers/${tempGoogleMarker.appMarker.id}`,
      { marker: { lat: event.latLng.lat(), lng: event.latLng.lng() } },
      this.props.token
    )

    let markerIndex = tempGoogleMarker.markerIndex
    let polylineMarkers = update(this.state.polylineMarkers, {$splice: [[markerIndex, 1, newMarker]]})
    let polyline = update(this.state.polyline, {markers: {$set: polylineMarkers}})
    this.setState({polylineMarkers: polylineMarkers, polyline: polyline})
    this.props.updateMapDataList(polyline, "polylines", "change")
  }

  render() {
    return null;
  }
}

export default Polyline
