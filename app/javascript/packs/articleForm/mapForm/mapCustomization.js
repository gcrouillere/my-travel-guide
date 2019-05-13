import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import $ from 'jquery'
import tempMarkerLogo from './../../../../assets/images/circle-full-black.svg'
import ajaxHelpers from './../../../utils/ajaxHelpers'

class MapCustomization extends Component {

  constructor(props) {
    super(props)
    this.state = {
      polylineOnConstruction: false,
      polyline: null,
      polylineFilled: false,
      markerOnConstruction: false,
    }
  }

  abandonCustomization = () => { this.props.abandonCustomization() }

  handleInput = (event) => {
    this.setState({content: event.target.value})
  }

  initAddMarker = (event) => {
    if (!this.state.markerOnConstruction) {
      this.setState({markerOnConstruction: true})
      this.props.preventCustomizationMix("initAddMarker")
      this.props.googleMap.addListener('click', event => { this.addMarker(event, 'click') })
    } else {
      this.props.preventCustomizationMix()
      google.maps.event.clearListeners(this.props.googleMap, 'click')
      this.setState({markerOnConstruction: false})
    }
  }

  addMarker = async (event, eventType) => {
    const markerCharacteristics = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      description: this.state.content,
      map_id: this.props.map.id,
      logo: "markerLogo"
    }

    let newMarker = await ajaxHelpers.ajaxCall('POST', "/markers/", {marker: markerCharacteristics}, this.props.token)

    google.maps.event.clearListeners(this.props.googleMap, eventType);
    this.setState({markerOnConstruction: false})
    this.props.preventCustomizationMix()
    this.props.updateMapDataList(newMarker, "markers", "add")
  }

  initPolyLine = async (event) => {
    if (!this.state.polylineOnConstruction) {

      this.props.preventCustomizationMix("initPolyLine")
      this.polyline = this.createEmptyPolyline(this.props.googleMap)
      this.props.googleMap.addListener('click', event => { this.addPolylinePoint(event, this.polyline) })
      this.setState({polylineOnConstruction: true, polyline: null})
      await this.createPolyline()

    } else {

      this.props.preventCustomizationMix()
      google.maps.event.clearListeners(this.props.googleMap, 'click');
      this.setState({polylineOnConstruction: false})

      if (this.state.polylineFilled) {
        await this.getPolyline()
        this.setState({polylineFilled: false})
      } else {
        this.deleteEmptyPolyline()
      }

    }
  }

  createEmptyPolyline(googleMap) {
    return new google.maps.Polyline({
      map: googleMap,
      strokeColor: '#495057',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      geodesic: true
    });
  }

  addPolylinePoint = async (event, polyline) => {
    var path = polyline.getPath()
    path.push(event.latLng);

    this.addTempGoogleMarker(this.props.googleMap, event)

    const data = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      position: polyline.getPath().getLength(),
      polyline_id: this.state.polyline.id
    }

    await ajaxHelpers.ajaxCall('POST', "/markers/", { marker: data }, this.props.token)

    this.setState({polylineFilled: true})
  }

  addTempGoogleMarker(googleMap, event) {
    new google.maps.Marker({
      position: event.latLng,
      map: googleMap,
      icon: {
        url: tempMarkerLogo,
        size: new google.maps.Size(24, 24),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(6,6)
      }
    })
  }

  createPolyline = async () => {
    const polyline = await ajaxHelpers.ajaxCall(
      'POST',
      "/polylines/",
      { polyline: { map_id: this.props.map.id } },
      this.props.token
    )
    this.setState({polyline: polyline})
  }

  getPolyline = async () => {
    const polyline = await ajaxHelpers.ajaxCall('GET', `/polylines/${this.state.polyline.id}`)
    this.setState({polyline: polyline})
    this.props.updateMapDataList(this.state.polyline, "polylines", "add")
  }

  deleteEmptyPolyline = async () => {
    await ajaxHelpers.ajaxCall('DELETE', `/polylines/${this.state.polyline.id}`, this.props.token)
    this.setState({polyline: null})
  }

  showCenterAsMarker = (event) => {
    this.props.updateMap({show_map_center_as_marker: event.target.value == "true"})
  }

  render() {

    return (
      <div id={`mapCustomization-${this.props.map.id}`}
      className={`mapCustomization ${this.props.customizationActive ? "active" : ""}`}>
        <div className="overflowContainer">
          {!this.props.customizationOnGoing.status &&
            <button onClick={this.abandonCustomization} className="close" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          }
          <h3>Map Customization:</h3>
          <div className="mapCenterShow mapCustomizationBlock">
            <p>Display Map Center ?</p>
            {[true, false].map(x =>
            <div key={x} className="form-check form-check-inline">
              <input className="form-check-input mapCenterShowinput" type="radio" id={`radio-${x}`}
              name="inlineRadioOptions" value={x}
              checked={this.props.map.show_map_center_as_marker == x}
              onChange={this.showCenterAsMarker}
              disabled={this.props.customizationOnGoing.status ?
                this.props.customizationOnGoing.trigger !== "showCenterAsMarker" :
                false
              }/>
              <label className="form-check-label" htmlFor={`radio-${x}`}>{x ? "Yes" : "No"}</label>
            </div>
            )}
          </div>

          <button className={`btn btn-dark mapCustomizationBlock ${this.state.markerOnConstruction ? "finishPath" : "startPath"}`}
            onClick={this.initAddMarker}
            disabled={this.props.customizationOnGoing.status ? this.props.customizationOnGoing.trigger !== "initAddMarker" : false}>

            {this.state.markerOnConstruction ? "Click on Map to place Marker" : "Add a Marker"}

            {this.state.markerOnConstruction && <p className="actionCancelInfo">Click button again to cancel action</p>}
          </button>

          <button className={`btn btn-dark mapCustomizationBlock ${this.state.polylineOnConstruction ? "finishPath" : "startPath"}`}
            onClick={this.initPolyLine}
            disabled={this.props.customizationOnGoing.status ? this.props.customizationOnGoing.trigger !== "initPolyLine" : false}>

            {this.state.polylineOnConstruction ?
              (this.state.polylineFilled ? "Finish Path" : "Click on Map to draw Path") :
              "Add a Path"
            }

            {this.state.polylineOnConstruction && !this.state.polylineFilled &&
              <p className="actionCancelInfo">Click button again to cancel action</p>
            }
          </button>

        </div>
      </div>
    )
  }
}

export default MapCustomization
