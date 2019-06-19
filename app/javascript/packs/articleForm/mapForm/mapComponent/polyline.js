import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import $ from 'jquery'
import update from 'immutability-helper'

import mapHelper from './../../../../utils/mapHelper'
import ajaxHelpers from './../../../../utils/ajaxHelpers'

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
      this.setState({ polyline: this.props.polyline, polylineMarkers: this.props.polyline.markers },
        () => { this.renderPolyline() })
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

      let icon = mapHelper.getPolylinePointLogo(index, this.state.polylineMarkers)
      let tempMarker =  mapHelper.createMarker(marker, this.props.googleMap, icon, index, true)
      mapHelper.manageDistanceInfoWindow(index, this.state.polyline.distance_displayed, this.state.polylineMarkers,
        this.googlePolyline, tempMarker, this.props.googleMap)

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
