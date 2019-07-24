import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import $ from 'jquery'
import update from 'immutability-helper'

import ajaxHelpers from './../utils/ajaxHelpers'
import mapHelper from './../utils/mapHelper'
import photoHelpers from './../utils/photoHelpers'
import orderHelper from './../utils/articleContentHelper'
import markerLogos from './articleForm/mapForm/markerLogos'
import ShowSecondContentButton from './articleForm/formElementManagement/showSecondContentButton'

export class Article extends Component {
  constructor(props) {
    super(props)
    this.state = {
      articleElements: [],
      maps: [],
      texts: [],
      title: "",
      clientWidth: document.body.clientWidth,
      doubleContentActives: {}
    }
    this.textContentDivs = {}
    this.mapDivs = {}
    this.articleContent = React.createRef()
  }

  componentDidUpdate(prevProps) {
    if (this.checkUpdate(prevProps, this.props)) {
      this.setState({
        articleElements: orderHelper.orderArticleElements(this.props.currentArticle),
        maps: this.concatContentList("maps"),
        texts: this.concatContentList("text_contents"),
        title: this.props.currentArticle.title,
        doubleContentActives: this.doubleContentInitialStates()
      }, () => {
        this.createMaps()
        this.createTextContentsHTML()
      })
    }
  }

  doubleContentInitialStates = () => {
    let doubleContentActives = this.state.doubleContentActives
    this.props.currentArticle.double_contents.forEach( x => {
      const key = `doubleContent-${x.id}`
      doubleContentActives = update(doubleContentActives, {[key]: { $set: false }})
    })
    return doubleContentActives
  }

  checkUpdate(prevProps, newProps) {
    if (!prevProps.currentArticle && newProps) return true
    if (prevProps.currentArticle) {
      if (prevProps.currentArticle.id !== newProps.currentArticle.id) return true
    }
    if (newProps.currentArticle.title &&
        newProps.currentArticle.title != "" &&
        this.articleContent.current.innerText === "") return true
    return false
  }

  concatContentList = (content) => {
    let articleContent = this.props.currentArticle[content]
    let doubleContentsContent = this.props.currentArticle.double_contents.reduce((acc, x) => acc.concat(x[content]), [])
    return articleContent.concat(doubleContentsContent)
  }

  createMaps() {
    Object.keys(this.mapDivs).map(mapID => {
      const map = this.state.maps.find( x => x.id === parseInt(mapID))
      const googleMap = this.createMap(map, mapID)

      let markers = map.markers || []
      this.addCenter(map, markers)
      markers.forEach( marker => {

        const icon = markerLogos[marker.logo].url
        const googleMarker = mapHelper.createMarker(marker, googleMap, icon, null, false)
        if (marker.description) {
          const infowindow = new google.maps.InfoWindow({content: marker.description, disableAutoPan: true});
          infowindow.open(googleMap, googleMarker);
        }
      })

      const polylines = map.polylines || []
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
      const text = this.state.texts.find( x => x.id === parseInt(textContentID) ).text
      this.textContentDivs[textContentID].insertAdjacentHTML('beforeend', text)
    })
  }

  defineHeight = (map) => {
    return document.body.clientWidth < 768 ? `${map.height}px` : "auto%"
  }

  definePhotoWidth = (photo) => { return this.state.clientWidth >= 768 ? photo.css_width : 100}

  activateSecondContent = (doubleContentID) => {
    let doubleContentActives = this.state.doubleContentActives
    let initialState = doubleContentActives[`doubleContent-${doubleContentID}`]
    doubleContentActives = update(doubleContentActives, { [`doubleContent-${doubleContentID}`]: { $set: !initialState }})
    this.setState({ doubleContentActives: doubleContentActives })
  }

  render() {
    console.log("render")
    console.log(this.state.doubleContentActives)
    return (
      <div className="container article-container">
        <div className="row">
           <div className="col">

            <header ref={this.articleContent}>
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
                    style={{width: `${this.definePhotoWidth(element)}%`}} />
                    { element.display_title && <p className="photo-title">{ element.original_filename }</p> }
                  </div>
                }

                if (element.class_name == "DoubleContent") {
                  return (
                      <div className={`doubleContent
                        ${this.state.doubleContentActives ? (this.state.doubleContentActives[`doubleContent-${element.id}`] ? "active" : "") : null}`}
                       key={`doubleContent-${element.id}`} style={{minHeight: `${element.height}px`}}>
                        <ShowSecondContentButton activateSecondContent={this.activateSecondContent} text={"Show second content"}
                          id={element.id} />
                      { element.associated_instances_mapping.map( (type, index) => {
                        if (type[0] === "TextContent") {
                          const text_content = element.text_contents[index] || element.text_contents[0]
                          return <div key={`text-${text_content.id}`}
                            className={`textContent ${text_content.position === 0 ? "firstContent" : "secondContent"}`}
                            ref={div => this.textContentDivs[text_content.id] = div} >
                          </div>
                        }
                        if (type[0] === "Map") {
                          const map = element.maps[index] || element.maps[0]
                          return <div key={`map-${map.id}`} id={`map-${map.id}`} ref={div => this.mapDivs[map.id] = div}
                            className={`googleMap ${map.position === 0 ? "firstContent" : "secondContent"}`}
                            style={{ height: `${this.defineHeight(map)}` }}>
                          </div>
                        }
                        if (type[0] === "Photo") {
                          const photo = element.photos[index] || element.photos[0]
                          return <div key={`photo-${photo.id}`}
                            className={`photo ${photo.position === 0 ? "firstContent" : "secondContent"}`}
                            style={{ backgroundImage: `url(${photo.url})`}}>
                              <img className="photoMobile"src={photo.url} alt=""/>

                          </div>
                        }
                      })}
                    </div>
                  )
                }
              })}
            </div>

          </div>
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
