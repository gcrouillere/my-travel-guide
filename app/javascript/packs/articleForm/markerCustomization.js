import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import $ from 'jquery'

class MarkerCustomization extends Component {

  constructor(props) {
    super(props)
    this.state = {
      googleMarker: null,
      marker: null,
      description: ""
    }
  }

  initMarkerCustomization = (event, googleMarker, marker) => {
    this.setState({googleMarker: googleMarker, marker: marker, description: marker.description})
    document.getElementById(`markerCustomization-${this.props.map.id}`).classList.add("active")
  }

  abandonMarkerCustomization = () => { document.getElementById(`markerCustomization-${this.props.map.id}`).classList.remove("active") }

  handleDescription = (event) => {this.setState({description: event.target.value})}

  saveDescription = (event) => {
    $.ajax({
      method: 'PUT',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/markers/${this.state.marker.id}`,
      dataType: "JSON",
      data: {marker: {description: this.state.description}}
    }).done((data) => {
      document.getElementById(`markerCustomization-${this.props.map.id}`).classList.remove("active")
      this.props.updateMarkersList(data, "change")
    }).fail((data) => {
      console.log(data)
    })
  }

  deleteMarker = () => {
    $.ajax({
      method: 'DELETE',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/markers/${this.state.marker.id}`,
      dataType: "JSON"
    }).done((data) => {
      document.getElementById(`markerCustomization-${this.props.map.id}`).classList.remove("active")
      this.setState({googleMarker: null, marker: null})
      this.props.updateMarkersList(data, "delete")
    }).fail((data) => {console.log(data)})
  }

  render() {

    return (
      <div id={`markerCustomization-${this.props.map.id}`} className="markerCustomization">
        <button onClick={this.abandonMarkerCustomization} className="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <h3>Marker Customization:</h3>
        <button className="btn btn-dark" onClick={this.deleteMarker}>Delete Marker</button>
        <div className="descriptionUpdate">
          <textarea value={this.state.description} onChange={this.handleDescription}/>
          <button className="btn btn-dark" onClick={this.saveDescription}>Update description</button>
        </div>
      </div>
    )
  }
}
export default MarkerCustomization
