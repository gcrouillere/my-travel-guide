import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import $ from 'jquery'

import ajaxHelpers from './../utils/ajaxHelpers'
import mapHelper from './../utils/mapHelper'
import photoHelpers from './../utils/photoHelpers'
import orderHelper from './../utils/articleContentHelper'
import markerLogos from './articleForm/mapForm/markerLogos'

class Article extends Component {
  constructor(props) {
    super(props)
    this.state = {
      articleElements: [],
      title: ""
    }
    this.textContentDivs = {}
    this.mapDivs = {}
    this.articleContent = React.createRef()
  }

  componentDidUpdate(prevProps) {
    if (this.checkUpdate(prevProps, this.props)) {
      this.setState({
        articleElements: orderHelper.orderArticleElements(this.props.currentArticle),
        title: this.props.currentArticle.title
      }, () => {
        this.createMaps()
        this.createTextContentsHTML()
      })
    }
  }

  checkUpdate(prevProps, newProps) {
    if (!prevProps.currentArticle && newProps) return true
    if (prevProps.currentArticle) {
      if (prevProps.currentArticle.id !== newProps.currentArticle.id) return true
    }
    if (newProps.currentArticle.title != "" && this.articleContent.current.innerText === "") return true
    return false
  }

  createMaps() {
    Object.keys(this.mapDivs).map(mapID => {
      const map = this.state.articleElements.find( x => x.id === parseInt(mapID) && x.class_name === 'Map' )
      const googleMap = this.createMap(map, mapID)

      let markers = map.markers
      this.addCenter(map, markers)
      markers.forEach( marker => {

        const icon = markerLogos[marker.logo].url
        const googleMarker = mapHelper.createMarker(marker, googleMap, icon, null, false)
        if (marker.description) {
          const infowindow = new google.maps.InfoWindow({content: marker.description, disableAutoPan: true});
          infowindow.open(googleMap, googleMarker);
        }
      })

      const polylines = map.polylines
      polylines.forEach( polyline => {

       const googlePolyline = this.createPolyline(polyline, googleMap)
       polyline.markers.forEach((marker, index) => {

        let icon = mapHelper.getPolylinePointLogo(index, polyline.markers)
        let tempMarker = mapHelper.createMarker(marker, googleMap, icon, index)
        mapHelper.manageDistanceInfoWindow(index, polyline.distance_displayed, polyline.markers,
        googlePolyline, tempMarker, googleMap)
       })
      })
    })
  }

  createMap(map, mapID) {
    return new google.maps.Map( this.mapDivs[mapID], {
      center: { lat: map.lat, lng: map.lng },
      zoom: map.zoom,
      mapTypeControl: true,
      zoomControl: true,
      zoomControlOptions: { position: google.maps.ControlPosition.LEFT_CENTER },
      scaleControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [ { "featureType": "poi.business", "stylers": [{ "visibility": "off" }] } ]
    });
  }

  createPolyline(polyline, googleMap) {
    return new google.maps.Polyline({
      map: googleMap,
      path: polyline.markers,
      strokeColor: '#495057',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      geodesic: true
    })
  }

  addCenter(map, markers) {
    if (map.show_map_center_as_marker) markers.unshift({
      lat: map.lat,
      lng: map.lng,
      description: map.name,
      logo: "markerLogo",
      mapCenter: true
    })
  }

  createTextContentsHTML() {
    Object.keys(this.textContentDivs).map(textContentID => {
      const text = this.state.articleElements.find( x => x.id === parseInt(textContentID) && x.class_name === 'TextContent' ).text
      this.textContentDivs[textContentID].insertAdjacentHTML('beforeend', text)
    })
  }

  handleClick = () => {
    this.props.history.push("/")
  }

  render() {
    return (
      <div className="container article-container">

        <header ref={this.articleContent} onClick={this.handleClick}>
          <h1 className="article-header">{this.state.title}</h1>
        </header>

        <div className="article-content">
          {this.state.articleElements.map(element => {

            if (element.class_name == "TextContent") {
              return <div key={`text-${element.id}`}
              ref={div => this.textContentDivs[element.id] = div} className="textContent"></div>
            }

            if (element.class_name == "Map") {
              return <div key={`map-${element.id}`} id={`map-${element.id}`}
              ref={div => this.mapDivs[element.id] = div}
              className="googleMap" style={{ width: '100%', height: `${element.height}px` }}></div>
            }

            if (element.class_name == "Photo") {
              return <div className="photo" key={`photo-${element.id}`}>
                <img src={ photoHelpers.retrievePhotoSRC(element) } alt={ element.original_filename }
                style={{width: `${element.css_width}%`}} />
                { element.display_title && <p className="photo-title">{ element.original_filename }</p> }
              </div>
            }
          })}
        </div>

      </div>
    )
  }
}

Article.propTypes = {
  match: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    currentArticle: state.currentArticle
  }
}

export default withRouter(connect(mapStateToProps, null)(Article))
