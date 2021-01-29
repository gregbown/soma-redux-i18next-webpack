import {createStore, applyMiddleware} from 'redux';
import {createLogicMiddleware} from 'redux-logic';
import {createBrowserHistory} from 'history';
import logger from 'redux-logger';

export const configuration = function (reducers, logic, actions, persistence, routerMiddleware) {
  console.log('Config store...');
  this.history = createBrowserHistory();

  // Build the middleware, which intercepts navigation actions and calls the corresponding history method
  const historyMiddleware = routerMiddleware(this.history);
  const deps = { // injected dependencies for logic
    actions: actions,
    persistence: persistence
  };
  const logicMiddleware = createLogicMiddleware([logic.persistEffect, logic.persistLogic], deps);
  this._middleware = applyMiddleware(
    logicMiddleware,
    historyMiddleware,
    logger
  );
  this._reducers = reducers;
  return this;
}

configuration.prototype = {
  createStore: function() {
    console.log('Create store');
    return createStore(this._reducers, this._middleware);
  }
}
