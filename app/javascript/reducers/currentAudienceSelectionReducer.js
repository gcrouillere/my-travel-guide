import { UPDATE_AUDIENCE_SELECTION } from '../actions'

export default function(state = null, action) {

  switch(action.type) {
    case UPDATE_AUDIENCE_SELECTION:
      return action.payload
    default:
      return state
  }
}
