import {events} from '../constants/events';

/*!
 * MIT License
 * Copyright (c) 2017 Michael Sargent redux-first-routing
 * See: https://github.com/mksarge/redux-first-routing
 */
export const routerMiddleware = function() {
  return (history) => () => (next) => (action) => {
    switch (action.type) {
      case events.PUSH:
        history.push(action.payload);
        break;
      case events.REPLACE:
        history.replace(action.payload);
        break;
      case events.GO:
        history.go(action.payload);
        break;
      case events.GO_BACK:
        history.goBack();
        break;
      case events.GO_FORWARD:
        history.goForward();
        break;
      default:
        return next(action);
    }
  };
}
