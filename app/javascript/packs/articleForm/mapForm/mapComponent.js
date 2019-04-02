import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import MapLocationInput from './mapComponent/mapLocationInput'
import Marker from './mapComponent/marker'
import Polyline from './mapComponent/polyline'
import ElementResize from './../formElementManagement/elementResize'
import $ from 'jquery'
import update from 'immutability-helper'

class MapComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      googleMap: null,
      map: this.props.map,
      polylines: this.props.map.polylines || [],
      markers: this.props.map.markers || []
    }
  }

  componentDidMount() {
    this.initMap()
    this.initAutoComplete()
  }

  initMap = () => {
    this.map = new google.maps.Map(document.getElementById(`map${this.props.map.id}`), {
      center: { lat: this.state.map.lat, lng: this.state.map.lng},
      zoom: this.state.map.zoom
    });

    this.setState({googleMap: this.map})
    this.props.setGoogleMap(this.map)
    this.map.addListener('zoom_changed', event => {this.handleZoom(event, this.map)})
    this.map.addListener('mousedown', event => {this.displayMapCustomizationMenu(event, this.map)});
    this.map.addListener('dragend', event => {this.handleCenter(event, this.map)})
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

  handleZoom = (event, map) => {
    let zoom = map.getZoom()
    this.updateMap({zoom: zoom})
  }

  handleCenter = (event, map) => {
    this.updateMap({lat: map.getCenter().lat(), lng: map.getCenter().lng()})
  }

  initResize = (event) => {
    let map = document.getElementById(`map${this.state.map.id}`)
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

  displayMapCustomizationMenu = (event) => {
    document.getElementById(`mapCustomization-${this.state.map.id}`).classList.add("active")
  }

  updateMap(mapCharacteristics) {
    $.ajax({
      method: 'PUT',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/maps/${this.state.map.id}`,
      dataType: "JSON",
      data: {map: mapCharacteristics}
    }).done((data) => {
      this.props.setMap(data)
      this.setState({map: data})
      this.initMap()
      this.initAutoComplete()
    }).fail((data) => {
      console.log(data)
    })
  }

  updateMapDataList = (data, dataType, action) => {
    let datas = {}

    if (action == "add") {
      datas = update(this.state[dataType], {$splice: [[0, 0, data]]})
    } else if (action == "delete") {
      let dataIndex = this.state[dataType].findIndex(x => x.id == data.id)
      datas = update(this.state[dataType], {$splice: [[dataIndex, 1]]})
    } else if (action == "change") {
      let dataIndex = this.state[dataType].findIndex(x => x.id == data.id)
      datas = update(this.state[dataType], {$splice: [[dataIndex, 1, data]]})
    }

    this.setState({[dataType]: datas})
    this.initMap()
  }

  manageMarker = (event, googleMarker, marker) => {this.props.manageMarker(event, googleMarker, marker)}

  managePolyline = (event, googlePolyline, polyline) => {this.props.managePolyline(event, googlePolyline, polyline)}

  onMouseDown = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  render() {

    return (
      <div className="mapBloc">
        <ElementResize initResize={this.initResize}/>
        <MapLocationInput id={this.props.map.id} location={this.state.map.name}/>
        <div id={`map${this.state.map.id}`} className="googleMap" style={{ width: '100%', height: `${this.state.map.height}px` }} onMouseDown={this.onMouseDown}>
          {this.state.markers.map(marker =>
            <Marker key={`marker${marker.id}`} googleMap={this.state.googleMap} map={this.state.map} marker={marker}
            manageMarker={this.manageMarker} updateMapDataList={this.updateMapDataList}/>
          )}
          {this.state.polylines.map(polyline =>
            <Polyline key={`polyline${polyline.id}`} googleMap={this.state.googleMap} map={this.state.map} polyline={polyline}
            managePolyline={this.managePolyline}/>
          )}
        </div>
      </div>
    )
  }
}

export default MapComponent
