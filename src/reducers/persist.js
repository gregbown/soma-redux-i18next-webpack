import {events} from '../constants/events';

export const persist = function() {

  const initialState = {
    status: ''
  };

  return function(state = initialState, action) {
    switch(action.type) {
      case events.PERSIST_TODO:
        return {
          ...state,
          status: `Persisting... ${(new Date()).toLocaleString()}`,
        };
      case events.PERSIST_SUCCESS:
        return {
          ...state,
          status: `Persisted ${(new Date()).toLocaleString()}`
        };
      case events.PERSIST_FAILURE:
        return {
          ...state,
          status: `errored: ${action.payload}`
        };
      case events.PERSIST_CANCELED:
        return {
          ...state,
          status: 'user cancelled'
        };
      default:
        return state;
    }
  }
}
