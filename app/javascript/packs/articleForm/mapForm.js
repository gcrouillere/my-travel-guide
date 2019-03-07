import React, { Component } from 'react';
import $ from 'jquery'
import update from 'immutability-helper'
import DropZone from './dropZone'

class MapForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      markers: this.props.map.markers || [],
      map: this.props.map,
      position: this.props.position,
      id: this.props.id
    }
  }

  componentDidMount() {
    this.initAutoComplete()
    this.initMap()
  }

  initAutoComplete = () => {
    var mapLocation = document.getElementById(`mapLocation${this.props.map.id}`)
    this.autocomplete = new google.maps.places.Autocomplete((mapLocation), {types: ['geocode']});
    google.maps.event.addDomListener(mapLocation, 'keydown', function(event) {
      if (event.key === "Enter") event.preventDefault(); // Do not submit the form on Enter.
    });
    this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
  }

  initMap = () => {
    this.map = new google.maps.Map(document.getElementById(`map${this.state.map.id}`), {
      center: { lat: this.state.map.lat, lng: this.state.map.lng},
      zoom: this.state.map.zoom
    });
    this.state.markers.map((marker) => {
      var googleMarker = new google.maps.Marker({
        position: {lat: marker.lat, lng: marker.lng},
        map: this.map,
      });
    })
    this.map.addListener('click', event => {this.addMarker(event, this.map)});
    this.map.addListener('zoom_changed', event => {this.handleZoom(event, this.map)})
  }

  handlePlaceSelect = () => {
    let place = this.autocomplete.getPlace();
    let map = {}
    if (place.address_components) {
      map = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), zoom: this.state.map.zoom}
    } else {
      map = {lat: 0, lng: 0, zoom: this.state.map.zoom}
    }
    $.ajax({
      method: 'PUT',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/maps/${this.state.map.id}`,
      dataType: "JSON",
      data: {map: {lat: map.lat, lng: map.lng}}
    }).done((data) => {
      this.setState({map: data})
      this.initMap();
      this.initAutoComplete()
    }).fail((data) => {
      console.log(data)
    })
  }

  addMarker = (event, map) => {
    $.ajax({
      method: 'POST',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/markers/`,
      dataType: "JSON",
      data: {marker: {lat: event.latLng.lat(), lng: event.latLng.lng(), map_id: this.state.map.id}}
    }).done((data) => {
      const markers = update(this.state.markers, {$splice: [[0, 0, data]]})
      this.setState({markers: markers})
      this.initMap();
    }).fail((data) => {
      console.log(data)
    })
  }

  handleZoom = (event, map) => {
    let zoom = map.getZoom()
    $.ajax({
      method: 'PUT',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/maps/${this.state.map.id}`,
      dataType: "JSON",
      data: {map: {zoom: zoom}}
    }).done((data) => {
      this.setState({map: data})
      this.initMap();
      this.initAutoComplete()
    }).fail((data) => {
      console.log(data)
    })
  }

  onDragStart = (event) => {this.props.onDragStart(event, this.props.id, this.props.position)}

  onDragOver = (event) => {this.props.onDragOver(event, this.props.id, this.props.position)}

  onDragEnter = (event) => {this.props.onDragEnter(event, this.props.id, this.props.position)}

  onDragLeave = (event) => {this.props.onDragLeave(event, this.props.id, this.props.position)}

  onDrop = (event) => {this.props.onDrop(event, this.props.id, this.props.position)}

  render() {
    return (
      <div draggable id={`content-${this.props.position}`}
        onDragStart={this.onDragStart}
        onDragOver={this.onDragOver}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}>
        <DropZone draggable area={"before"} onDrop={this.onDrop}/>
        <div className="mapBloc">
          <div className="mapLocation">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-default">Map's center</span>
              </div>
              <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" id={`mapLocation${this.props.map.id}`}/>
            </div>
          </div>
          <div id={`map${this.props.map.id}`} style={{ width: '100%', height: 150 }}></div>
        </div>
        <DropZone draggable area={"after"} onDrop={this.onDrop}/>
      </div>
    );
  }
}

export default MapForm
