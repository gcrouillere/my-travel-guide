import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import $ from 'jquery'

class PolylineCustomization extends Component {
  constructor(props) {
    super(props)
    this.state = {
      googlePolyline: null,
      polyline: null,
      distanceDisplayed: null
    }
  }

  abandonPolylineCustomization = () => { document.getElementById(`polylineCustomization-${this.props.map.id}`).classList.remove("active") }

  initPolylineCustomization = (event, googlePolyline, polyline) => {
    document.getElementById(`polylineCustomization-${this.props.map.id}`).classList.add("active")
    this.setState({googlePolyline: googlePolyline, polyline: polyline, distanceDisplayed: polyline.distance_displayed})
  }

  distanceDisplay = (event) => {
    this.setState({distance_displayed: event.target.value == "true"})
    this.updatePolyline({distance_displayed: event.target.value == "true"})
  }

  updatePolyline = (polylineCharacteristic) => {
    $.ajax({
      method: 'PUT',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/polylines/${this.state.polyline.id}`,
      dataType: "JSON",
      data: {polyline: polylineCharacteristic}
    }).done((data) => {
      document.getElementById(`polylineCustomization-${this.props.map.id}`).classList.remove("active")
      this.setState({googlePolyline: null, polyline: null, distanceDisplayed: null})
      this.props.updateMapDataList(data, "polylines", "change")
    }).fail((data) => {
      console.log(data)
    })
  }

  deletePolyline = () => {
    $.ajax({
      method: 'DELETE',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/polylines/${this.state.polyline.id}`,
      dataType: "JSON"
    }).done((data) => {
      document.getElementById(`polylineCustomization-${this.props.map.id}`).classList.remove("active")
      this.setState({googlePolyline: null, polyline: null, distanceDisplayed: null})
      this.props.updateMapDataList(data, "polylines",  "delete")
    }).fail((data) => {console.log(data)})
  }

  render() {
    return (
      <div id={`polylineCustomization-${this.props.map.id}`} className="polylineCustomization">
        <button onClick={this.abandonPolylineCustomization} className="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <h3>Path Customization:</h3>
        <div className="distanceDisplayRadios">
        {["true", "false"].map(x =>
          <div key={x} className="form-check form-check-inline" onChange={this.distanceDisplay}>
            <input className="form-check-input markerLogoInput" type="radio" id={`radio-${x}`} name="inlineRadioOptions" value={x} checked={this.state.distanceDisplayed}/>
            <label className="form-check-label" htmlFor={`radio-${x}`}>{x}</label>
          </div>
        )}
        </div>
        <button className="btn btn-dark" onClick={this.deletePolyline}>Delete Path</button>
      </div>
    )
  }
}

export default PolylineCustomization
