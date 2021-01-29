export const historyListener = function(actions) {

/*!
 * MIT License
 * Copyright (c) 2017 Michael Sargent redux-first-routing
 * See: https://github.com/mksarge/redux-first-routing
 */
  return function(history, store) {
    console.log('History listener', history.location.pathname);
    store.dispatch(actions.locationChange({
      pathname: history.location.pathname,
      search: history.location.search,
      hash: history.location.hash,
    }));

    history.listen((location) => {
      // noinspection JSUnresolvedVariable
      store.dispatch(actions.locationChange({
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
      }));
    });
  }
}
