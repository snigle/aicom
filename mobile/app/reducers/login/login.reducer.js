// @flow weak
import { SET_LOGIN } from './login.actions';

// Reducer
const DEFAULT_STATE = null
export default function(state = DEFAULT_STATE, action) {
  switch(action.type) {
    case SET_LOGIN:
      // return {...state, action.user};
      return {...action.user};
    default:
      return state;
  }
}

// Selectors (mapStateToProps)
export const setLogin = (user) => ({
  type : SET_LOGIN,
  user : user
})
