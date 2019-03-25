import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class Marker extends Component {

  constructor(props) {
    super(props)
    this.state = {
      marker: this.props.marker,
      googleMarker: null
    }
  }

  componentWillReceiveProps(newProps) {
    this.googleMarker = new google.maps.Marker({
      position: {lat: newProps.marker.lat, lng: newProps.marker.lng},
      map: newProps.googleMap
    })

    if (newProps.marker.description) {
      this.infowindow = new google.maps.InfoWindow({
        content: newProps.marker.description
      });
      this.infowindow.open(newProps.googleMap, this.googleMarker);
    }

    this.setState({googleMarker: this.googleMarker})
    this.googleMarker.addListener('click', event => {this.manageMarker(event)})
  }

  manageMarker = (event) => {
    console.log(this.state.googleMarker)
  }

  render() {
    return null;
  }
}

export default Marker
