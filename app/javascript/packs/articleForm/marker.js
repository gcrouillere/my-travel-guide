import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import $ from 'jquery'

class Marker extends Component {

  constructor(props) {
    super(props)
  }

 componentDidUpdate(prevProps) {
    if (prevProps.googleMap != this.props.googleMap ) { this.renderMarker() }
  }

  renderMarker() {
    this.googleMarker = new google.maps.Marker({
      position: {lat: this.props.marker.lat, lng: this.props.marker.lng},
      map: this.props.googleMap,
      draggable: true
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

  updateMarkerPosition = (event, marker) => {
    let markerCharacteristics = {lat: event.latLng.lat(), lng: event.latLng.lng()}
    $.ajax({
      method: 'PUT',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/markers/${this.props.marker.id}`,
      dataType: "JSON",
      data: {marker: markerCharacteristics}
    }).done((data) => {
      console.log(data)
    }).fail((data) => {
      console.log(data)
    })
  }

  render() {
    return null;
  }
}

export default Marker
