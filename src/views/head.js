import cookies from 'browser-cookies';
import {foot} from "./foot";

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
  console.log('Header:constructor');
  this.header = document.getElementsByTagName('header')[0];
  this._store = store;
  this._actions = actions;
  this._renderer = renderer;
  this._emitter = emitter;
  this._current = this._store.getState();
  this._store.subscribe(this.storeUpdated.bind(this));
  this._emitter.addListener('config', (event) => {
    console.log('View:config:event', event);
    if (typeof event.templates !== 'undefined') {
      this.templates = event.templates;
      this.render(this._current);
    }
  })
  return this;
};

head.prototype = {
  render: function(state) {
    this._renderer.render(this, state, {mode: 'replace', id: 'header'}, this.addListeners);
  },
  storeUpdated: function() {
    this._current = this._store.getState();
    console.log('Store updated in header', this._current);
    cookies.set('locale', this._current.locale, {expires: new Date(Date.now() + 86400000), httpOnly: false, domain: '127.0.0.1'});
    window['i18next'].changeLanguage(this._current.locale)
      .then((t) => {
        console.log(`${t('locale')}`);
        this.render(this._current);
      }).catch((err) => {
        console.log('something went wrong loading', err);
      })
  },
  localeEventHandler: function(event) {
    event.preventDefault();
    console.log(`Switch locale to ${event.target.dataset.locale}`);
    Array.prototype.forEach.call(document.getElementsByClassName('locale-link'), function(element) {
      element.removeAttribute('disabled');
      element.classList.remove('active');
    });
    this._store.dispatch( this._actions.setLocale(event.target.dataset.locale));
    // EAZACT.rws.post('/locale', JSON.stringify({locale: selectedLocale}), tokens[0].value, function(res) {
    //   if (res.result === 'Success') {
    //     window.location.reload();
    //   }
    // });
  },
  addListeners: function(instance) {
    console.log('Add header listeners');
    instance.header = document.getElementsByTagName('header')[0];
    /* HTMLCollection does not have forEach despite being array like */
    Array.prototype.forEach.call(document.getElementsByClassName('locale-link'), function(element) {
      element.addEventListener('click', instance.localeEventHandler.bind(instance), false);
      // if (element.classList.contains('active')) {
      //   element.setAttribute('disabled', '');
      // }
    }.bind(instance));
  }
}
