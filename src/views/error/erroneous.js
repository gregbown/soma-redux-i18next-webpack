'use strict';

/**
 * Home
 *
 * @param {object} store
 * @param {object} actions
 * @param {object} renderer
 * @param {object} emitter
 *
 */
export const erroneous = function (store, actions, renderer, emitter) {
  console.log('Erroneous:constructor');
  this.templates = null;
  this._unsubscribe = null;
  this._previous = null;
  this._store = store;
  this._actions = actions;
  this._renderer = renderer;
  this._emitter = emitter;
  this._emitter.addListener('erroneous', this.init.bind(this));
  this._emitter.addListener('erroneous:destroy', this.destroy.bind(this));
};

erroneous.prototype = {
  init: function(event) {
    console.log('Erroneous:init:event', event);
    if (typeof event.templates === 'undefined') {
      throw new Error('error: templates are undefined in input  component');
    }
    this.templates = event.templates;
    this._previous = JSON.parse(JSON.stringify(this._store.getState()));
    this._unsubscribe = this._store.subscribe(this.update.bind(this));
    this.render(this._store.getState());
  },
  render: function(state) {
    this._renderer.render(this, state, {mode: 'afterbegin', id: 'app', template: 'error'}, this.rendered);
  },
  update: function() {
    /* Safety measure for any events in flight during unsubscribe */
    if (typeof this._unsubscribe === 'function') {
      const diff = DD.DeepDiff(this._previous, this._store.getState(), function (path, key) {
        /* Only respond to to filter state change */
        const exclude = ['todos', 'filter', 'router'];
        return (path.length === 0 && exclude.indexOf(key) > -1);
      });
      /* Re-do deep copy */
      this._previous = JSON.parse(JSON.stringify(this._store.getState()));
      console.log('STORE:UPDATE:ERROR', (typeof diff !== 'undefined' ? diff : ' nothing changed'));
      if (typeof diff !== 'undefined') {
        this.render(this._store.getState());
      }
    }
  },
  rendered: function(instance) {
    // Do nothing
  },
  destroy: function() {
    console.log('Error:destroy:event');
    this._unsubscribe();
    this._unsubscribe = null;
  }
}

