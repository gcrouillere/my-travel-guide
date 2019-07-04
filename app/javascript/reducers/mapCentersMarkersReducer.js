import { FETCH_MARKERS } from '../actions'

export default function(state = null, action) {

  switch(action.type) {
    case FETCH_MARKERS:
      return action.payload;
    default:
      return state;
  }
}
