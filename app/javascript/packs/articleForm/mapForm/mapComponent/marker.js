import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import $ from 'jquery'
import ajaxHelpers from './../../../../utils/ajaxHelpers'
import markerLogos from './../markerLogos'

class Marker extends Component {

  constructor(props) {
    super(props)
    this.state = {
      logos: markerLogos
    }
  }

 componentDidUpdate(prevProps) {
    if (prevProps.googleMap != this.props.googleMap) { this.renderMarker() }
  }

  renderMarker() {
    this.googleMarker = new google.maps.Marker({
      position: {lat: this.props.marker.lat, lng: this.props.marker.lng},
      map: this.props.googleMap,
      draggable: !this.props.marker.mapCenter,
      icon: this.state.logos[this.props.marker.logo].url,
      mapCenter: this.props.marker.mapCenter
    })

    if (this.props.marker.description) {
      this.infowindow = new google.maps.InfoWindow({content: this.props.marker.description, disableAutoPan: true});
      this.infowindow.open(this.props.googleMap, this.googleMarker);
    }

    this.googleMarker.addListener('click', event => {
      if (this.infowindow) this.infowindow.open(this.props.googleMap, this.googleMarker)
      this.manageMarker(event, this.googleMarker)
    })
    this.googleMarker.addListener('dragend', event => {this.updateMarkerPosition(event, this.googleMarker)})
  }

  manageMarker = (event, googleMarker) => {
    this.props.manageMarker(event, googleMarker, this.props.marker)
  }

  updateMarkerPosition = async (event, marker) => {
    let markerCharacteristics = {lat: event.latLng.lat(), lng: event.latLng.lng()}

    const newMarker = await ajaxHelpers.ajaxCall(
      'PUT',
      `/markers/${this.props.marker.id}`,
      { marker: markerCharacteristics },
      this.props.token
    )

    this.props.updateMapDataList(newMarker, "markers", "change")
  }

  render() {
    return null;
  }
}

export default Marker
