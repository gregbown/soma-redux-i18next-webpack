// import {startListener, push} from 'redux-first-routing';

export const connect = function(store, configuration, startListener, actions, router, renderer ) {
  console.log('Connect:constructor');
  // Start the history listener, which automatically dispatches actions to keep the store in sync with the history
  // startListener(configuration.createBrowserHistory(), store);
  startListener(configuration.history, store);

  // Now you can read the location from the store!
  let currentLocation = store.getState().router.pathname;

  // subscribe() returns a function for unregistering the listener
  const unsubscribe = store.subscribe(() => {
    let previousLocation = currentLocation;
    const state = store.getState();
    currentLocation = state.router.pathname

    console.log(`Location changed to ${currentLocation}`, state);
    if (previousLocation !== currentLocation) {
      console.log(`Location changed from ${previousLocation} to ${currentLocation}`);
      // Render your application reactively here (optionally using a compatible router)
      switch (state.router.view) {
        case 'todo':
          console.log('Render todo');
          break;
        default:
          console.log('Render home');
      }
      router.resolve(currentLocation).then(res => console.log(res))
    }
  });

  setTimeout(function() {
    console.log('dispatch /todo');
    store.dispatch(actions.push('/todo?eat=food'));
    // store.dispatch(push('/todo?eat=food'));
  }, 3000);
}
