import {events} from '../constants/events';
import cookies from 'browser-cookies';
'use strict';

export const locale = function() {
  const lng = cookies.get('locale') || 'en';
  return function(state = lng, action) {
    switch (action.type) {
      case events.SET_LOCALE:
        return action.locale
      default:
        return state
    }
  }
};
