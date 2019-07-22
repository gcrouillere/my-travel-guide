import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import $ from 'jquery'
import update from 'immutability-helper'

import MapLocationInput from './../mapLocationInput'
import Marker from './mapComponent/marker'
import Polyline from './mapComponent/polyline'
import ElementResize from './../formElementManagement/elementResize'
import ajaxHelpers from './../../../utils/ajaxHelpers'
import mainHelpers from './../../../utils/mainHelpers'

class MapComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      googleMap: null,
      map: this.props.map,
      polylines: this.props.map.polylines || [],
      markers: this.props.map.markers || [],
      showCenterAsMarker: this.props.map.show_map_center_as_marker,
      resizeOrigin: null,
      initialMapHeight: null
    }
  }

  componentDidMount() { this.initMap() }

  initMap = () => {
    this.map = new google.maps.Map(document.getElementById(`map${this.props.map.id}`), {
      center: { lat: this.state.map.lat, lng: this.state.map.lng},
      zoom: this.state.map.zoom,
      mapTypeControl: true,
      zoomControl: true,
      zoomControlOptions: { position: google.maps.ControlPosition.LEFT_CENTER },
      scaleControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [ { "featureType": "poi.business", "stylers": [{ "visibility": "off" }] } ]
    });

    this.setState({googleMap: this.map})
    this.props.setGoogleMap(this.map)
    this.map.addListener('zoom_changed', event => {this.handleZoom(event, this.map)})
    this.map.addListener('dragend', event => {this.handleCenter(event, this.map)})
  }

  handleMap = (map) => { this.updateMap(map) }

  handleZoom = (event, map) => {
    let zoom = map.getZoom()
    this.updateMap({zoom: zoom})
  }

  handleCenter = (event, map) => {
    this.updateMap({lat: map.getCenter().lat(), lng: map.getCenter().lng()})
  }

  initResize = (event) => {
    const yOrigin = event.touches ? event.touches[0].screenY : event.screenY
    this.setState({ resizeOrigin: yOrigin, initialMapHeight: this.state.map.height });

    if (mainHelpers.isTouchDevice()) {
      ontouchmove = (event) => { this.resizeOnMove(event) }
      ontouchend  = () => { this.stopResizing() }
    } else {
      onmousemove = (event) => { this.resizeOnMove(event) }
      onmouseup = () => { this.stopResizing() }
    }
  }

  resizeOnMove(event) {
      let newHeight, validHeight = null
      const yMove = event.touches ? event.touches[0].screenY : event.screenY

      newHeight = (this.state.initialMapHeight + (yMove - this.state.resizeOrigin))
      validHeight = newHeight < 250 ? 250 : newHeight

      let updatedMap = update(this.state.map, {height: {$set: validHeight}})
      this.setState({map: updatedMap})
  }

  stopResizing() {
    this.setState({ resizeOrigin: null, initialMapHeight: null })
    onmousemove = null;
    this.updateMap({height: this.state.map.height})
    onmouseup = null;
  }

  async updateMap(mapCharacteristics) {
    let updatedMap = await ajaxHelpers.ajaxCall('PUT', `/maps/${this.state.map.id}`, {map: mapCharacteristics}, this.props.token)

    this.props.setMap(updatedMap)
    this.setState({map: updatedMap, showCenterAsMarker: updatedMap.show_map_center_as_marker,
      polylines: updatedMap.polylines, markers: updatedMap.markers})
    this.initMap()
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

    this.setState({ [dataType]: datas })
    this.initMap()
  }

  manageMarker = (event, googleMarker, marker) => {this.props.manageMarker(event, googleMarker, marker)}

  managePolyline = (event, googlePolyline, polyline) => {this.props.managePolyline(event, googlePolyline, polyline)}

  managePolylinePoint = (event, googlePolyline, polyline, googleMarker) => {
    this.props.managePolylinePoint(event, googlePolyline, polyline, googleMarker)
  }

  onMouseDown = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  render() {

    return (
      <div className="mapBloc">
        <ElementResize initResize={this.initResize} direction="vertical" active={this.props.active}/>
        <MapLocationInput id={this.props.map.id} location={this.state.map.name} handleMap={this.handleMap}/>
        <div id={`map${this.state.map.id}`} className="googleMap" style={{ width: '100%', height: `${this.state.map.height}px` }}
        onMouseDown={this.onMouseDown}>
          {this.state.showCenterAsMarker &&
            <Marker googleMap={this.state.googleMap} map={this.state.map}
            marker={{
              lat: this.state.map.lat,
              lng: this.state.map.lng,
              description: this.state.map.name,
              logo: "markerLogo",
              mapCenter: true
            }}
            manageMarker={this.manageMarker} updateMapDataList={this.updateMapDataList}/>
          }
          {this.state.markers.map(marker =>
            <Marker key={`marker${marker.id}`} googleMap={this.state.googleMap} map={this.state.map} marker={marker}
            manageMarker={this.manageMarker} updateMapDataList={this.updateMapDataList} token={this.props.token}/>
          )}
          {this.state.polylines.map(polyline =>
            <Polyline key={`polyline${polyline.id}`} googleMap={this.state.googleMap} map={this.state.map} polyline={polyline}
            managePolyline={this.managePolyline} updateMapDataList={this.updateMapDataList} token={this.props.token}
            managePolylinePoint={this.managePolylinePoint}/>
          )}
        </div>
      </div>
    )
  }
}

MapComponent.propTypes = {
  map: PropTypes.object.isRequired,
  polylines: PropTypes.array,
  markers: PropTypes.array,
  token: PropTypes.string.isRequired,
  customizationOnGoing: PropTypes.object.isRequired,
  manageMarker: PropTypes.func.isRequired,
  managePolyline: PropTypes.func.isRequired,
  managePolylinePoint: PropTypes.func.isRequired,
  setGoogleMap: PropTypes.func.isRequired,
  setMap: PropTypes.func.isRequired,
  updateMap: PropTypes.func.isRequired,
  preventCustomizationMix: PropTypes.func.isRequired,

}

export default MapComponent
