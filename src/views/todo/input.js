'use strict';

const ENTER_KEY = 13;

/**
 * Input
 *
 * @param {object} store
 * @param {object} actions
 * @param {object} renderer
 * @param {object} emitter
 */
export const input = function(store, actions, renderer, emitter) {
  console.log('Input:constructor');
  this.templates = null;
  this.newTodo = null;
  this._previous = null;
  this._unsubscribe = null;
  this._store = store;
  this._actions = actions;
  this._renderer = renderer;
  this._emitter = emitter;
  this._emitter.addListener('input', this.init.bind(this));
  this._emitter.addListener('input:destroy', this.destroy.bind(this));
};

input.prototype = {
  init: function(event) {
    console.log('Input:init:event', event);
    if (typeof event.templates === 'undefined') {
      throw new Error('error: templates are undefined in input  component');
    }
    this.templates = event.templates;
    this._unsubscribe = this._store.subscribe(this.update.bind(this));
    /* must be deep copy */
    this._previous = JSON.parse(JSON.stringify(this._store.getState()));
    this.render(this._store.getState());
  },
  focus: function(event) {
    // console.log('View:focus', event);
    this.newTodo.addEventListener('keyup', this.keyboard.bind(this));
  },
  blur: function(event) {
    // console.log('View:blur', event);
    this.newTodo.removeEventListener('keyup', this.keyboard.bind(this));
  },
  keyboard: function(event) {
    // console.log('View:keyup', event);
    const value = event.target.value.trim();
    /* Detect enter key */
    if ((event.keyCode === ENTER_KEY || event.which === ENTER_KEY) && value !== '') {
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
    this._renderer.render(this, state, {mode: 'replace', id: 'newTodo', template: 'newTodo'}, this.addListeners);
  },
  update: function() {
    if (typeof this._unsubscribe === 'function') {
      const diff = DD.DeepDiff(this._previous, this._store.getState(), function (path, key) {
        /* Only respond to router... probably does not even need that */
        const exclude = ['todos', 'filter'];
        return (path.length === 0 && exclude.indexOf(key) > -1);
      });
      /* Re-do deep copy */
      this._previous = JSON.parse(JSON.stringify(this._store.getState()));
      console.log('STORE:UPDATE:INPUT', (typeof diff !== 'undefined' ? diff : ' nothing changed'));
      if (typeof diff !== 'undefined') {
        this.render(this._store.getState());
      }
    }
  },
  destroy: function() {
    console.log('Input:destroy:event');
    this._unsubscribe();
    this._unsubscribe = null;
    this.newTodo.removeEventListener('focus', this.focus);
    this.newTodo.removeEventListener('blur', this.blur);
    this.newTodo.removeEventListener('keyup', this.keyboard);
    this.newTodo = null;
  }
}
