export const startListener = function(actions) {

/*!
 * MIT License
 * Copyright (c) 2017 Michael Sargent redux-first-routing
 * See: https://github.com/mksarge/redux-first-routing
 */
  return (history, store, routes) => {
    const found = routes.filter((route) => route.path === history.location.pathname);
    console.log('HISTORY:LISTENER initial', history.location.pathname, found);
    store.dispatch(actions.locationChange({
      pathname: history.location.pathname,
      search: history.location.search,
      view: (found.length > 0 ? found[0].component : 'erroneous')
    }));
    history.listen((location) => {
      // noinspection JSUnresolvedVariable
      const located = routes.filter((route) => route.path === location.pathname);
      console.log('HISTORY:LISTENER location', location.pathname, routes, located);
      store.dispatch(actions.locationChange({
        pathname: location.pathname,
        search: location.search,
        view: (located.length > 0 ? located[0].component : 'erroneous')
      }));
    });
  }
}
