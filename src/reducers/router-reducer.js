import {events} from '../constants/events';

/*!
 * MIT License
 * Copyright (c) 2017 Michael Sargent redux-first-routing
 * See: https://github.com/mksarge/redux-first-routing
 */
export const routerReducer = function() {

  const initialState = {
    pathname: '/',
    search: '',
    queries: {},
    hash: '',
  };

  return (state = initialState, action) => {
    switch (action.type) {
      case events.LOCATION_CHANGE:
        return {
          ...state,
          ...action.payload,
        };
      default:
        return state;
    }
  }
}



