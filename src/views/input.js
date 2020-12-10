'use strict';

const ENTER_KEY = 13;

/**
 * Input
 *
 * @param {object} store
 * @param {object} actions
 * @param {object} renderer
 * @param {object} emitter
 *
 */
export const input = function(store, actions, renderer, emitter) {
  console.log('Page:constructor');
  this.newTodo = document.getElementById('newTodo');
  this.toggleAll = document.getElementById('toggleAll');
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
  });
  this.toggleAll.addEventListener('change', this.toggle.bind(this));
};

input.prototype = {
  focus: function(event) {
    console.log('View:focus', event);
    this.newTodo.addEventListener('keyup', this.keyboard.bind(this));
  },
  blur: function(event) {
    console.log('View:blur', event);
    this.newTodo.removeEventListener('keyup', this.keyboard.bind(this));
  },
  keyboard: function(event) {
    console.log('View:keyup', event);
    const value = event.target.value.trim();
    if ((event.keyCode === ENTER_KEY || event.which === ENTER_KEY) && value !== '' ) {
      event.target.blur();
      this._store.dispatch( this._actions.addTodo(value));
      event.target.value = '';
    }
  },
  addListeners(instance) {
    instance.newTodo = document.getElementById('newTodo');
    instance.newTodo.addEventListener('focus', instance.focus.bind(instance));
    instance.newTodo.addEventListener('blur', instance.blur.bind(instance));
  },
  render: function(state) {
    this._renderer.render(this, state, {mode: 'replace', id: 'newTodo'}, this.addListeners);
  },
  storeUpdated: function() {
    this._current = this._store.getState();
    console.log('Store updated in input', this._current);
    this.render(this._current);
  },
  toggle: function(event) {
    console.log('Toggle all in input', event);
    event.target.blur();
    this._store.dispatch( this._actions.completeAllTodos());
  }
}
