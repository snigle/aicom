// @flow weak
// This is the root reducer and root selectors
import {combineReducers} from 'redux'
import nav, * as fromNav from './navReducer'
import login from './login/login.reducer'

export default combineReducers({
  nav,
  login,
})

export const getNav = (state) =>
  fromNav.getNav(state.nav)
