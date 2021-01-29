import * as intercept from 'intercept-link-clicks';

export const connector = function(store, configuration, startListener, actions, router, renderer, emitter) {
  console.log('Connector:constructor');
  let currentLocation;
  let previousLocation;
  let previousView;
  let currentView;
  let unsubscribe;
  let state;
  emitter.addListener('config', (event) => {
    console.log('Connector:config:event', event);
    if (typeof event.templates !== 'undefined') {
      this.templates = event.templates;
      /* Start the history listener, which automatically dispatches
       * actions to keep the store in sync with the history */
      startListener(configuration.history, store);
      state = store.getState();
      currentLocation = state.router.pathname;
      currentView = state.router.view;

      /* subscribe() returns a function for unregistering the listener */
      unsubscribe = store.subscribe(() => {
        const state = store.getState();
        previousLocation = currentLocation;
        previousView = currentView;
        currentView = state.router.view;
        currentLocation = state.router.pathname
        /* Does not run on page load, only on route change */
        if (previousLocation !== currentLocation) {
          console.log(`Location changed from ${previousLocation} to ${currentLocation}`);
          emitter.dispatch(`${previousView}:destroy`);
          /* This method returns the components listed in the router config */
          router.resolve({pathname: currentLocation}).then((res) => {
            console.log(`Connector:Location sub Router resolving ${currentLocation}`, res);
            emitter.dispatch(state.router.view, (res.length > 1 ? [{templates: this.templates, root: res[0], children: res[1]}]:[{templates: this.templates, root: res[0]}]));
          });
        }
      });

      /* Runs on page load to display initial route */
      router.resolve({pathname: currentLocation}).then((res) => {
        console.log(`Connector:Router resolving initial route ${currentLocation}`, res);
        console.log('Connector:Router checking initial view', store.getState().router.view, previousView);
        /* Turn off the active state on all links with an href attribute */
        Array.prototype.forEach.call(document.querySelectorAll('[href^="/"]'), function(el) {
          el.classList.remove('active');
        });
        /* match the current link and set to active */
        const link = document.querySelector(`[href='${currentLocation}']`);
        if (link) {
          link.classList.add('active');
        }
        emitter.dispatch(store.getState().router.view, (res.length > 1 ? [{templates: this.templates, root: res[0], children: res[1]}]:[{templates: this.templates, root: res[0]}]));
      });
    }
  })

  /* Intercept any link with an href attribute */
  intercept(function(event, element) {
    // console.log(`intercepted ${event.target.id}`);
    if (event.target.href) {
      event.preventDefault();
      console.log(`Connector:Intercepted link ${event.target.pathname}`);
      Array.prototype.forEach.call(document.querySelectorAll('[href^="/"]'), function (el) {
        el.classList.remove('active');
      });
      event.target.classList.add('active');
      console.log(`Connector:Intercepted dispatch ${event.target.pathname}`);
      store.dispatch(actions.push(event.target.pathname));
    }
  });
}
