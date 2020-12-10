import {events} from '../constants/events';
import {filters} from '../constants/filters';

export const filter = function() {

  return  (state = filters.SHOW_ALL, action) => {
    switch (action.type) {
      case events.SET_VISIBILITY_FILTER:
        return action.filter
      default:
        return state
    }
  }
};
