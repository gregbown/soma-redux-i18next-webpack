'use strict';

export const todo = function(store, actions, renderer, emitter) {
  this.templates = null;
  this.app = null;
  this.toggleAll = null;
  this._children = null;
  this._unsubscribe = null;
  this._previous = null;
  this._store = store;
  this._actions = actions;
  this._renderer = renderer;
  this._emitter = emitter;
  this._emitter.addListener('todo', this.init.bind(this));
  this._emitter.addListener('todo:destroy', this.destroy.bind(this));
}
todo.prototype = {
  init: function(event) {
    console.log('Todo:init:event', event, new Date().toLocaleDateString('en', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}));
    if (typeof event.children === 'undefined') {
      throw new Error('error: children are undefined in todo component');
    }
    if (typeof event.templates === 'undefined') {
      throw new Error('error: templates are undefined in todo component');
    }
    this._children = event.children;
    this.templates = event.templates;
    /* Top level components need to reference app container since they use
     * while firstChild to empty container and afterbegin to add this component */
    this.app = document.getElementById('app');
    this._unsubscribe = this._store.subscribe(this.update.bind(this));
    /* must be deep copy */
    this._previous = JSON.parse(JSON.stringify(this._store.getState()));
    this.render(this._store.getState());
  },
  render: function(state) {
    this._renderer.render(this, state, {mode: 'afterbegin', id: 'app', template: 'todo'}, this.rendered);
  },
  update: function() {
    /* This is the shell so it does not ever need to update */
    // if (typeof this._unsubscribe === 'function') {
    //   const diff = DD.DeepDiff(this._previous, this._store.getState(), {prefilter: (path, key) => {
    //     /* Only respond to router */
    //     const exclude = ['filter', 'locale', 'todos'];
    //     return (path.length === 0 && exclude.indexOf(key) > -1);
    //   }});
    //   /* Re-do deep copy */
    //   this._previous = JSON.parse(JSON.stringify(this._store.getState()));
    //   console.log('STORE:UPDATE:TODO', (typeof diff !== 'undefined' ? diff : ' nothing changed'));
    //   if (typeof diff !== 'undefined') {
    //     this.render(this._store.getState());
    //   }
    // }
  },
  rendered: function(instance) {
    console.log('Todo:rendered', instance._children);
    instance.toggleAll = document.getElementById('toggleAll');
    instance.toggleAll.addEventListener('change', instance.toggle.bind(instance));
    instance._children.map((child) => instance._emitter.dispatch(child.component, [{templates: instance.templates}]));
  },
  toggle: function(event) {
    console.log('Toggle all in todo', event);
    event.target.blur();
    this._store.dispatch(this._actions.toggleTodoCompletion());
  },
  destroy: function() {
    console.log('Todo:destroy:event');
    this._unsubscribe();
    this._unsubscribe = null;
    this.toggleAll.removeEventListener('change', this.toggle);
    this._children.map((child) => this._emitter.dispatch(`${child.component}:destroy`));
  }
}
