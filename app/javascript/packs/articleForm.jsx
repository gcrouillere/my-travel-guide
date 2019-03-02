import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import TextContent from './textContent'
import ArticleFormStepOne from './articleForm/articleFormStepOne'
import ArticleFormMap from './articleForm/articleFormMap'
import ContentMenu from './articleForm/contentMenu'
import $ from 'jquery'
import update from 'immutability-helper'
import 'react-quill/dist/quill.snow.css';

class ArticleForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      textContents: [],
      audiencesSelection: [],
      maps: [],
      title: "",
      id: null
    }
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      $.ajax({
        method: 'GET',
        url: `/articles/${this.props.match.params.id}`,
        dataType: "JSON"
      }).done((data) => {
        this.setState({title: data.title, textContents: data.text_contents, id: data.id,
          audiencesSelection: data.audience_selections, maps: data.maps});
      });
    } else {
      $.ajax({
        method: 'POST',
        beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
        url: `/articles`,
        dataType: "JSON",
        data: {article: {title: "", audiencesSelection:[]}}
      }).done((data) => {
        this.setState({title: data.title, textContents: [], id: data.id});
        this.props.history.push(`/articles/${data.id}/edit`)
      });
    }
  }

  handleTitleChange = (event) => {
    const title = event.target.value
    $.ajax({
      method: "PUT",
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/articles/${this.state.id}`,
      data: {article: {title: title}}
    })
    this.setState({title: title})
  }

  addNewTextContent = (id) => {
    $.ajax({
      method: 'POST',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/text_contents/`,
      dataType: "JSON",
      data: {text_content: {text: "", article_id: id}}
    }).done((data) => {
      const textContents = update(this.state.textContents, {$splice: [[0, 0, data]]})
      this.setState({textContents: textContents})
    }).fail((data) => {
      console.log(data)
    })
  }

  addNewMap = (id) => {
    $.ajax({
      method: 'POST',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/maps/`,
      dataType: "JSON",
      data: {map: {lat: 41.0082, lng: 28.9784, zoom: 8, article_id: id}}
    }).done((data) => {
      const maps = update(this.state.maps, {$splice: [[0, 0, data]]})
      this.setState({maps: maps})
    }).fail((data) => {
      console.log(data)
    })
  }

  render() {
    return (
      <div className="container article-container">

        <ArticleFormStepOne manageAudience={this.manageAudience} audiencesSelection={this.state.audiencesSelection} id={this.state.id}/>

        <ContentMenu id={this.state.id} addNewTextContent={this.addNewTextContent} addNewMap={this.addNewMap}/>

        <header className="text-center">
          <input type="text" placeholder="Enter your article title" value={this.state.title} onChange={this.handleTitleChange}/>
        </header>

        <div id="mapReceiver">
          {this.state.maps.map((map) =>
            <ArticleFormMap key={map.id} map={map}/>
          )}
        </div>

        <div id="articleTextContents">
        {this.state.textContents.map((textContent) =>
          <TextContent key={textContent.id} textContent={textContent.text} id={textContent.id}/>
        )}
        </div>

      </div>
    )
  }
}

export default ArticleForm
