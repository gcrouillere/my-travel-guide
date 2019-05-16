import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import update from 'immutability-helper'
import $ from 'jquery'
import tempMarkerLogo from './../../../../assets/images/circle-full-black.svg'
import ajaxHelpers from './../../../utils/ajaxHelpers'

class PolylineCustomization extends Component {
  constructor(props) {
    super(props)
    this.state = {
      googlePolyline: null,
      polyline: null,
      polylineMarkers: null,
      distanceDisplayed: null,
      polylineOnConstruction: false,
      polylineFilled: false,
      markerClicked: null,
      markerToDelete: false,
      polylineCustomizationActive: false
    }
  }

  initPolylineCustomization = (event, googlePolyline, polyline, googleMarker) => {
    if (!this.props.customizationOnGoing.status) {
      this.setState({polylineCustomizationActive: true})
      this.props.hideMarkerCustomization()
      if (!this.state.polylineOnConstruction) {
        this.setState({
          googlePolyline: googlePolyline,
          polyline: polyline,
          polylineMarkers: polyline.markers,
          distanceDisplayed: polyline.distance_displayed
        })
      }
    }
    if (googleMarker) {
      this.setState({markerClicked: googleMarker}, () => {
      })
      if (this.state.markerToDelete) this.deletePointFromPath()
    }
  }

  hidePolylineCustomization = () => { this.setState({ polylineCustomizationActive: false }) }

  distanceDisplay = (event) => {
    this.setState({distanceDisplayed: event.target.value == "true"})
    this.updatePolyline({distance_displayed: event.target.value == "true"})
  }

  updatePolyline = async (polylineCharacteristic) => {
    const newPolyline = await ajaxHelpers.ajaxCall(
      'PUT',
      `/polylines/${this.state.polyline.id}`,
      {polyline: polylineCharacteristic},
      this.props.token
    )

    this.setState({googlePolyline: null, polyline: null, distanceDisplayed: null, polylineCustomizationActive: false})
    this.props.updateMapDataList(newPolyline, "polylines", "change")
  }

  initcontinuePath = () => {
    if (this.state.polylineOnConstruction) {
      this.props.preventCustomizationMix()
      this.setState({polylineOnConstruction: false, polylineFilled: false, polylineCustomizationActive: false})
      google.maps.event.clearListeners(this.props.googleMap, 'click')
      this.props.updateMapDataList(this.state.polyline, "polylines", "change")
    } else {
      this.setState({polylineOnConstruction: true})
      this.props.preventCustomizationMix("initcontinuePath")
      this.props.googleMap.addListener('click', event => { this.continuePath(event, this.state.googlePolyline) })
    }
  }

  continuePath = async (event, googlePolyline) => {
    this.setState({polylineFilled: true})

    var path = googlePolyline.getPath()
    path.push(event.latLng);
    var polylineMarkerCount = googlePolyline.getPath().getLength()

    this.createTempMarker(event, this.props.googleMap)

    const newMarker = await ajaxHelpers.ajaxCall(
      'POST',
      "/markers/",
      { marker: {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        position: polylineMarkerCount,
        polyline_id: this.state.polyline.id}
      },
      this.props.token
    )

    let markerIndex = newMarker.position
    let polylineMarkers = update(this.state.polylineMarkers, {$splice: [[markerIndex, 1, newMarker]]})
    let polyline = update(this.state.polyline, {markers: {$set: polylineMarkers}})
    this.setState({polylineMarkers: polylineMarkers, polyline: polyline})
  }

  createTempMarker(event, googleMap) {
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

  initDeletePointFromPath = () => {
    this.props.preventCustomizationMix("initDeletePointFromPath")
    this.setState({markerToDelete: !this.state.markerToDelete})
  }

  deletePointFromPath = async () => {
    const deletedMarker = await ajaxHelpers.ajaxCall('DELETE', `/markers/${this.state.markerClicked.appMarker.id}`, {},
      this.props.token)

    let markerIndex = this.state.polylineMarkers.findIndex(x => x.id == deletedMarker.id)
    let polylineMarkers = update(this.state.polylineMarkers, {$splice: [[markerIndex, 1]]})
    let polyline = update(this.state.polyline, {markers: {$set: polylineMarkers}})

    this.setState({polylineMarkers: polylineMarkers, polyline: polyline, markerToDelete: false, polylineCustomizationActive: false})
    this.props.preventCustomizationMix()
    this.props.updateMapDataList(this.state.polyline, "polylines", "change")
  }

  deletePolyline = async () => {
    const deletedPolyline = await ajaxHelpers.ajaxCall('DELETE', `/polylines/${this.state.polyline.id}`, {}, this.props.token)

    this.setState({googlePolyline: null, polyline: null, distanceDisplayed: null, polylineCustomizationActive: false})
    this.props.updateMapDataList(deletedPolyline, "polylines",  "delete")
  }

  render() {
    return (
      <div id={`polylineCustomization-${this.props.map.id}`}
      className={`polylineCustomization ${this.state.polylineCustomizationActive ? "active" : ""}`}>
        <div className="overflowContainer">
          {!this.props.customizationOnGoing.status &&
          <button onClick={this.hidePolylineCustomization} className="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          }
          <h3>Path Customization:</h3>
          <div className="distanceDisplayRadios mapCustomizationBlock">
            <p>Display path length ?</p>
            {[true, false].map(x =>
            <div key={x} className="form-check form-check-inline">
              <input className="form-check-input markerLogoInput" type="radio" id={`radio-${x}`} name="inlineRadioOptions" value={x}
              checked={this.state.distanceDisplayed == null ? false : this.state.distanceDisplayed == x}
              onChange={this.distanceDisplay}
              disabled={this.props.customizationOnGoing.status ? this.props.customizationOnGoing.trigger !== "distanceDisplay" : false}/>
              <label className="form-check-label" htmlFor={`radio-${x}`}>{x ? "Yes" : "No"}</label>
            </div>
            )}
          </div>
          <button className={`btn btn-dark mapCustomizationBlock ${this.state.polylineOnConstruction ? "finishPath" : "startPath"}`}
            onClick={this.initcontinuePath}
            disabled={this.props.customizationOnGoing.status ? this.props.customizationOnGoing.trigger !== "initcontinuePath" : false}>
            {this.state.polylineOnConstruction ?
              (this.state.polylineFilled ? "Finish Path" : "Click on Map to continue Path")
               : "Continue Path"
             }

            {this.state.polylineOnConstruction &&
              !this.state.polylineFilled && <p className="actionCancelInfo">Click button again to cancel action</p>
            }
          </button>
          <button className={`btn btn-dark mapCustomizationBlock ${this.state.markerToDelete ? "finishPath" : "startPath"}`}
            onClick={this.initDeletePointFromPath}
            disabled={this.props.customizationOnGoing.status ? this.props.customizationOnGoing.trigger !== "initDeletePointFromPath" : false}>
            {`${this.state.markerToDelete ? "Click on Point to delete" : "Delete a Point from Path"}`}

            {this.state.markerToDelete &&
              <p className="actionCancelInfo">Click button again to cancel action</p>
            }
          </button>
          <button className="btn btn-dark" onClick={this.deletePolyline}
          disabled={this.props.customizationOnGoing.status ? this.props.customizationOnGoing.trigger !== "deletePolyline" : false}>
            Delete Path
          </button>
        </div>
      </div>
    )
  }
}

export default PolylineCustomization
