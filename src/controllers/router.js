/**!
 * Copyright (c) 2012 TJ Holowaychuk <tj@vision-media.ca>
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
 * files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
 * is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Modified from original See: See: https://github.com/visionmedia/page.js
 */

'use strict';

/**
 * Module dependencies.
 */

const pathToRegexp = require('path-to-regexp');

/**
 * Short-cuts for global-object checks
 */

const hasDocument = ('undefined' !== typeof document);
const hasWindow = ('undefined' !== typeof window);
const hasHistory = ('undefined' !== typeof history);
const hasProcess = typeof process !== 'undefined';

/**
 * Detect click event
 */
const clickEvent = hasDocument && document.ontouchstart ? 'touchstart' : 'click';

// noinspection JSUnresolvedVariable
/**
 * To work properly with the URL
 * history.location generated polyfill in https://github.com/devote/HTML5-History-API
 */
const isLocation = hasWindow && !!(window.history.location || window.location);

/**
 * The route instance
 * @api private
 */
function Router() {
  // public things
  this.callbacks = [];
  this.exits = [];
  this.current = '';
  this.len = 0;

  // private things
  this._decodeURLComponents = true;
  this._base = '';
  this._strict = false;
  this._running = false;

  // bound functions
  this.clickHandler = this.clickHandler.bind(this);
  this._onpopstate = this._onpopstate.bind(this);
}

/**
 * Configure the instance of route. This can be called multiple times.
 *
 * @param {Object} options
 * @api public
 */

Router.prototype.configure = function(options) {
  const opts = options || {};

  this._window = opts.window || (hasWindow && window);
  this._decodeURLComponents = opts.decodeURLComponents !== false;
  this._popstate = opts.popstate !== false && hasWindow;
  this._click = opts.click !== false && hasDocument;

  const _window = this._window;
  if(this._popstate) {
    _window.addEventListener('popstate', this._onpopstate, false);
  } else if(hasWindow) {
    _window.removeEventListener('popstate', this._onpopstate, false);
  }

  if (this._click) {
    _window.document.addEventListener(clickEvent, this.clickHandler, false);
  } else if(hasDocument) {
    _window.document.removeEventListener(clickEvent, this.clickHandler, false);
  }
};

/**
 * Get or set basepath to `path`.
 *
 * @param {string} path
 * @api public
 */

Router.prototype.base = function(path) {
  if (0 === arguments.length) return this._base;
  this._base = path;
};

/**
 * Gets the `base`, which depends on whether we are using History or
 * hashbang routing.
 * @api private
 */
Router.prototype._getBase = function() {
  let base = this._base;
  if(!!base) return base;
  const loc = hasWindow && this._window && this._window.location;
  return base;
};

/**
 * Get or set strict path matching to `enable`
 *
 * @param {boolean} enable
 * @api public
 */

Router.prototype.strict = function(enable) {
  if (0 === arguments.length) return this._strict;
  this._strict = enable;
};


/**
 * Bind with the given `options`.
 *
 * Options:
 *
 *    - `click` bind to click events [true]
 *    - `popstate` bind to popstate [true]
 *    - `dispatch` perform initial dispatch [true]
 *
 * @param {Object} options
 * @api public
 */

Router.prototype.start = function(options) {
  const opts = options || {};
  this.configure(opts);

  if (false === opts.dispatch) return;
  this._running = true;

  let url;
  if(isLocation) {
    const window = this._window;
    const loc = window.location;
    url = loc.pathname + loc.search;
  }

  this.replace(url, null, true, opts.dispatch);
};

/**
 * Unbind click and popstate event handlers.
 *
 * @api public
 */

Router.prototype.stop = function() {
  if (!this._running) return;
  this.current = '';
  this.len = 0;
  this._running = false;

  const window = this._window;
  this._click && window.document.removeEventListener(clickEvent, this.clickHandler, false);
  hasWindow && window.removeEventListener('popstate', this._onpopstate, false);
};

/**
 * Show `path` with optional `state` object.
 *
 * @param {string} path
 * @param {Object=} state
 * @param {boolean=} dispatch
 * @param {boolean=} push
 * @return {!Context}
 * @api public
 */

Router.prototype.show = function(path, state, dispatch, push) {
  const ctx = new Context(path, state, this),
    prev = this.prevContext;
  this.prevContext = ctx;
  this.current = ctx.path;
  if (false !== dispatch) this.dispatch(ctx, prev);
  if (false !== ctx.handled && false !== push) ctx.pushState();
  return ctx;
};

/**
 * Goes back in the history
 * Back should always let the current route push state and then go back.
 *
 * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to route.base
 * @param {Object=} state
 * @api public
 */

Router.prototype.back = function(path, state) {
  const route = this;
  if (this.len > 0) {
    const window = this._window;
    // this may need more testing to see if all browsers
    // wait for the next tick to go back in history
    hasHistory && window.history.back();
    this.len--;
  } else if (path) {
    setTimeout(function() {
      route.show(path, state);
    },0);
  } else {
    setTimeout(function() {
      route.show(route._getBase(), state);
    },0);
  }
};

/**
 * Register route to redirect from one path to other
 * or just redirect to another route
 *
 * @param {string} from - if param 'to' is undefined redirects to 'from'
 * @param {string=} to
 * @api public
 */
Router.prototype.redirect = function(from, to) {
  const inst = this;

  // Define route from a path to another
  if ('string' === typeof from && 'string' === typeof to) {
    route.call(this, from, function(e) {
      setTimeout(function() {
        inst.replace(/** @type {!string} */ (to));
      }, 0);
    });
  }

  // Wait for the push state and replace it with another
  if ('string' === typeof from && 'undefined' === typeof to) {
    setTimeout(function() {
      inst.replace(from);
    }, 0);
  }
};

/**
 * Replace `path` with optional `state` object.
 *
 * @param {string} path
 * @param {Object=} state
 * @param {boolean=} init
 * @param {boolean=} dispatch
 * @return {!Context}
 * @api public
 */


Router.prototype.replace = function(path, state, init, dispatch) {
  const ctx = new Context(path, state, this),
    prev = this.prevContext;
  this.prevContext = ctx;
  this.current = ctx.path;
  ctx.init = init;
  ctx.save(); // save before dispatching, which may redirect
  if (false !== dispatch) this.dispatch(ctx, prev);
  return ctx;
};

/**
 * Dispatch the given `ctx`.
 *
 * @param {Context} ctx
 * @api private
 */

Router.prototype.dispatch = function(ctx, prev) {
  let i = 0, j = 0, route = this;

  function nextExit() {
    const fn = route.exits[j++];
    if (!fn) return nextEnter();
    fn(prev, nextExit);
  }

  function nextEnter() {
    const fn = route.callbacks[i++];

    if (ctx.path !== route.current) {
      ctx.handled = false;
      return;
    }
    if (!fn) return unhandled.call(route, ctx);
    fn(ctx, nextEnter);
  }

  if (prev) {
    nextExit();
  } else {
    nextEnter();
  }
};

/**
 * Register an exit route on `path` with
 * callback `fn()`, which will be called
 * on the previous context when a new
 * route is visited.
 */
Router.prototype.exit = function(path, fn) {
  if (typeof path === 'function') {
    return this.exit('*', path);
  }

  const route = new Route(path, null, this);
  for (let i = 1; i < arguments.length; ++i) {
    this.exits.push(route.middleware(arguments[i]));
  }
};

/**
 * Handle "click" events.
 */

/* jshint +W054 */
Router.prototype.clickHandler = function(e) {
  if (1 !== this._which(e)) return;

  if (e.metaKey || e.ctrlKey || e.shiftKey) return;
  if (e.defaultPrevented) return;

  // ensure link
  // use shadow dom when available if not, fall back to composedPath()
  // for browsers that only have shady
  let el = e.target;
  const eventPath = e.path || (e.composedPath ? e.composedPath() : null);

  if(eventPath) {
    for (let i = 0; i < eventPath.length; i++) {
      if (!eventPath[i].nodeName) continue;
      if (eventPath[i].nodeName.toUpperCase() !== 'A') continue;
      if (!eventPath[i].href) continue;

      el = eventPath[i];
      break;
    }
  }

  // continue ensure link
  // el.nodeName for svg links are 'a' instead of 'A'
  while (el && 'A' !== el.nodeName.toUpperCase()) el = el.parentNode;
  if (!el || 'A' !== el.nodeName.toUpperCase()) return;

  // check if link is inside an svg
  // in this case, both href and target are always inside an object
  const svg = (typeof el.href === 'object') && el.href.constructor.name === 'SVGAnimatedString';

  // Ignore if tag has
  // 1. "download" attribute
  // 2. rel="external" attribute
  if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

  // ensure non-hash for the same path
  const link = el.getAttribute('href');

  // Check for mailto: in the href
  if (link && link.indexOf('mailto:') > -1) return;

  // check target
  // svg target is an object and its desired value is in .baseVal property
  if (svg ? el.target.baseVal : el.target) return;

  // x-origin
  // note: svg links that are not relative don't call click events (and skip route.js)
  // consequently, all svg links tested inside route.js are relative and in the same origin
  if (!svg && !this.sameOrigin(el.href)) return;

  // rebuild path
  // There aren't .pathname and .search properties in svg links, so we use href
  // Also, svg href is an object and its desired value is in .baseVal property
  let path = svg ? el.href.baseVal : (el.pathname + el.search);

  path = path[0] !== '/' ? '/' + path : path;

  // strip leading "/[drive letter]:" on NW.js on Windows
  if (hasProcess && path.match(/^\/[a-zA-Z]:\//)) {
    path = path.replace(/^\/[a-zA-Z]:\//, '/');
  }

  // same route
  const orig = path;
  const routeBase = this._getBase();

  if (path.indexOf(routeBase) === 0) {
    path = path.substr(routeBase.length);
  }

  if (routeBase && orig === path && (!isLocation || this._window.location.protocol !== 'file:')) {
    return;
  }

  e.preventDefault();
  this.show(orig);
};

/**
 * Handle "populate" events.
 * @api private
 */

Router.prototype._onpopstate = (function () {
  let loaded = false;
  if ( ! hasWindow ) {
    return function () {};
  }
  if (hasDocument && document.readyState === 'complete') {
    loaded = true;
  } else {
    window.addEventListener('load', function() {
      setTimeout(function() {
        loaded = true;
      }, 0);
    });
  }
  return function onpopstate(e) {
    if (!loaded) return;
    const route = this;
    if (e.state) {
      const path = e.state.path;
      route.replace(path, e.state);
    } else if (isLocation) {
      const loc = route._window.location;
      route.show(loc.pathname + loc.search, undefined, undefined, false);
    }
  };
})();

/**
 * Event button.
 */
Router.prototype._which = function(e) {
  e = e || (hasWindow && this._window.event);
  return null == e.which ? e.button : e.which;
};

/**
 * Convert to a URL object
 * @api private
 */
Router.prototype._toURL = function(href) {
  const window = this._window;
  if(typeof URL === 'function' && isLocation) {
    return new URL(href, window.location.toString());
  } else if (hasDocument) {
    const anc = window.document.createElement('a');
    anc.href = href;
    return anc;
  }
};

/**
 * Check if `href` is the same origin.
 * @param {string} href
 * @api public
 */
Router.prototype.sameOrigin = function(href) {
  if(!href || !isLocation) return false;

  const url = this._toURL(href);
  const window = this._window;

  const loc = window.location;

  /*
     When the port is the default http port 80 for http, or 443 for
     https, internet explorer 11 returns an empty string for loc.port,
     so we need to compare loc.port with an empty string if url.port
     is the default port 80 or 443.
     Also the comparison with `port` is changed from `===` to `==` because
     `port` can be a string sometimes. This only applies to ie11.
  */
  // noinspection EqualityComparisonWithCoercionJS
  return loc.protocol === url.protocol &&
    loc.hostname === url.hostname &&
    (loc.port === url.port || loc.port === '' && (url.port == 80 || url.port == 443)); // jshint ignore:line
};

/**
 * @api private
 */
Router.prototype._samePath = function(url) {
  if(!isLocation) return false;
  const window = this._window;
  const loc = window.location;
  return url.pathname === loc.pathname &&
    url.search === loc.search;
};

/**
 * Remove URL encoding from the given `str`.
 * Accommodates whitespace in both x-www-form-urlencoded
 * and regular percent-encoded form.
 *
 * @param {string} val - URL component to decode
 * @api private
 */
Router.prototype._decodeURLEncodedURIComponent = function(val) {
  if (typeof val !== 'string') { return val; }
  return this._decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
};

/**
 * Create a new `route` instance and function
 */
export const router = function() {
  const routeInstance = new Router();

  function routeFn(/* args */) {
    return route.apply(routeInstance, arguments);
  }

  // Copy all of the things over. In 2.0 maybe we use setPrototypeOf
  routeFn.callbacks = routeInstance.callbacks;
  routeFn.exits = routeInstance.exits;
  routeFn.base = routeInstance.base.bind(routeInstance);
  routeFn.strict = routeInstance.strict.bind(routeInstance);
  routeFn.start = routeInstance.start.bind(routeInstance);
  routeFn.stop = routeInstance.stop.bind(routeInstance);
  routeFn.show = routeInstance.show.bind(routeInstance);
  routeFn.back = routeInstance.back.bind(routeInstance);
  routeFn.redirect = routeInstance.redirect.bind(routeInstance);
  routeFn.replace = routeInstance.replace.bind(routeInstance);
  routeFn.dispatch = routeInstance.dispatch.bind(routeInstance);
  routeFn.exit = routeInstance.exit.bind(routeInstance);
  routeFn.configure = routeInstance.configure.bind(routeInstance);
  routeFn.sameOrigin = routeInstance.sameOrigin.bind(routeInstance);
  routeFn.clickHandler = routeInstance.clickHandler.bind(routeInstance);

  routeFn.create = router;

  Object.defineProperty(routeFn, 'len', {
    get: function(){
      return routeInstance.len;
    },
    set: function(val) {
      routeInstance.len = val;
    }
  });

  Object.defineProperty(routeFn, 'current', {
    get: function(){
      return routeInstance.current;
    },
    set: function(val) {
      routeInstance.current = val;
    }
  });

  // In 2.0 these can be named exports
  routeFn.Context = Context;
  routeFn.Route = Route;

  return routeFn;
}

/**
 * Register `path` with callback `fn()`,
 * or route `path`, or redirection,
 * or `route.start()`.
 *
 *   route(fn);
 *   route('*', fn);
 *   route('/user/:id', load, user);
 *   route('/user/' + user.id, { some: 'thing' });
 *   route('/user/' + user.id);
 *   route('/from', '/to')
 *   route();
 *
 * @param {string|!Function|!Object} path
 * @param {Function=} fn
 * @api public
 */

function route(path, fn) {
  // <callback>
  if ('function' === typeof path) {
    return route.call(this, '*', path);
  }

  // route <path> to <callback ...>
  if ('function' === typeof fn) {
    const _route = new Route(/** @type {string} */ (path), null, this);
    for (let i = 1; i < arguments.length; ++i) {
      this.callbacks.push(_route.middleware(arguments[i]));
    }
    // show <path> with [state]
  } else if ('string' === typeof path) {
    this['string' === typeof fn ? 'redirect' : 'show'](path, fn);
    // start [options]
  } else {
    this.start(path);
  }
}

/**
 * Unhandled `ctx`. When it's not the initial
 * popstate then redirect. If you wish to handle
 * 404s on your own use `route('*', callback)`.
 *
 * @param {Context} ctx
 * @api private
 */
function unhandled(ctx) {
  if (ctx.handled) return;
  let current;
  const _route = this;
  const window = _route._window;
  current = isLocation && window.location.pathname + window.location.search;

  if (current === ctx.canonicalPath) return;
  _route.stop();
  ctx.handled = false;
  isLocation && (window.location.href = ctx.canonicalPath);
}

/**
 * Escapes RegExp characters in the given string.
 *
 * @param {string} s
 * @api private
 */
function escapeRegExp(s) {
  return s.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
}

/**
 * Initialize a new "request" `Context`
 * with the given `path` and optional initial `state`.
 *
 * @constructor
 * @param {string} path
 * @param {Object=} state
 * @api public
 */

function Context(path, state, routeInstance) {
  const _route = this.route = routeInstance || route;
  const window = _route._window;


  const routeBase = _route._getBase();
  if ('/' === path[0] && 0 !== path.indexOf(routeBase)) path = routeBase + path;
  const i = path.indexOf('?');

  this.canonicalPath = path;
  const re = new RegExp('^' + escapeRegExp(routeBase));
  this.path = path.replace(re, '') || '/';

  this.title = (hasDocument && window.document.title);
  this.state = state || {};
  this.state.path = path;
  this.querystring = ~i ? _route._decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
  this.pathname = _route._decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
  this.params = {};
}

/**
 * Push state.
 *
 * @api private
 */

Context.prototype.pushState = function() {
  const route = this.route;
  const window = route._window;
  route.len++;
  if (hasHistory) {
    window.history.pushState(this.state, this.title, this.canonicalPath);
  }
};

/**
 * Save the context state.
 *
 * @api public
 */

Context.prototype.save = function() {
  const route = this.route;
  if (hasHistory) {
    route._window.history.replaceState(this.state, this.title, this.canonicalPath);
  }
};

/**
 * Initialize `Route` with the given HTTP `path`,
 * and an array of `callbacks` and `options`.
 *
 * Options:
 *
 *   - `sensitive`    enable case-sensitive routes
 *   - `strict`       enable strict matching for trailing slashes
 *
 * @constructor
 * @param {string} path
 * @param {Object=} options
 * @api private
 */

function Route(path, options, route) {
  const _route = this.route = route || globalRouter;
  const opts = options || {};
  opts.strict = opts.strict || _route._strict;
  this.path = (path === '*') ? '(.*)' : path;
  this.method = 'GET';
  this.regexp = pathToRegexp(this.path, this.keys = [], opts);
}

/**
 * Return route middleware with
 * the given callback `fn()`.
 *
 * @param {Function} fn
 * @return {Function}
 * @api public
 */

Route.prototype.middleware = function(fn) {
  const self = this;
  return function(ctx, next) {
    if (self.match(ctx.path, ctx.params)) {
      ctx.routePath = self.path;
      return fn(ctx, next);
    }
    next();
  };
};

/**
 * Check if this route matches `path`, if so
 * populate `params`.
 *
 * @param {string} path
 * @param {Object} params
 * @return {boolean}
 * @api private
 */

Route.prototype.match = function(path, params) {
  const keys = this.keys,
    qsIndex = path.indexOf('?'),
    pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
    m = this.regexp.exec(decodeURIComponent(pathname));

  if (!m) return false;

  delete params[0];

  for (let i = 1, len = m.length; i < len; ++i) {
    const key = keys[i - 1];
    const val = this.route._decodeURLEncodedURIComponent(m[i]);
    if (val !== undefined || !(Object.hasOwnProperty.call(params, key.name))) {
      params[key.name] = val;
    }
  }

  return true;
};
