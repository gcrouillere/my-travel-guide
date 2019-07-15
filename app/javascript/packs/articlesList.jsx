import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import $ from 'jquery'
import update from 'immutability-helper'

import htmlSanitizer from './../utils/htmlSanitizer'
import ajaxHelpers from './../utils/ajaxHelpers'
import ArticlesListFilter from './articlesList/articlesListFilter'
import Marker from './articleForm/mapForm/mapComponent/marker'
import markerLogos from './articleForm/mapForm/markerLogos'
import earthLogo from './../../assets/images/earth.svg'
import listLogo from './../../assets/images/list.svg'
import mapHelper from './../utils/mapHelper'
import { fetchArticles, mapArticlesToMarkers, setFilterParams } from '../actions/index'

class ArticlesList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      markers: [],
      googleMap: null,
      view: "list",
      earthView: false,
      zoom: 3,
      previousCenter: null
    }
  }

  async componentDidMount () {
    const email = /^\/users\/\d+\/articles$/.test(this.props.location.pathname) ? this.props.currentUser.email : null
    await this.props.setFilterParams({ user: email })
    await this.props.fetchArticles(this.props.filterParams)
    this.props.mapArticlesToMarkers(this.props.articles)
    this.setState({ previousCenter: this.calculateMapCenter(this.props.mapCentersMarkers) })
  }

  componentWillMount() {
    this.props.setFilterParams({ mapBounds: null })
  }

  initMap = () => {
    this.map =  new google.maps.Map(document.getElementById('articlesListMap'), {
      zoom: this.state.zoom,
      center: this.calculateMapCenter(this.props.mapCentersMarkers),
      mapTypeControl: false,
      zoomControl: true,
      zoomControlOptions: { position: google.maps.ControlPosition.LEFT_CENTER },
      scaleControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [ { "featureType": "poi.business", "stylers": [{ "visibility": "off" }] } ]
    })
    this.markerBounds = new google.maps.LatLngBounds();

    this.props.mapCentersMarkers.forEach( marker => {
      const icon = markerLogos[marker.logo].url
      const googleMarker = mapHelper.createMarker(marker, this.map, icon, null, false)
      this.markerBounds.extend(googleMarker.position)

      googleMarker.addListener('click', event => { this.handleArticleSelect(event, googleMarker) })

      if (marker.description) {
        const infowindow = new google.maps.InfoWindow({content: marker.description, disableAutoPan: true});
        infowindow.open(this.map, googleMarker);
      }
    })

    this.map.addListener('zoom_changed', event => { this.changeMapBounds(event, this.map) })
    this.map.addListener('dragend', event => { this.changeMapBounds(event, this.map) })
  }

  calculateMapCenter = (mapCentersMarkers) => {
    if (mapCentersMarkers.length > 0 ) {
      let minLat, minLng, maxLat, maxLng
      let latitudes = mapCentersMarkers.map(marker => marker.lat)
      let longitudes = mapCentersMarkers.map(marker => marker.lng)

      maxLat = Math.max(...latitudes)
      minLat = Math.min(...latitudes)
      maxLng = Math.max(...longitudes)
      minLng = Math.min(...longitudes)
      const center = { lat: (maxLat + minLat) / 2, lng: (maxLng + minLng) / 2 }
      this.setState({ previousCenter: center})
      return center
    } else {
      return this.state.previousCenter
    }
  }

  changeMapBounds = async (event, googleMap) => {
    this.setState({ zoom: googleMap.getZoom(), previousCenter: googleMap.getCenter() })
    let googleMapBounds = googleMap.getBounds();
    const southLat = googleMapBounds.getSouthWest().lat();
    const southLng = googleMapBounds.getSouthWest().lng();
    const northLat = googleMapBounds.getNorthEast().lat();
    const northLng = googleMapBounds.getNorthEast().lng();
    const mapBounds = { mapBounds: [southLat, southLng, northLat, northLng], user: this.updateFilterParamsWithUser() }

    await this.props.setFilterParams(mapBounds)
    await this.props.fetchArticles(this.props.filterParams)
    this.props.mapArticlesToMarkers(this.props.articles)
    this.initMap()
  }

  handleArticleSelect = (event, googleMarker) => {
    this.props.history.push(`/articles/${googleMarker.appMarker.id}`)
  }

  sanitizeAndTruncateHTML(html) {
    return htmlSanitizer.sanitizeAndTruncateHTML(html, 100)
  }

  changeListView = (event) => {
    this.initMap()
    return this.setState({ view: event.target.getAttribute("value"), earthView: !this.state.earthView })
  }

  updateFilterParamsWithUser = (filterParams) => {
    if ( /^\/users\/\d+\/articles$/.test(this.props.location.pathname) ) {
      return this.props.currentUser.email
    } else {
      return null
    }
  }

  render() {
    return (
      <div className="container articles-container">

          <div className={`filters ${this.state.view === 'earth' ? "full" : "auto"}`}>
            <div className="listSwitch">
              <img className={`switchView seeEarth ${this.state.earthView ? "" : "active"}`}
              onClick={this.changeListView} src={earthLogo} value="earth"/>
              <img className={`switchView seeList ${this.state.earthView ? "active" : ""}`}
              onClick={this.changeListView} src={listLogo} value="list" />
            </div>
            <ArticlesListFilter {...this.props} audiencesSelection={this.props.audiencesSelection} initMap={this.initMap}
            updateFilterParamsWithUser={this.updateFilterParamsWithUser}/>

              <div className={`row mapRow ${this.state.view === 'earth' ? "show" : "hide"}`}>
                <div className="listOnMap">
                  <div id="articlesListMap" className="googleMap" onMouseDown={this.onMouseDown} >
                  </div>
                </div>
              </div>
          </div>

          <div className={`row listRow ${this.state.view === 'list' ? "show" : "hide"}`}>
          {this.props.articles.map((article) => {
            return(
              <div key={article.id} className="col-6 col-md-6 col-lg-4 article-card">
              <Link to={`/articles/${article.id}`}>
                <div className="card">
                  <div className={`card-header ${article.article_valid ? "complete" : "incomplete"}`}>
                    <p className="card-title">{article.title}</p>
                  </div>
                  <div className="card-body">
                    <p className="card-text">
                    { article.text_contents[0] ? this.sanitizeAndTruncateHTML(article.text_contents[0].text) : "" }
                    </p>
                    <div className="articleList-audienceSelection">
                      <div className="row justify-content-center">
                        { article.audience_selections.map(audience_selection =>
                          <label key={audience_selection.audience}
                          className="form-check-label">
                            { audience_selection.audience }
                           </label>
                        )}
                      </div>
                    </div>
                  </div>
                 </div>
               </Link>
              </div>
           )})}
          </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    audiencesSelection: state.audiencesSelection,
    articles: state.articles,
    mapCentersMarkers: state.mapCentersMarkers,
    filterParams: state.filterParams
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { fetchArticles, mapArticlesToMarkers, setFilterParams},
    dispatch
  )
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ArticlesList))
