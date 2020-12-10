## A super lightweight client side framework setup/example using Soma, Redux, i18next, EJS, SCSS, Material Design icons and webpack

Demo is a todo application

Build:

```bash
npm run build
```

Serve using [local-web-server](https://github.com/lwsjs/local-web-server):

```bash
npm run serve:prod
```
[Soma is a scalable Javascript framework](https://github.com/soundstep/soma) created to help developers to write loosely-coupled applications to increase scalability and maintainability.
I think it is the perfect balance when you don't want a full framework like React, Angular or Vue and it can be super powerful if it is combined with a lightweight router and maybe two-way binding...

The older version found [here](https://github.com/somajs/somajs) is documented [here](http://somajs.github.io/somajs/site/)
Internally soma uses two other libraries that are pretty amazing as well, [infuse](https://github.com/soundstep/infuse) and [signals](https://github.com/millermedeiros/js-signals), also ported from Actionscript.
I am not sure why I didn't discover them back in my Actionscript days, maybe I was too busy trying to get pureMVC and robot legs working.
Anyway, a big thank you to [Romuald Quantin](http://www.soundstep.com/blog/about/) for the really elegant framework.

Redux can be found [here](https://github.com/reduxjs/redux), and the documentation is [here](https://redux.js.org/introduction/getting-started)

i18next client side localization found [here](https://github.com/i18next/i18next) and documented [here](https://www.i18next.com/overview/getting-started)

EJS template rendering works both server and client side, however the webpack client side setup is a bit tricky because the library includes fs and path from NodeJS
The EJS library can be found [here](https://github.com/mde/ejs)

Webpack can be found [here](https://github.com/webpack/webpack) and documentation [here](https://webpack.js.org/concepts/)

Using [Material Design icons](https://material.io/resources/icons/?style=baseline) along with the [latest SASS/SCSS CSS compilation](https://github.com/sass/dart-sass).
The Material Design icons are implemented in a slightly different way than most people would, using sudo elements :before.
I am pretty excited that they work this way since adding extra span tags is not always ideal.

TODO: improve webpack build to maybe have a dev mode

