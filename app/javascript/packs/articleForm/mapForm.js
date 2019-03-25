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

  initMap = () => {
    this.map = new google.maps.Map(document.getElementById(`map${this.state.map.id}`), {
      center: { lat: this.state.map.lat, lng: this.state.map.lng},
      zoom: this.state.map.zoom
    });
    this.setState({googleMap: this.map})
    this.map.addListener('click', event => {this.displayMapCustomizationMenu(event, this.map)});
    this.map.addListener('zoom_changed', event => {this.handleZoom(event, this.map)})
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

  displayMapCustomizationMenu = (event) => {
    document.querySelector(".mapCustomization").classList.add("active")
  }

  handleZoom = (event, map) => {
    let zoom = map.getZoom()
    this.updateMap({zoom: zoom})
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
    }
  }

  initAddSimpleMarker = (event) => {
    this.state.googleMap.addListener('click', event => {
      this.addMarker(event,
        {lat: event.latLng.lat(), lng: event.latLng.lng(), map_id: this.state.map.id}
    )});
  }

  initAddMarkerWithIW = (event, content) => {
    console.log(event.target)
    this.state.googleMap.addListener('click', event => {
      this.addMarker(event,
        {lat: event.latLng.lat(), lng: event.latLng.lng(), description: content, map_id: this.state.map.id}
    )});
    document.querySelector(".infoWindowContent").classList.remove("active")
  }

  addMarker = (event, markerCharacteristics) => {
    console.log(markerCharacteristics)
    $.ajax({
      method: 'POST',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/markers/`,
      dataType: "JSON",
      data: {marker: markerCharacteristics}
    }).done((data) => {
      const markers = update(this.state.markers, {$splice: [[0, 0, data]]})
      this.setState({markers: markers})
      this.initMap();
    }).fail((data) => {
      console.log(data)
    })
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

  onDragStart = (event) => {this.props.onDragStart(event, this.props.id, this.props.position, this.props.map)}

  onDragOver = (event) => {this.props.onDragOver(event, this.props.id, this.props.position)}

  onDragEnter = (event) => {this.props.onDragEnter(event, this.props.id, this.props.position)}

  onDragLeave = (event) => {this.props.onDragLeave(event, this.props.id, this.props.position)}

  onDrop = (event) => {this.props.onDrop(event, this.props.id, this.props.position)}

  onMapDragStart = (event) => {
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
        <MapCustomization initAddSimpleMarker={this.initAddSimpleMarker} initAddMarkerWithIW={this.initAddMarkerWithIW}/>
        <div className="mapBloc">
          <MapLocationInput id={this.props.map.id} location={this.state.name}/>
          <div id={`map${this.props.map.id}`} style={{ width: '100%', height: `${this.state.map.height}px` }}
          onMouseDown={this.onMapDragStart}>
            {this.state.markers.map(marker =>
              <Marker key={marker.id} googleMap={this.state.googleMap} marker={marker}/>
            )}
          </div>
        </div>
        <DropZone area={"after"} onDrop={this.onDrop}/>
      </div>
    );
  }
}

export default MapForm
