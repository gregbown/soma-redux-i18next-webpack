'use strict';

import {foot} from "./foot";

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

/**
 * List
 *
 * @param {object} store
 * @param {object} actions
 * @param {object} renderer
 * @param {object} emitter
 *
 */
export const list = function(store, actions, renderer, emitter) {
  console.log('Page:constructor');
  this.toggleAll = document.getElementById('toggleAll');
  this.todoList = document.getElementById('todoList');
  this.todos = null;
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
};

list.prototype = {
  render: function(state) {
    if (Array.isArray(state.todos)) {
      this._renderer.render(this, state, {mode: 'afterbegin', id: 'todoList'}, this.addListeners);
    }
  },
  storeUpdated: function() {
    this._current = this._store.getState();
    console.log('Store updated in list', this._current);
    this.render(this._current);
    // this.renderFooter(this._current);
  },
  filter: function(event) {
    console.log('View:todo:filter', event);
    const filter = event.target.id;
    this._store.dispatch(this._actions.setVisibilityFilter(filter));
  },
  toggle: function(event) {
    console.log('View:toggle', event);
    const id = event.target.value;
    this._store.dispatch(this._actions.completeTodo(id));
  },
  destroy: function(event) {
    console.log('View:destroy', event);
    const id = event.target.value;
    this._store.dispatch(this._actions.deleteTodo(id));
  },
  editTodo: function(event) {
    console.log(`Editing todo ${event.target.id}`, event);
    event.target.removeAttribute('readonly');
    window.setTimeout(() => {
      if (window.getSelection) {window.getSelection().removeAllRanges();}
      if (typeof event.target.selectionStart === 'number') {
        event.target.selectionStart = event.target.selectionEnd = event.target.value.length;
      }
    }, 0)
  },
  editing: function(event) {
    console.log('View:todo:keyup', event);
    const text = event.target.value.trim();
    const id = event.target.id;
    if ((event.keyCode === ENTER_KEY || event.which === ENTER_KEY) && text !== '') {
      event.target.blur();
      this._store.dispatch( this._actions.editTodo(id, text));
    }
    if ((event.keyCode === ESCAPE_KEY || event.which === ESCAPE_KEY)) {
      event.target.blur();
      this._current = this._store.getState();
      this.render(this._current);
      // this.renderFooter(this._current);
    }
  },
  addListeners: function(instance) {
    console.log('View:addToDoListeners');
    instance.toggleBtns = document.querySelectorAll('.toggle');
    instance.destroyBtns = document.querySelectorAll('.destroy');
    Array.prototype.forEach.call(document.querySelectorAll('.todo'), function(el) {
      el.addEventListener('dblclick', instance.editTodo);
      el.addEventListener('keyup', instance.editing.bind(instance));
      // el.addEventListener('blur', instance.blurTodo.bind(instance));
    }.bind(instance));
    Array.prototype.forEach.call(document.querySelectorAll('.destroy'), function(el) {
      el.addEventListener('click', instance.destroy.bind(instance));
    }.bind(instance));
    Array.prototype.forEach.call(document.querySelectorAll('.toggle'), function(el) {
      el.addEventListener('change', instance.toggle.bind(instance));
    }.bind(instance));
  }
}
