import React, { Component } from 'react'
import update from 'immutability-helper'
import $ from 'jquery'
import ajaxHelpers from './../../utils/ajaxHelpers'

class AudienceForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      allowedAudienceSelections: [],
      audiencesSelection: [],
      audienceValid: false,
      continueWriting: false
    }
  }

  async componentDidMount() {
    const audienceSelections = await ajaxHelpers.ajaxCall('GET', "/audience_selections")
    const article = await ajaxHelpers.ajaxCall('GET', `/articles/${this.props.id}`, {}, {})

    this.setState({
      audiencesSelection: article.audience_selections,
      audienceValid: article.audience_valid,
      continueWriting: article.audience_valid,
      allowedAudienceSelections: audienceSelections},
      () => { this.props.updateArticleCompletion({audienceForm: this.state.audienceValid })
    })
  }

  updateAudienceSelection = async (event) => {
    const newSelectionIDS = this.manageAudience(event)
    const data = { article:
      { audience_selection_ids: newSelectionIDS.length == 0 ? [""] : newSelectionIDS,
      audience_valid: newSelectionIDS.length > 0 }
    }

    const article = await ajaxHelpers.ajaxCall('PUT', `/articles/${this.props.id}`, data, this.props.token)

    this.setState({
      audiencesSelection: article.audience_selections,
      audienceValid: article.audience_valid,
      continueWriting: this.state.continueWriting && article.audience_valid },
      () => {
          this.props.updateArticleCompletion({audienceForm: this.state.audienceValid && this.state.continueWriting})
      })
  }

  manageAudience = (event) => {
    let clickedAudienceID = parseInt(event.target.id.split("-")[1])
    let newSelectionIDS = this.state.audiencesSelection.map(x => x.id)

    if ( newSelectionIDS.indexOf(clickedAudienceID) == -1 ) {
      newSelectionIDS.push(clickedAudienceID)
    } else {
      newSelectionIDS.splice(newSelectionIDS.indexOf(clickedAudienceID), 1)
    }
    return newSelectionIDS
  }

  checkBoxTicked = (category) => {
    return this.state.audiencesSelection.findIndex(x => x.audience == category) > -1
  }

  continueWriting = async () => {
    const data = { article: { audience_valid: true } }
    const article = await ajaxHelpers.ajaxCall('PUT', `/articles/${this.props.id}`, data, this.props.token)

    this.setState({ continueWriting: true }, () => {
      this.props.updateArticleCompletion({audienceForm: this.state.audienceValid && this.state.continueWriting})
    })
  }

  render() {
    return(
      <div className={`audienceSelection ${this.state.continueWriting && this.state.audienceValid ? "complete" : "incomplete"}`}>
        <h2 className="sectionLabel">For whom is the trip intended ?</h2>
        <p className="mainTitleSub">(select all that apply)</p>
        <div className="form-check">
        {this.state.allowedAudienceSelections.map((category) =>
          <div key={`${category.audience}0`}>
            <input key={`${category.audience}1`} className="form-check-input" type="checkbox" value={`${category.audience}`} id={`category-${category.id}`}
            onChange={this.updateAudienceSelection} checked={this.checkBoxTicked(category.audience)}/>
            <label key={`${category.audience}2`} className={`form-check-label ${this.checkBoxTicked(category.audience) ? "ticked" : "blank"}`} htmlFor={`category-${category.id}`}>{`${category.audience}`}</label>
          </div>
        )}
        </div>
        {!this.state.continueWriting &&
          <button className={`btn btn-dark ${this.state.audienceValid ? (this.state.continueWriting ? "AudienceSubmitContinueAndComplete" : "AudienceSubmitComplete") : "AudienceSubmit"}`}
          onClick={this.continueWriting}>
            Continue writing
          </button>
        }
      </div>
    )
  }
}

export default AudienceForm

