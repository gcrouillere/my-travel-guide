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
import { fetchArticles, mapArticlesToMarkers } from '../actions/index'

class ArticlesList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      markers: [],
      googleMap: null,
      view: "list"
    }
  }

  async componentDidMount () {
    const articlesScope = /^\/users\/\d+\/articles$/.test(this.props.location.pathname) ? this.props.currentUser : undefined
    await this.props.fetchArticles(articlesScope)
    this.props.mapArticlesToMarkers(this.props.articles)
    this.initMap()
  }

  initMap = () => {
    this.map = new google.maps.Map(document.getElementById('articlesListMap'), {
      center: { lat: 20, lng: 0 },
      zoom: 2,
      mapTypeControl: false,
      zoomControl: true,
      zoomControlOptions: { position: google.maps.ControlPosition.LEFT_CENTER },
      scaleControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [ { "featureType": "poi.business", "stylers": [{ "visibility": "off" }] } ]
    });

    this.props.mapCentersMarkers.forEach( marker => {

      const icon = markerLogos[marker.logo].url
      const googleMarker = mapHelper.createMarker(marker, this.map, icon, null, false)
      googleMarker.addListener('click', event => { this.handleArticleSelect(event, googleMarker) })

      if (marker.description) {
        const infowindow = new google.maps.InfoWindow({content: marker.description, disableAutoPan: true});
        infowindow.open(this.map, googleMarker);
      }
    })

  }

  handleArticleSelect = (event, googleMarker) => {
    this.props.history.push(`/articles/${googleMarker.appMarker.id}`)
  }

  sanitizeAndTruncateHTML(html) {
    return htmlSanitizer.sanitizeAndTruncateHTML(html, 100)
  }

  changeListView = (event) => {
    return this.setState({ view: event.target.getAttribute("value") })
  }

  render() {
    return (
      <div className="container articles-container">

          <div className={`filters ${this.state.view === 'earth' ? "full" : "auto"}`}>
            <div className="listSwitch">
              <img className="switchView seeEarth" onClick={this.changeListView} src={earthLogo} value="earth"/>
              <img className="switchView seeList" onClick={this.changeListView} src={listLogo} value="list" />
            </div>
            <ArticlesListFilter {...this.props} audiencesSelection={this.props.audiencesSelection} initMap={this.initMap}/>

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
              <div key={article.id} className="col-12 col-md-6 col-lg-4 article-card">
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
    mapCentersMarkers: state.mapCentersMarkers
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { fetchArticles, mapArticlesToMarkers},
    dispatch
  )
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ArticlesList))
