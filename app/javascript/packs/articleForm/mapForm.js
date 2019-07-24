import React, { Component } from 'react'
import PropTypes from 'prop-types'

import DropZone from './formElementManagement/dropZone'
import DragVisualElements from './formElementManagement/dragVisualElements'
import DeleteButton from './formElementManagement/deleteButton'
import MapComponent from './mapForm/mapComponent'
import MapCustomization from './mapForm/mapCustomization'
import MarkerCustomization from './mapForm/markerCustomization'
import PolylineCustomization from './mapForm/polylineCustomization'
import ShowSecondContentButton from './formElementManagement/showSecondContentButton'

class MapForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      position: this.props.position,
      map: this.props.map,
      googleMap: null,
      customizationOnGoing: {status: false, trigger: null},
      customizationActive: false
    }
    this.polylineCustomizationRef = React.createRef()
    this.markerCustomizationRef = React.createRef()
    this.mapComponentRef = React.createRef()
  }

  setGoogleMap = (googleMap) => { this.setState({ googleMap: googleMap }) }

  setMap = (map) => { this.setState({ map: map }) }

  preventCustomizationMix = (trigger) => {
    this.props.preventDraggingOnOtherElements(trigger)
    this.setState({customizationOnGoing: {status: !this.state.customizationOnGoing.status, trigger: trigger}})
  }

  updateMap = (mapCharacteristics) => {this.mapComponentRef.current.updateMap(mapCharacteristics)}

  updateMapDataList = (data, dataType, action) => { this.mapComponentRef.current.updateMapDataList(data, dataType, action) }

  manageMarker = (event, googleMarker, marker) => {
    this.markerCustomizationRef.current.initMarkerCustomization(event, googleMarker, marker)
  }

  managePolyline = (event, googlePolyline, polyline) => {
    this.polylineCustomizationRef.current.initPolylineCustomization(event, googlePolyline, polyline)
  }

  managePolylinePoint = (event, googlePolyline, polyline, googleMarker) => {
    this.polylineCustomizationRef.current.initPolylineCustomization(event, googlePolyline, polyline, googleMarker)
  }

  deleteElement = (event) => {this.props.deleteElement(event, this.props.id, this.props.position, "maps")}

  onDragStart = (event) => {
    if (this.props.draggable) {
      this.setState({customizationActive: false})
      this.markerCustomizationRef.current.hideMarkerCustomization()
      this.polylineCustomizationRef.current.hidePolylineCustomization()
      this.props.onDragStart(event, this.props.id, this.props.position, this.props.map)
    }
  }

  onDragOver = (event) => {this.props.onDragOver(event, this.props.id, this.props.position)}

  onDragEnter = (event) => {this.props.onDragEnter(event, this.props.id, this.props.position)}

  onDragLeave = (event) => {this.props.onDragLeave(event, this.props.id, this.props.position)}

  onDrop = (event) => {this.props.onDrop(event, this.props.id, this.props.position)}

  activeCustomization = () => { this.setState({customizationActive: true}) }

  abandonCustomization = () => { this.setState({customizationActive: false}) }

  hidePolylineCustomization = () => {this.polylineCustomizationRef.current.hidePolylineCustomization()}

  hideMarkerCustomization = () => {this.markerCustomizationRef.current.hideMarkerCustomization()}

  hideMapCustomizations = () => {
    this.abandonCustomization()
    this.hidePolylineCustomization()
    this.hideMarkerCustomization()
  }

  initMoveUp = () => {
    this.markerCustomizationRef.current.hideMarkerCustomization()
    this.polylineCustomizationRef.current.hidePolylineCustomization()
    this.props.moveUp(this.props.id, this.props.position)
  }

  initMoveDown = () => {
    this.polylineCustomizationRef.current.hidePolylineCustomization()
    this.markerCustomizationRef.current.hideMarkerCustomization()
    this.props.moveDown(this.props.id, this.props.position)
  }

  activateSecondContent = () => { this.props.activateSecondContent(this.state.active) }

  render() {

    return (
      <div id={`map-content-${this.props.id}`}
        className={`mapInput ${this.props.dragging ? "dragging" : ""} ${this.props.draggingElement ? "draggingElement" : ""}
        ${!this.props.draggable && this.props.position === 0 ? "firstContent" : "secondContent"}`}
        style={{ height: `${!this.props.height - 69}px`}}
        draggable={!this.state.customizationOnGoing.status && this.props.draggable}
        onDragStart={this.onDragStart}
        onDragOver={this.onDragOver}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}>

        { !this.props.draggable &&
          <ShowSecondContentButton activateSecondContent={this.activateSecondContent}/>
        }

        <DeleteButton deleteElement={this.deleteElement} active={this.props.draggable}/>

        <DragVisualElements map={this.state.map} activeCustomization={this.activeCustomization}
        initMoveDown={this.initMoveDown} initMoveUp={this.initMoveUp} active={this.props.draggable}/>

        <DropZone area={"before"} onDrop={this.onDrop} dropTarget={this.props.dropTarget} active={this.props.draggable}/>

        <MapCustomization googleMap={this.state.googleMap} map={this.state.map} token={this.props.token}
        customizationOnGoing={this.state.customizationOnGoing}
        updateMapDataList={this.updateMapDataList} updateMap={this.updateMap}
        preventCustomizationMix={this.preventCustomizationMix}
        customizationActive={this.state.customizationActive} abandonCustomization={this.abandonCustomization}/>

        <MarkerCustomization googleMap={this.state.googleMap} map={this.state.map} token={this.props.token}
        customizationOnGoing={this.state.customizationOnGoing} hidePolylineCustomization={this.hidePolylineCustomization}
        updateMapDataList={this.updateMapDataList} updateMap={this.updateMap} ref={this.markerCustomizationRef}/>

        <PolylineCustomization googleMap={this.state.googleMap} map={this.state.map}
        token={this.props.token} customizationOnGoing={this.state.customizationOnGoing}
        hideMarkerCustomization={this.hideMarkerCustomization}
        updateMapDataList={this.updateMapDataList} preventCustomizationMix={this.preventCustomizationMix}
        ref={this.polylineCustomizationRef}/>

        <MapComponent map={this.state.map} polylines={this.state.map.polylines}
        markers={this.state.map.markers} token={this.props.token} active={this.props.draggable}
        customizationOnGoing={this.state.customizationOnGoing} manageMarker={this.manageMarker}
        managePolyline={this.managePolyline} managePolylinePoint={this.managePolylinePoint}
        handleZoom={this.handleZoom} setGoogleMap={this.setGoogleMap} setMap={this.setMap}
        preventCustomizationMix={this.preventCustomizationMix} updateMap={this.updateMap}
        ref={this.mapComponentRef}/>

        <DropZone area={"after"} onDrop={this.onDrop} dropTarget={this.props.dropTarget} active={this.props.draggable}/>
      </div>
    );
  }
}

MapForm.propTypes = {
  id: PropTypes.number.isRequired,
  position: PropTypes.number.isRequired,
  map: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
  onDragEnter: PropTypes.func.isRequired,
  onDragLeave: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  deleteElement: PropTypes.func,
  preventDraggingOnOtherElements: PropTypes.func,
  draggingElement: PropTypes.bool.isRequired,
  dragging: PropTypes.bool.isRequired,
  dropTarget: PropTypes.object
}

export default MapForm
