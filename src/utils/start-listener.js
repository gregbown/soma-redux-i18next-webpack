export const startListener = function(actions) {

/*!
 * MIT License
 * Copyright (c) 2017 Michael Sargent redux-first-routing
 * See: https://github.com/mksarge/redux-first-routing
 */
  return (history, store) => {

    store.dispatch(actions.locationChange({
      pathname: history.location.pathname,
      search: history.location.search,
      view: (history.location.pathname === '/' ? 'home': history.location.pathname.substr(1))
    }));

    history.listen((location) => {
      // noinspection JSUnresolvedVariable
      console.log('History listener', location);
      store.dispatch(actions.locationChange({
        pathname: location.pathname,
        search: location.search
      }));
    });
  }
}
