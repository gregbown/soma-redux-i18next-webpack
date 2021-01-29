'use strict';

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
  console.log('List:constructor');
  this.templates = null;
  this.todoList = null;
  this.todos = null;
  this._previous = null;
  this._unsubscribe = null
  this._store = store;
  this._actions = actions;
  this._renderer = renderer;
  this._emitter = emitter;
  this._emitter.addListener('list', this.init.bind(this));
  this._emitter.addListener('list:destroy', this.destroy.bind(this));
};

list.prototype = {
  init: function(event) {
    console.log('List:init:event', event);
    if (typeof event.templates === 'undefined') {
      throw new Error('error: templates are undefined in input  component');
    }
    this.templates = event.templates;
    this._unsubscribe = this._store.subscribe(this.update.bind(this));
    /* must be deep copy */
    this._previous = JSON.parse(JSON.stringify(this._store.getState()));
    this.todoList = document.getElementById('todoList');
    this.render(this._store.getState());
  },
  render: function(state) {
    if (Array.isArray(state.todos)) {
      this._renderer.render(this, state, {mode: 'afterbegin', id: 'todoList', template: 'todoList'}, this.addListeners);
    }
  },
  update: function() {
    if (typeof this._unsubscribe === 'function') {
      const diff = DD.DeepDiff(this._previous, this._store.getState(), function (path, key) {
        /* Needs to render on todos or filter change */
        const exclude = ['locale', 'router'];
        return (path.length === 0 && exclude.indexOf(key) > -1);
      });
      /* Re-do deep copy */
      this._previous = JSON.parse(JSON.stringify(this._store.getState()));
      console.log('STORE:UPDATE:LIST', (typeof diff !== 'undefined' ? diff : ' nothing changed'));
      if (typeof diff !== 'undefined') {
        this.todoList = document.getElementById('todoList');
        this.render(this._store.getState());
      }
    }
  },
  toggle: function(event) {
    // console.log('View:toggle', event);
    const id = event.target.value;
    this._store.dispatch(this._actions.completeTodo(id));
  },
  remove: function(event) {
    // console.log('View:remove', event);
    const id = event.target.value;
    this._store.dispatch(this._actions.deleteTodo(id));
  },
  editTodo: function(event) {
    // console.log(`Editing todo ${event.target.id}`, event);
    event.target.removeAttribute('readonly');
    window.setTimeout(() => {
      if (window.getSelection) {window.getSelection().removeAllRanges();}
      if (typeof event.target.selectionStart === 'number') {
        event.target.selectionStart = event.target.selectionEnd = event.target.value.length;
      }
    }, 0)
  },
  editing: function(event) {
    // console.log('View:todo:keyup', event);
    const text = event.target.value.trim();
    const id = event.target.id;
    if ((event.keyCode === ENTER_KEY || event.which === ENTER_KEY) && text !== '') {
      event.target.blur();
      this._store.dispatch( this._actions.editTodo(id, text));
    }
    if ((event.keyCode === ESCAPE_KEY || event.which === ESCAPE_KEY)) {
      event.target.blur();
      this.render(this._store.getState());
    }
  },
  addListeners: function(instance) {
    // console.log('View:addToDoListeners');
    Array.prototype.forEach.call(document.querySelectorAll('.todo'), function(el) {
      el.addEventListener('dblclick', instance.editTodo);
      el.addEventListener('keyup', instance.editing.bind(instance));
    }.bind(instance));
    Array.prototype.forEach.call(document.querySelectorAll('.remove'), function(el) {
      el.addEventListener('click', instance.remove.bind(instance));
    }.bind(instance));
    Array.prototype.forEach.call(document.querySelectorAll('.toggle'), function(el) {
      el.addEventListener('change', instance.toggle.bind(instance));
    }.bind(instance));
  },
  destroy: function() {
    console.log('List:destroy:event');
    this._unsubscribe();
    this._unsubscribe = null;
    Array.prototype.forEach.call(document.querySelectorAll('.todo'), function(el) {
      el.removeEventListener('dblclick', this.editTodo);
      el.removeEventListener('keyup', this.editing);
    }.bind(this));
    Array.prototype.forEach.call(document.querySelectorAll('.remove'), function(el) {
      el.removeEventListener('click', this.remove);
    }.bind(this));
    Array.prototype.forEach.call(document.querySelectorAll('.toggle'), function(el) {
      el.removeEventListener('change', this.toggle);
    }.bind(this));
  }
}
