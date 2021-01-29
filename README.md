## A super lightweight client side framework setup/example using Soma, Redux, i18next, EJS, SCSS, Bootstrap, Material Design icons and Webpack

Demo is a todo application. Through the magic of Webpack it is reduced from about 1,300kb down to 111kb

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
[Soma is a scalable Javascript framework](https://github.com/soundstep/soma) created to help developers to write loosely-coupled applications to increase scalability and maintainability.
I think it is the perfect balance when you don't want a full framework like React, Angular or Vue and it can be super powerful if it is combined with a lightweight router and maybe two-way binding...

The older version, soma.js can be found [here](https://github.com/somajs/somajs), and is fully documented [here](http://somajs.github.io/somajs/site/). Upgrading to the newer version of soma is  fairly easy. I believe the only thing that really changed in implementation is that the dispatcher is now the emitter.
Internally the latest soma uses two other libraries that are pretty amazing as well, [infuse](https://github.com/soundstep/infuse) and [signals](https://github.com/millermedeiros/js-signals), also ported from Actionscript.
I am not sure why I didn't discover them back in my Actionscript days, maybe I was too busy trying to get pureMVC and robot legs working.
Anyway, a big thank you to [Romuald Quantin](http://www.soundstep.com/blog/about/) for the really elegant framework.

Redux can be found [here](https://github.com/reduxjs/redux), and the documentation is [here](https://redux.js.org/introduction/getting-started)

i18next client side localization found [here](https://github.com/i18next/i18next) and documented [here](https://www.i18next.com/overview/getting-started)

EJS template rendering works both server and client side, however the webpack client side setup is a [bit tricky](https://github.com/gregbown/soma-redux-i18next-webpack/blob/fb956ef0ada4d263a1d23c1f76e190953a9a075a/webpack.config.js#L16) because the library includes fs and path from NodeJS
The EJS library can be found [here](https://github.com/mde/ejs). 
I discovered an interesting way to use EJS templates somewhat like a JSX component logic, based on this [stackoverflow](https://stackoverflow.com/questions/53797268/making-component-like-elements-in-ejs)
Using [this method](https://github.com/gregbown/soma-redux-i18next-webpack/blob/5bc24b06c85dc3ffae4a5a17a877fa010c154121/_assets/json/config.json#L18) the todos conditionally render based on the filters All, Completed and Active.

[Bootstrap](https://getbootstrap.com/docs/5.0/getting-started/introduction/) is also included, along with theme compilation in SCSS. [repo](https://github.com/twbs/bootstrap)
Note: Bootstrap 5 has quite a few breaking changes so be sure to read the migration section in their documentation!

Using [Material Design icons](https://material.io/resources/icons/?style=baseline) along with the [latest SASS/SCSS CSS compilation](https://github.com/sass/dart-sass).
I implemented the Material Design icons in a slightly different way than most people would, [using sudo elements :before](https://github.com/gregbown/soma-redux-i18next-webpack/blob/5bc24b06c85dc3ffae4a5a17a877fa010c154121/_scss/theme/todo-theme.scss#L176).
I am pretty excited that they work this way since adding extra span tags is not always ideal.

Using [Universal Router](https://github.com/kriasoft/universal-router) with [Redux-First Routing](https://github.com/mksarge/redux-first-routing) however I slightly modified the redux-first-routing library to include the view mapping in the state, therefore it is not in the dependencies but built into my redux store.
I made sure to include the credits and licence in my Webpack build output.

Hooked up [Redux Logger](https://github.com/LogRocket/redux-logger) as well.

Notes on using Webpack:
I had to spend a bit of time figuring out the syntax for the Webpack Terser plugin in order to minimize everything. Originally it wiped out the [infuse](https://github.com/soundstep/infuse) libraries ability to inject dependencies because method, module or class names weren't persisted.
After much experimentation, I was able to get all the JavaScript including all the libs down to 111kb!  Thank you Webpack!
Webpack can be found [here](https://github.com/webpack/webpack) and documentation [here](https://webpack.js.org/concepts/)

One thing that bit me was i18next localization being called inside the EJS templating. If I wasn't careful about changing the locale with the changeLanguage method prior to rendering, it would render the old locale despite the state reflecting the proper locale.

Todo: I haven't localized the top navigation yet.

