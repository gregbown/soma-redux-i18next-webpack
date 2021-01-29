import {combineReducers} from 'redux';
// import {routerReducer} from 'redux-first-routing';

export const reducers = function(todos, filter, locale, localize, routerReducer) {
  if (typeof todos === 'undefined') {
    throw new Error('ERROR: Todos reducer is undefined in combine reducers');
  }
  if (typeof filter === 'undefined') {
    throw new Error('ERROR: Filter reducer is undefined in combine reducers');
  }
  return combineReducers({
    todos,
    filter,
    locale,
    localize,
    router: routerReducer
  })
};
