import {combineReducers} from 'redux';

export const reducers = function(todos, filter, locale) {
  if (typeof todos === 'undefined') {
    throw new Error('ERROR: Todos reducer is undefined in combine reducers');
  }
  if (typeof filter === 'undefined') {
    throw new Error('ERROR: Filter reducer is undefined in combine reducers');
  }
  return combineReducers({
    todos,
    filter,
    locale
  })
};
