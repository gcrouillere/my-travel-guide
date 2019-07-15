import update from 'immutability-helper'
import { SET_FILTER_PARAMS } from '../actions'

export default function(state = null, action) {

  switch(action.type) {
    case SET_FILTER_PARAMS:
      let newFilterParams = state
      Object.keys(state).forEach(param => {
        if (action.payload[param] || action.payload[param] === null) {
          newFilterParams = update(newFilterParams, { [param]: { $set:  action.payload[param] }})
        }
      })
      return newFilterParams;
    default:
      return state;
  }
}
