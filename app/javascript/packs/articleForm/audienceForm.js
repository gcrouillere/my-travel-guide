import React, { Component } from 'react'
import update from 'immutability-helper'
import $ from 'jquery'

class AudienceForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      allowedAudienceSelections: [],
      audiencesSelection: []
    }
  }

  componentDidMount() {
    $.ajax({
      method: 'GET',
      url: `/articles/${this.props.id}`,
      dataType: "JSON"
    }).done((data) => {
      this.setState({audiencesSelection: data.audience_selections})
    })
    $.ajax({
      method: 'GET',
      url: "/audience_selections",
      dataType: "JSON"
    }).then(response => {
      this.setState({allowedAudienceSelections: response});
    })
  }

  manageAudience = (event) => {
    let clickedAudienceID = parseInt(event.target.id)
    let newSelectionIDS = this.state.audiencesSelection.map(x => x.id)

    if ( newSelectionIDS.indexOf(clickedAudienceID) == -1 ) {
      newSelectionIDS.push(clickedAudienceID)
    } else {
      newSelectionIDS.splice(newSelectionIDS.indexOf(clickedAudienceID), 1)
    }

    $.ajax({
      method: "PUT",
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: `/articles/${this.props.id}`,
      data: {article: {audience_selection_ids: newSelectionIDS.length == 0 ? [""] : newSelectionIDS }}
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
            <input key={`${category.audience}1`} className="form-check-input" type="checkbox" value={`${category.audience}`} id={`${category.id}`}
            onChange={this.manageAudience} checked={this.checkBox(category.audience)}/>
            <label key={`${category.audience}2`} className="form-check-label" htmlFor={`${category.id}`}>{`${category.audience}`}</label>
          </div>
        )}
        </div>
      </div>
    )
  }
}

export default AudienceForm

