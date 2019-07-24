import React, { Component } from 'react'

import swapContent from './../../../../assets/images/swap-content-white.svg'

 class ShowSecondContentButton extends Component {

   activateSecondContent = () => { this.props.activateSecondContent(this.props.id) }


   render() {
    return(
      <div className="showSecondContentButton" onClick={this.activateSecondContent}>
        <div className="swapContent">
          { this.props.text && <p>{this.props.text}</p>}
          <img src={swapContent}/>
        </div>
      </div>
    )
   }
}

export default ShowSecondContentButton
