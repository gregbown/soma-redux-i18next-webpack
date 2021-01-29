import cookies from 'browser-cookies';
import * as _ from 'lodash';

'use strict';

/**
 * Head
 *
 * @param {object} store
 * @param {object} actions
 * @param {object} renderer
 * @param {object} emitter
 *
 */
export const head = function (store, actions, renderer, emitter) {
  console.log('Head:constructor');
  this.templates = null;
  this.header = document.getElementsByTagName('header')[0];
  this._store = store;
  this._actions = actions;
  this._renderer = renderer;
  this._emitter = emitter;
  this._current = {locale: this._store.getState().locale};
  this._emitter.addListener('config', (event) => {
    console.log('Head:config:event', event);
    if (typeof event.templates !== 'undefined') {
      this.templates = event.templates;
      this.render(this._current);
    }
  });
  this._store.subscribe(this.update.bind(this));
  return this;
};

head.prototype = {
  render: function(state) {
    this._renderer.render(this, state, {mode: 'replace', id: 'header'}, this.addListeners);
  },
  update: function() {
    this._current = {locale: this._store.getState().locale};
    console.log('Store updated in header', this._current);
    cookies.set('locale', this._current.locale, {expires: new Date(Date.now() + 86400000), httpOnly: false, domain: '127.0.0.1'});
    if (this._current.locale !== window['i18next'].language) {
      window['i18next'].changeLanguage(this._current.locale)
        .then((t) => {
          // console.log(`${t('locale')}`);
          if (this.templates !== null) {
            this.render(this._current);
          }
        }).catch((err) => {
        console.log('something went wrong changing locale', err);
      })
    }
  },
  localeEventHandler: function(event) {
    event.preventDefault();
    console.log(`Switch locale to ${event.target.dataset.locale}`);
    Array.prototype.forEach.call(document.getElementsByClassName('locale-link'), function(element) {
      element.removeAttribute('disabled');
      element.classList.remove('active');
    });
    this._store.dispatch( this._actions.setLocale(event.target.dataset.locale));
  },
  addListeners: function(instance) {
    // console.log('Add header listeners');
    instance.header = document.getElementsByTagName('header')[0];
    /* HTMLCollection does not have forEach despite being array like */
    Array.prototype.forEach.call(document.getElementsByClassName('locale-link'), function(element) {
      element.addEventListener('click', instance.localeEventHandler.bind(instance), false);
    }.bind(instance));
  }
}
