import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import $ from 'jquery'
import markerLogo from './../../../../../assets/images/place-black.svg'
import restaurantLogo from './../../../../../assets/images/restaurant-black.svg'
import hotelLogo from './../../../../../assets/images/hotel-black.svg'
import barLogo from './../../../../../assets/images/bar-black.svg'
import cafeLogo from './../../../../../assets/images/cafe-black.svg'
import busLogo from './../../../../../assets/images/bus-black.svg'
import boatLogo from './../../../../../assets/images/boat-black.svg'
import trainLogo from './../../../../../assets/images/train-black.svg'
import parkingLogo from './../../../../../assets/images/parking-black.svg'
import seeLogo from './../../../../../assets/images/see-black.svg'

class Marker extends Component {

  constructor(props) {
    super(props)
    this.state = {
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

 componentDidUpdate(prevProps) {
    if (prevProps.googleMap != this.props.googleMap) { this.renderMarker() }
  }

  renderMarker() {
    this.googleMarker = new google.maps.Marker({
      position: {lat: this.props.marker.lat, lng: this.props.marker.lng},
      map: this.props.googleMap,
      draggable: true,
      icon: this.state.logos[this.props.marker.logo].url
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
      this.props.updateMapDataList(data, "markers", "change")
    }).fail((data) => {
      console.log(data)
    })
  }

  render() {
    return null;
  }
}

export default Marker
