## A super lightweight client side plain JavaScript SPA setup/mashup
Using Soma, Redux, Redux Logic, Universal Router, Redux First Routing, i18next, EJS, SCSS, Bootstrap, Material Design icons and Webpack
The requirements were that I needed it to play nicely with multiple external libraries.  These JavaScript libraries (unmentioned) had React and Angular abstractions but this added yet another layer of complexity to an already massive integration work load and were designed to only work with paid enterprise options.  This was a deal breaker since it would require completely rewriting the React or Angular integration when the plain JavaScript open source worked out of the box.
The demo is a proof of concept todo application. Through the magic of Webpack it is reduced from about 1,300kb down to 111kb

Dev build and run:

```bash
npm start
```
Production build:

```bash
npm run build
```

Simulates a production server using [local-web-server](https://github.com/lwsjs/local-web-server):

```bash
npm run serve:prod
```
[Soma](https://github.com/soundstep/soma) is a super lightweight plain Javascript framework created to help developers to write loosely-coupled applications to increase scalability and maintainability.
I think it is the perfect balance when you don't want, or can't use a full framework like React, Angular or Vue, and it can be super powerful when combined with a lightweight router and state management.

The older version, soma.js can be found [here](https://github.com/somajs/somajs), and is fully documented [here](http://somajs.github.io/somajs/site/). Upgrading to the newer version of soma is  fairly easy. I believe the only thing that really changed in implementation is that the dispatcher is now the emitter.
Internally the latest soma uses two other libraries that are pretty amazing as well, [infuse](https://github.com/soundstep/infuse) and [signals](https://github.com/millermedeiros/js-signals), also ported from Actionscript.
I am not sure why I didn't discover them back in my Actionscript days, maybe I was too busy trying to get pureMVC and robot legs working.
Anyway, a big thank you to [Romuald Quantin](http://www.soundstep.com/blog/about/) for the really elegant framework.

Redux does not need any explanation, it can be found [here](https://github.com/reduxjs/redux), and the documentation is [here](https://redux.js.org/introduction/getting-started)
One of the main objectives in this experiment was the need for a more robust, composable state management. Previous attempts at managing state quickly turned into spaghetti code with tightly coupled event handlers everywhere, what a relief to have the unidirectional state management of Redux.
Of course without React there was a lot of learning the nuances of leveraging this at the component level. One really starts to appreciate large frameworks like React, Angular and Vue, with all the magic they do behind the scenes.

I compared several strategies for handling effects, [Redux Thunk](https://github.com/gaearon/redux-thunk), [Redux Observable](https://github.com/redux-observable/redux-observable), [Redux Loop](https://github.com/raisemarketplace/redux-loop) and a few more. I finally went with [Redux Logic](https://github.com/jeffbski/redux-logic) as this one seemed to play the nicest with plain JavaScript, to be honest it was the only one I could integrate in a clean fashion and it also provided my with a lot of flexibility in coding style. Thank you mr. Jeff Barczewski for the effort you put into Redux Logic!
In the code, the effect is used to mock persistence layer for todos. It is not fully implemented here, just proof of concept or enough to evaluate Redux Logic.

i18next client side localization found [here](https://github.com/i18next/i18next) and documented [here](https://www.i18next.com/overview/getting-started)
One thing that bit me was i18next localization being called inside the EJS templating. If I wasn't careful about changing the locale with the changeLanguage method prior to rendering, it would render the old locale despite the state reflecting the proper locale.

EJS template rendering works both server and client side, however the webpack client side setup is a [bit tricky](https://github.com/gregbown/soma-redux-i18next-webpack/blob/fb956ef0ada4d263a1d23c1f76e190953a9a075a/webpack.config.js#L16) because the library includes fs and path from NodeJS
The EJS library can be found [here](https://github.com/mde/ejs). 
I discovered an interesting way to use EJS templates somewhat like a JSX component logic, based on this [stackoverflow](https://stackoverflow.com/questions/53797268/making-component-like-elements-in-ejs)
Using [this method](https://github.com/gregbown/soma-redux-i18next-webpack/blob/5bc24b06c85dc3ffae4a5a17a877fa010c154121/_assets/json/config.json#L18) the todos conditionally render based on the filters All, Completed and Active.

Using [Universal Router](https://github.com/kriasoft/universal-router) with [Redux-First Routing](https://github.com/mksarge/redux-first-routing) however I slightly modified the redux-first-routing library to include the view mapping in the state, therefore it is not in the dependencies but built into my redux store.
I made sure to include the credits and licence in my Webpack build output. Managed to get runtime route loading working, the routes configured in JSON, enabling the string names/paths can be changed as needed.

Hooked up [Redux Logger](https://github.com/LogRocket/redux-logger) as well.

Todo: I haven't localized the top navigation yet. I need to have finite state management for several parts of my real requirement (see requirements above), so I will be working on that piece. I would like to try rewriting EJS to include two-way binding but that is a bit ambitious.

## Making it pretty

[Bootstrap](https://getbootstrap.com/docs/5.0/getting-started/introduction/) is also included, along with theme compilation in SCSS. [repo](https://github.com/twbs/bootstrap)
Note: Bootstrap 5 has quite a few breaking changes so be sure to read the migration section in their documentation!

Using [Material Design icons](https://material.io/resources/icons/?style=baseline) along with the [latest SASS/SCSS CSS compilation](https://github.com/sass/dart-sass).
I implemented the Material Design icons in a slightly different way than most people would, [using sudo elements :before](https://github.com/gregbown/soma-redux-i18next-webpack/blob/5bc24b06c85dc3ffae4a5a17a877fa010c154121/_scss/theme/todo-theme.scss#L176).
I am pretty excited that they work this way since adding extra span tags is not always ideal.

## Build process. Notes on using Webpack:
I had to spend a bit of time figuring out the syntax for the Webpack Terser plugin in order to minimize everything. Originally it wiped out the [infuse](https://github.com/soundstep/infuse) libraries ability to inject dependencies because method, module or class names weren't persisted.
After much experimentation, I was able to get all the JavaScript including all the libs down to 111kb!  Thank you Webpack!
Webpack can be found [here](https://github.com/webpack/webpack) and documentation [here](https://webpack.js.org/concepts/)



