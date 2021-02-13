import * as intercept from 'intercept-link-clicks';
import UniversalRouter from "universal-router";

export const router = function(store, configuration, startListener, actions, renderer, emitter) {
  console.log('Router:constructor');
  let dynamicRouter;
  let currentLocation;
  let previousLocation;
  let previousView;
  let currentView;
  let unsubscribe;
  let templates;
  let state;
  let routes;

  /* Universal Router Options with custom resolve */
  const options = {
    context: {},
    baseUrl: '',
    resolveRoute(context, params) {
      if (typeof context.route.action === 'function') {
        if (typeof context.route.children !== 'undefined') {
          const all = [context.route.action(context, params)];
          for (let child = 0;child < context.route.children.length; child++) {
            all.push(context.route.children[child].action(context, params));
          }
          return all;
        }
        return context.route.action(context, params)
      }
      return undefined
    },
    errorHandler(err, context) {
      console.log('router error', err)
      console.log('router error context', context)
      return [
        {component: 'error'}
      ]
    }
  }
  /* The config event fires when the configuration JSON is loaded */
  emitter.addListener('config', (event) => {
    console.log('Router:config:event', event);
    if (typeof event.templates !== 'undefined' && typeof event.routes !== 'undefined') {
      /* templates from JSON */
      templates = event.templates;
      /* parse routes from JSON into functional configuration */
      routes = event.routes.map((route) => {
        const temp = {
          path: route.path,
          action: (context, param) => [{component: route.component}]
        }
        if (typeof route.children !== 'undefined') {
          temp.children = [
            {
              path: route.children.path,
              action: (context, param) => [...route.children.component]
            }
          ]
        }
        return temp;
      });

      /* The dynamic routes are now parsed, so can instantiate router */
      dynamicRouter = new UniversalRouter(routes, options);

      /* Start the history listener, which automatically dispatches
       * actions to keep the store in sync with the history */
      startListener(configuration.history, store, event.routes);
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
          console.log(`Router:Location changed from ${previousLocation} to ${currentLocation}`);

          /* Since we are changing routes, we should clean up old component */
          emitter.dispatch(`${previousView}:destroy`);

          /* This method returns the components listed in the router config */
          dynamicRouter.resolve({pathname: currentLocation}).then((res) => {
            console.log(`Router:Location sub Router resolving ${currentLocation}`, res);
            emitter.dispatch(state.router.view, (res.length > 1 ? [{templates: templates, root: res[0], children: res[1]}]:[{templates: templates, root: res[0]}]));
          });
        }
      });

      /* Runs on initial page load to display initial route */
      dynamicRouter.resolve({pathname: currentLocation}).then((res) => {
        console.log(`Router:Router resolving initial route ${currentLocation}`, res);
        console.log('Router:Router checking initial view', store.getState().router.view, previousView);
        /* Turn off the active state on all links with an href attribute */
        Array.prototype.forEach.call(document.querySelectorAll('[href^="/"]'), function(el) {
          el.classList.remove('active');
        });
        /* match the current link and set to active */
        const link = document.querySelector(`[href='${currentLocation}']`);
        if (link) {
          link.classList.add('active');
        }
        emitter.dispatch(store.getState().router.view, (res.length > 1 ? [{templates: templates, root: res[0], children: res[1]}]:[{templates: templates, root: res[0]}]));
      });
    } else {
      throw new Error('Error: templates were undefined in config event');
    }
  })

  /* Intercept any link with an href attribute */
  intercept(function(event, element) {
    // console.log(`intercepted ${event.target.id}`);
    if (event.target.href) {
      event.preventDefault();
      console.log(`Router:Intercepted link ${event.target.pathname}`);
      Array.prototype.forEach.call(document.querySelectorAll('[href^="/"]'), function (el) {
        el.classList.remove('active');
      });
      event.target.classList.add('active');
      console.log(`Router:Intercepted dispatch ${event.target.pathname}`);
      store.dispatch(actions.push(event.target.pathname));
    }
  });
}
