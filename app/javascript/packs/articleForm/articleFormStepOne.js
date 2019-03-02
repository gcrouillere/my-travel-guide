import React, { Component } from 'react'
import update from 'immutability-helper'
import $ from 'jquery'

class ArticleFormStepOne extends Component {

  constructor(props) {
    super(props)
    this.state = {
      allowedAudienceSelections:[],
      audiencesSelection: this.props.audiencesSelection
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.audiencesSelection) this.setState({audiencesSelection: nextProps.audiencesSelection})
  }

  componentDidMount() {
    $.ajax({
      method: 'GET',
      url: "/audience_selections",
      dataType: "JSON"
    }).then(response => {
      this.setState({allowedAudienceSelections: response});
    }).fail( response => {
      console.log(response)
    })
  }

  manageAudience = (event) => {
    let clickedAudienceName = event.target.value
    let newSelectionNames = this.state.audiencesSelection.map(x => x.audience)

    if ( newSelectionNames.indexOf(clickedAudienceName) == -1 ) {
      newSelectionNames.push(clickedAudienceName)
    } else {
      newSelectionNames.splice(newSelectionNames.indexOf(clickedAudienceName), 1)
    }

    $.ajax({
      method: "PUT",
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/articles/${this.props.id}`,
      data: {article: {audience_selections: newSelectionNames.length == 0 ? [""] : newSelectionNames }}
    }).done((data) => {
      this.setState({audiencesSelection: data.audience_selections})
    }).fail((data) => {
      console.log(data)
    })
  }

  checkBox = (category) => {
    return this.state.audiencesSelection.findIndex(x => x.audience == category) > -1
  }

  render() {
    return(
      <div className="audienceSelection">
        <h2>For whom is the trip intended ? (select all that apply)</h2>
        <div className="form-check">
        {this.state.allowedAudienceSelections.map((category) =>
          <div key={`${category.audience}0`}>
            <input key={`${category.audience}1`} className="form-check-input" type="checkbox" value={`${category.audience}`} id={`${category.audience}Check`}
            onChange={this.manageAudience} checked={this.checkBox(category.audience)}/>
            <label key={`${category.audience}2`} className="form-check-label" htmlFor={`${category.audience}Check`}>{`${category.audience}`}</label>
          </div>
        )}
        </div>
      </div>
    )
  }
}

export default ArticleFormStepOne

