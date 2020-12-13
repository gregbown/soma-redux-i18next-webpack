import * as _ from 'lodash';
import * as $ from 'jquery';
import 'popper.js/dist/umd/popper';
import 'bootstrap/dist/js/bootstrap';
import i18next from 'i18next';
import i18nextXHRBackend from 'i18next-xhr-backend';
import i18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import cookies from 'browser-cookies';
import ejs from 'ejs';
import * as soma from '@soundstep/soma/dist/soma';
import {rws} from './services/rws';
import {loader} from './services/loader';
import {renderer} from './services/renderer';
import {actions} from './actions';
import {todos} from './reducers/todos';
import {filter} from './reducers/filter';
import {locale} from './reducers/locale';
import {reducers} from './reducers/reducers';
import {configuration} from './store/configuration';
import {store} from './store';
import {head} from './views/common/head';
import {input} from './views/todo/input';
import {list} from './views/todo/list';
import {filtering} from './views/todo/foot';
import {router} from './controllers/router';

'use strict';

if (typeof $ === 'undefined') {
  /* Used internally for AJAX service and indirectly by Bootstrap component locale dropdown */
  throw new Error('jQuery is not defined');
}
if (typeof _ === 'undefined') {
  /* Not using internally but is included for example */
  throw new Error('Lodash is not defined');
}
if (typeof ejs === 'undefined') {
  /* EJS is used in the renderer */
  throw new Error('ERROR: EJS is not defined in renderer');
}

/**
 * @description Define IOC container here
 * Note: can also use class structure if preferred.
 * See: https://github.com/soundstep/soma/blob/master/examples/helloworld/index.html */
const App = new soma.Application.extend({
  init: function() {
    /* Important! These string names must be added to webpack terser plugin reserved array */
    this.injector.mapClass('rws', rws, true);
    this.injector.mapClass('loader', loader, true);
    this.injector.mapClass('renderer', renderer, true);
    this.injector.mapClass('actions', actions, true);
    this.injector.mapClass('todos', todos, true);
    this.injector.mapClass('filter', filter, true);
    this.injector.mapClass('locale', locale, true);
    this.injector.mapClass('reducers', reducers, true);
    this.injector.mapClass('configuration', configuration, true);
    this.injector.mapClass('store', store, true);
    this.injector.mapClass('head', head, true);
    this.injector.mapClass('input', input, true);
    this.injector.mapClass('list', list, true);
    this.injector.mapClass('filtering', filtering, true);
    // TODO Routing is not implemented yet
    this.injector.mapClass('router', router, true);
  },
  start: function() {
    /* Set if not set. Typically this cookie should be set by the server, Apache, NGINX etc.
     * to the users preferred language set in their browser.  TODO Create document for doing this on server */
    const lng = cookies.get('locale') || 'en';
    cookies.set('locale', lng, {expires: new Date(Date.now() + 86400000), httpOnly: false, domain: '127.0.0.1'});
    const i18nOptions = {
      fallbackLng: lng,
      preload: ['en', 'zh'],
      load: 'languageOnly', // Prevents backend from trying to load ./en-US/...
      ns: 'translation', // The name of your JSON file
      detectLanguage: true, // lookupQuerystring is the cookie key
      detection: {order: ['cookie', 'querystring'], lookupCookie: 'locale', lookupQuerystring: 'locale', caches: false},
      defaultNS: 'translation', // The name of your JSON file
      backend: {loadPath: '/json/locales/{{lng}}/{{ns}}.json'},
      getAsync: false
    };

    /**
     * Initializes the i18next on the client.
     * Henceforth, any script can utilize the server side localization mappings by
     * calling the window.i18next.t('key') method to localize a string.
     *
     * NOTE: In the client, use => window.i18next.t('key) NOT i18n.t
     */
    i18next.use(i18nextBrowserLanguageDetector).use(i18nextXHRBackend).init(i18nOptions).then(function(result) {
      /* Fix for global availability, not sure why webpack provide does not work here */
      window['i18next'] = i18next;
      console.log(`Localization ${(i18next.t('test') === 'loaded' ? 'is loaded' : 'failed to load')}`, result);
      const head = this.injector.getValue('head');
      const input = this.injector.getValue('input');
      const list = this.injector.getValue('list');
      const filtering = this.injector.getValue('filtering');
      const loader = this.injector.getValue('loader');
      this.emitter.dispatch('start');
    }.bind(this));
  }
});

const app = new App();
app.start();


