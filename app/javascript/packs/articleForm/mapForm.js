import React, { Component } from 'react'
import DropZone from './formElementManagement/dropZone'
import DragVisualElements from './formElementManagement/dragVisualElements'
import DeleteButton from './formElementManagement/deleteButton'
import MapComponent from './mapForm/mapComponent'
import MapCustomization from './mapForm/mapCustomization'
import MarkerCustomization from './mapForm/markerCustomization'
import PolylineCustomization from './mapForm/polylineCustomization'

class MapForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      position: this.props.position,
      map: this.props.map,
      googleMap: null,
      customizationOnGoing: {status: false, trigger: null}
    }
  }

  setGoogleMap = (googleMap) => {this.setState({googleMap: googleMap})}

  setMap = (map) => {this.setState({map: map})}

  preventCustomizationMix = (trigger) => {
    this.props.preventDraggingOnOtherElements(trigger)
    this.setState({customizationOnGoing: {status: !this.state.customizationOnGoing.status, trigger: trigger}})
  }

  updateMapDataList = (data, dataType, action) => { this.refs.mapComponent.updateMapDataList(data, dataType, action) }

  manageMarker = (event, googleMarker, marker) => { this.refs.markerCustomization.initMarkerCustomization(event, googleMarker, marker) }

  managePolyline = (event, googlePolyline, polyline) => { this.refs.polylineCustomization.initPolylineCustomization(event, googlePolyline, polyline) }

  managePolylinePoint = (event, googlePolyline, polyline, googleMarker) => { this.refs.polylineCustomization.initPolylineCustomization(event, googlePolyline, polyline, googleMarker) }

  deleteElement = (event) => {this.props.deleteElement(event, this.props.id, this.props.position, "maps")}

  onDragStart = (event) => {
    document.querySelectorAll(".mapCustomization, .markerCustomization, .polylineCustomization").forEach(x => {x.classList.remove("active")})
    this.props.onDragStart(event, this.props.id, this.props.position, this.props.map)
  }

  onDragOver = (event) => {this.props.onDragOver(event, this.props.id, this.props.position)}

  onDragEnter = (event) => {this.props.onDragEnter(event, this.props.id, this.props.position)}

  onDragLeave = (event) => {this.props.onDragLeave(event, this.props.id, this.props.position)}

  onDrop = (event) => {this.props.onDrop(event, this.props.id, this.props.position)}

  render() {

    return (
      <div id={`content-${this.props.position}`} className="mapInput" draggable={!this.state.customizationOnGoing.status}
        onDragStart={this.onDragStart}
        onDragOver={this.onDragOver}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}>
        <DeleteButton deleteElement={this.deleteElement}/>
        <DragVisualElements />
        <DropZone area={"before"} onDrop={this.onDrop}/>
        <MapCustomization googleMap={this.state.googleMap} map={this.state.map} customizationOnGoing={this.state.customizationOnGoing}
        updateMapDataList= {this.updateMapDataList} initAddSimpleMarker={this.initAddSimpleMarker}
        initAddMarkerWithIW={this.initAddMarkerWithIW} updateMapDataList={this.updateMapDataList}
        preventCustomizationMix={this.preventCustomizationMix}/>
        <MarkerCustomization googleMap={this.state.googleMap} map={this.state.map} customizationOnGoing={this.state.customizationOnGoing}
        updateMapDataList={this.updateMapDataList} ref="markerCustomization"/>
        <PolylineCustomization googleMap={this.state.googleMap} map={this.state.map} ref="polylineCustomization"
        customizationOnGoing={this.state.customizationOnGoing} updateMapDataList={this.updateMapDataList}
        preventCustomizationMix={this.preventCustomizationMix}/>
       <MapComponent map={this.props.map} polylines={this.props.map.polylines} customizationOnGoing={this.state.customizationOnGoing}
        markers={this.props.map.markers} manageMarker={this.manageMarker} managePolyline={this.managePolyline} managePolylinePoint={this.managePolylinePoint}
        handleZoom={this.handleZoom} handleCenter={this.handleCenter} setGoogleMap={this.setGoogleMap} setMap={this.setMap}
        preventCustomizationMix={this.preventCustomizationMix} ref="mapComponent"/>
        <DropZone area={"after"} onDrop={this.onDrop}/>
      </div>
    );
  }
}

export default MapForm
