import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import algoliasearch from 'algoliasearch'
import update from 'immutability-helper'

import { updateAudienceSelection, fetchArticles, mapArticlesToMarkers } from '../../actions/index'
import { ALGOLIAKEYS } from '../../config/config';

class ArticlesListFilter extends Component {

  constructor(props) {
    super(props)
    this.client = algoliasearch(ALGOLIAKEYS.APP_ID, ALGOLIAKEYS.API_KEY);
    this.queries = [ { indexName: 'Article' }, { indexName: 'TextContent' } ]
    this.state = {
      filterParams: {},
      query_string: false
    }
  }

  checkBoxTicked = (audienceName) => {
    return this.props.currentAudienceSelection.findIndex(x => x.audience === audienceName) > -1
  }

  updateAudienceSelection = async (event) => {
    const clickedID = parseInt(event.target.id.split("-")[1])
    const newSelection =  this.manageAudience(clickedID)
    const IDSArray = newSelection.map(x => x.id).length === 0 ? null : newSelection.map(x => x.id)
    let filterParams = update(this.state.filterParams, { audience_selection: { $set:  IDSArray }})
    filterParams = this.updateFilterParamsWithUser(filterParams)

    this.setState({ filterParams: filterParams })
    await this.props.fetchArticles(filterParams)
    this.props.mapArticlesToMarkers(this.props.articles)
    this.props.initMap()
    this.props.updateAudienceSelection(newSelection)
  }

  manageAudience = (clickedID) => {
    let newSelectionIDS = this.props.currentAudienceSelection.map(x => x.id)
    let newSelection = this.props.currentAudienceSelection.slice()

    if ( newSelectionIDS.indexOf(clickedID) == -1 ) {
      newSelection.push(this.props.audiencesSelection.find(x => x.id == clickedID))
    } else {
      newSelection.splice(newSelectionIDS.indexOf(clickedID), 1)
    }
    return newSelection
  }

  searchString = async (event) => {
    const query = event.target.value
    this.queries.map(x => x.query = query)
    let filterParams

    const promise = new Promise((resolve, reject) => {
      if (query.length > 2) {
        this.client.search(this.queries, (err, { results } = {}) => {
          if (err) return reject(err);

          const IDSArray = results.map(x => x.hits.map(x => x.article_id)).flat()
          return resolve(update(this.state.filterParams, { article_ids: { $set:  IDSArray }}))
        })
      } else {
        return resolve(update(this.state.filterParams, { article_ids: { $set:  null }}))
      }
    })

    await promise.then(value => filterParams = value)
    this.updateFilterParamsWithUser(filterParams)
    this.setState({ filterParams: filterParams, query_string: query.length > 2 })
    await this.props.fetchArticles(filterParams)
    this.props.mapArticlesToMarkers(this.props.articles)
    this.props.initMap()
  }

  updateFilterParamsWithUser(filterParams) {
    if ( /^\/users\/\d+\/articles$/.test(this.props.location.pathname) ) {
      const user = this.props.currentUser.email
      return update(filterParams, { email: { $set:  user }})
    } else {
      return filterParams
    }
  }

  render() {

    return(
      <div className="articlesFilter">
        <div className="audienceFilter audienceSelection">
          <div className="row justify-content-sm-center form-check">
          {this.props.audiencesSelection.map((category) =>
            <div key={`${category.audience}0`} className="">
              <input key={`${category.audience}1`}
              className="form-check-input" type="checkbox" value={`${category.audience}`} id={`category-${category.id}`}
              onChange={this.updateAudienceSelection} checked={this.checkBoxTicked(category.audience)}/>
              <label key={`${category.audience}2`}
              className={`form-check-label ${this.checkBoxTicked(category.audience) ? "ticked" : "blank"}`}
              htmlFor={`category-${category.id}`}>{`${category.audience}`}</label>
            </div>
          )}
          </div>
        </div>
        <div className={`row justify-content-sm-center stringFilter ${this.state.query_string ? "ticked" : "blank"}`}>
          <input type="text" className={`stringFilterInput`}
          onChange={this.searchString} placeholder="looking for something ?"/>
          <span></span>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    audiencesSelection: state.audiencesSelection,
    currentAudienceSelection: state.currentAudienceSelection,
    articles: state.articles
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { updateAudienceSelection, fetchArticles, mapArticlesToMarkers },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticlesListFilter)