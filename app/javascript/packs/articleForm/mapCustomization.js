import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import $ from 'jquery'

class MapCustomization extends Component {

  constructor(props) {
    super(props)
    this.state = {
      content: ""
    }
  }

  abandonMapCustomization = () => { document.getElementById(`mapCustomization-${this.props.map.id}`).classList.remove("active") }

  showInfoWindowForm = () => { document.getElementById(`infoWindowContent-${this.props.map.id}`).classList.add("active") }

  handleInput = (event) => {
    this.setState({content: event.target.value})
  }

  initAddSimpleMarker = (event) => {
    this.props.googleMap.addListener('click', event => {
      this.addMarker(event,
        {lat: event.latLng.lat(), lng: event.latLng.lng(), map_id: this.props.map.id},
        'click'
    )});
  }

  initAddMarkerWithIW = (event) => {
    this.props.googleMap.addListener('click', event => {
      this.addMarker(event,
        {lat: event.latLng.lat(), lng: event.latLng.lng(), description: this.state.content, map_id: this.props.map.id},
        'click'
    )});
    document.querySelector(".infoWindowContent").classList.remove("active")
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
      this.props.updateMarkersList(data, "add")
    }).fail((data) => {
      console.log(data)
    })
  }

  render() {

    return (
      <div id={`mapCustomization-${this.props.map.id}`} className="mapCustomization">
        <button onClick={this.abandonMapCustomization} className="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <h3>Map Customization:</h3>
        <button className="btn btn-dark" onClick={this.showInfoWindowForm}>Add Marker with Infowindow</button>
        <button className="btn btn-dark" onClick={this.initAddSimpleMarker}>Add Simple Marker</button>
        <div id={`infoWindowContent-${this.props.map.id}`} className="infoWindowContent">
          <textarea value={this.state.content} onChange={this.handleInput}/>
          <button className="btn btn-dark" onClick={this.initAddMarkerWithIW}>Place marker</button>
        </div>
      </div>
    )
  }
}

export default MapCustomization
