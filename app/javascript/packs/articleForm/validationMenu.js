import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import ajaxHelpers from '../../utils/ajaxHelpers'
import orderHelper from '../../utils/articleContentHelper'

class ValidationMenu extends Component {

  static validations = {
    outputs: {
      textContentPresence: ["Text present", "At least one text box"],
      textContentNotEmpty: ["Text length OK", "Text at least 300 characters long"],
      mapPresence: ["Map present", "At least one map"],
      oneMarker: ["Markers present", "At least one marker on each map"],
      photoPresence: ["Photo present", "At least one photo"],
    },
    functions: {
      textContentPresence: (articleElements) => {
        return ValidationMenu.anyThing(articleElements, 'TextContent')
      },
      textContentNotEmpty: (articleElements) => {
        return ValidationMenu.anyThing(articleElements, 'TextContent') ?
          articleElements.filter(x => x.class_name === 'TextContent').some(x => x.text.length > 300) :
          false
      },
      mapPresence: (articleElements) => {
        return ValidationMenu.anyThing(articleElements, 'Map')
      },
      oneMarker: (articleElements) => {
        return ValidationMenu.anyThing(articleElements, 'Map') ?
          articleElements.filter(x => x.class_name === 'Map').every(x => x.markers ? x.markers.length > 0 : false) :
          false
      },
      photoPresence: (articleElements) => {
       return ValidationMenu.anyThing(articleElements, 'Photo')
      }
    }
  }

  static anyThing = (articleElements, thing) => {
    return articleElements.some(x => x.class_name === thing)
  }

  componentDidUpdate = () => {
    this.updateArticleValidity()
  }

  updateArticleValidity = async () => {
    const article = await ajaxHelpers.ajaxCall('GET', `/articles/${this.props.id}`, {}, {})
    const articleElements = orderHelper.orderArticleElements(article)

    const article_valid = Object.keys(ValidationMenu.validations.outputs).every( fname =>
      ValidationMenu.validations.functions[fname](articleElements))
    ajaxHelpers.ajaxCall('PUT', `/articles/${this.props.id}`, { article: { article_valid: article_valid }}, this.props.token)
  }

  coverAllValidations = () => {
    this.updateArticleValidity()
    return Object.keys(ValidationMenu.validations.outputs).map( fname =>
      ValidationMenu.validations.functions[fname](this.props.articleElements) ?
      <p key={fname} className="valid">{ ValidationMenu.validations.outputs[fname][0] }</p> :
      <p key={fname} className="not-valid">{ ValidationMenu.validations.outputs[fname][1] }</p>
    )
  }

  render() {
    return(
      <div id="validationMenu" className="validationMenu">
        <div className="menuBody">

          <div className="expand validation">
            <div className="chevron-closed">></div>
            <div className="chevron-open">&lt;</div>
            <div className="menu">
              <p>C</p>
              <p>H</p>
              <p>E</p>
              <p>C</p>
              <p>K</p>
            </div>
          </div>

          <div className="buttons">
            { this.coverAllValidations() }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentArticle: state.currentArticle
  }
}

export default connect(mapStateToProps)(ValidationMenu)
