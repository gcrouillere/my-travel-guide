import React, { Component } from 'react';
import $ from 'jquery'
import update from 'immutability-helper'
import DropZone from './dropZone'
import DragVisualElements from './dragVisualElements'
import MapLocationInput from './mapLocationInput'
import DeleteButton from './deleteButton'
import ElementResize from './elementResize'
import Marker from './marker'
import MapCustomization from './mapCustomization'
import MarkerCustomization from './markerCustomization'

class MapForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      markers: this.props.map.markers || [],
      map: this.props.map,
      position: this.props.position,
      id: this.props.id,
      name: this.props.name,
      googleMap: null,
    }
  }

  componentDidMount() {
    this.initAutoComplete()
    this.initMap()
  }

  initAutoComplete = () => {
    var mapLocation = document.getElementById(`mapLocation${this.props.map.id}`)
    this.autocomplete = new google.maps.places.Autocomplete((mapLocation), {types: ['geocode']});
    let userInput = ""
    google.maps.event.addDomListener(mapLocation, 'keydown', function(event) {
      if (event.key === "Enter") event.preventDefault(); // Do not submit the form on Enter.
    });
    google.maps.event.addDomListener(mapLocation, 'keyup', function(event) {
      userInput = event.target.value
    });
    this.autocomplete.addListener('place_changed', event => this.handlePlaceSelect(event, userInput));
  }

  handlePlaceSelect = (event, userInput) => {
    let place = this.autocomplete.getPlace();
    let map = {}
    let name = ""
    if (place.address_components) {
      map = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng(), zoom: this.state.map.zoom}
      name = place.formatted_address
    } else {
      map = {lat: 0, lng: 0, zoom: this.state.map.zoom}
      name = userInput
    }
    this.updateMap({lat: map.lat, lng: map.lng, name: name})
  }

  initMap = () => {
    this.map = new google.maps.Map(document.getElementById(`map${this.state.map.id}`), {
      center: { lat: this.state.map.lat, lng: this.state.map.lng},
      zoom: this.state.map.zoom
    });
    this.setState({googleMap: this.map})
    this.map.addListener('zoom_changed', event => {this.handleZoom(event, this.map)})
    this.map.addListener('mousedown', event => {this.displayMapCustomizationMenu(event, this.map)});
    this.map.addListener('dragend', event => {this.handleCenter(event, this.map)})
  }

  handleZoom = (event, map) => {
    let zoom = map.getZoom()
    this.updateMap({zoom: zoom})
  }

  displayMapCustomizationMenu = (event) => {
    document.getElementById(`mapCustomization-${this.state.map.id}`).classList.add("active")
  }

  handleCenter = (event, map) => {
    this.updateMap({lat: map.getCenter().lat(), lng: map.getCenter().lng()})
  }

  initResize = (event) => {
    let map = document.getElementById(`map${this.props.map.id}`)
    let originalcursorPosition = event.screenY
    let initialMapHeight = this.state.map.height
    let newHeight, validHeight = null
    onmousemove = (event) => {
       newHeight = (initialMapHeight + (event.screenY - originalcursorPosition))
       validHeight = newHeight < 150 ? 150 : newHeight
       map.style.height = `${validHeight}px`
    }
    onmouseup = () => {
      onmousemove = null;
      this.updateMap({height: validHeight})
      onmouseup = null;
    }
  }

  updateMarkersList = (marker, action) => {
    let markers = {}
    if (action == "add") {
      markers = update(this.state.markers, {$splice: [[0, 0, marker]]})
    } else if (action == "delete") {
      let markerIndex = this.state.markers.findIndex(x => x.id == marker.id)
      markers = update(this.state.markers, {$splice: [[markerIndex, 1]]})
    } else if (action == "change") {
      let markerIndex = this.state.markers.findIndex(x => x.id == marker.id)
      markers = update(this.state.markers, {$splice: [[markerIndex, 1, marker]]})
    }
    this.setState({markers: markers})
    this.initMap();
  }

  deleteElement = (event) => {this.props.deleteElement(event, this.props.id, this.props.position, "maps")}

  updateMap(mapCharacteristics) {
    $.ajax({
      method: 'PUT',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/maps/${this.state.map.id}`,
      dataType: "JSON",
      data: {map: mapCharacteristics}
    }).done((data) => {
      this.setState({map: data})
      this.initMap();
      this.initAutoComplete()
    }).fail((data) => {
      console.log(data)
    })
  }

  manageMarker = (event, googleMarker, marker) => { this.refs.markerCustomization.initMarkerCustomization(event, googleMarker, marker) }

  onDragStart = (event) => {this.props.onDragStart(event, this.props.id, this.props.position, this.props.map)}

  onDragOver = (event) => {this.props.onDragOver(event, this.props.id, this.props.position)}

  onDragEnter = (event) => {this.props.onDragEnter(event, this.props.id, this.props.position)}

  onDragLeave = (event) => {this.props.onDragLeave(event, this.props.id, this.props.position)}

  onDrop = (event) => {this.props.onDrop(event, this.props.id, this.props.position)}

  onMouseDown = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  render() {

    return (
      <div id={`content-${this.props.position}`} className="mapInput" draggable
        onDragStart={this.onDragStart}
        onDragOver={this.onDragOver}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}>
        <DeleteButton deleteElement={this.deleteElement}/>
        <DragVisualElements />
        <ElementResize initResize={this.initResize}/>
        <DropZone area={"before"} onDrop={this.onDrop}/>
        <MapCustomization googleMap={this.state.googleMap} map={this.state.map} updateMarkersList= {this.updateMarkersList}
        initAddSimpleMarker={this.initAddSimpleMarker} initAddMarkerWithIW={this.initAddMarkerWithIW}/>
        <MarkerCustomization googleMap={this.state.googleMap} map={this.state.map} ref="markerCustomization"
        updateMarkersList={this.updateMarkersList}/>
        <div className="mapBloc">
          <MapLocationInput id={this.props.map.id} location={this.state.name}/>
          <div id={`map${this.props.map.id}`} className="googleMap" style={{ width: '100%', height: `${this.state.map.height}px` }} onMouseDown={this.onMouseDown}>
            {this.state.markers.map(marker =>
              <Marker key={marker.id} googleMap={this.state.googleMap} map={this.state.map} marker={marker}
              manageMarker={this.manageMarker}/>
            )}
          </div>
        </div>
        <DropZone area={"after"} onDrop={this.onDrop}/>
      </div>
    );
  }
}

export default MapForm
