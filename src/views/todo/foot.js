'use strict';

/**
 * Foot
 *
 * @param {object} store
 * @param {object} actions
 * @param {object} renderer
 * @param {object} emitter
 */
export const foot = function (store, actions, renderer, emitter) {
  console.log('Foot:constructor');
  this.templates = null;
  this.filters = null;
  this.clearCompleted = null;
  this._emitter = emitter;
  this.didMount = false;
  this._store = store;
  this._unsubscribe = null;
  this._previous = null;
  this._actions = actions;
  this._renderer = renderer;
  this._emitter.addListener('foot', this.init.bind(this));
  this._emitter.addListener('foot:destroy', this.destroy.bind(this));
};

foot.prototype = {
  init: function(event) {
    console.log('Foot:init:event', event);
    if (typeof event.templates === 'undefined') {
      throw new Error('error: templates are undefined in input  component');
    }
    this.templates = event.templates;
    this._unsubscribe = this._store.subscribe(this.update.bind(this));
    /* must be deep copy */
    this._previous = JSON.parse(JSON.stringify(this._store.getState()));
    this.filters = document.getElementById('filters');
    this.render(this._store.getState());
  },
  render: function(state) {
    if (Array.isArray(state.todos)) {
      this._renderer.render(this, this.getFooterData(state), {mode: 'replace', id: 'filters', template: 'filters'}, this.addRenderedFooterListeners);
    }
  },
  update: function() {
    if (typeof this._unsubscribe === 'function') {
      const diff = DD.DeepDiff(this._previous, this._store.getState(), function (path, key) {
        /* Only respond to to filter state change */
        const exclude = ['todos', 'router'];
        return (path.length === 0 && exclude.indexOf(key) > -1);
      });
      /* Re-do deep copy */
      this._previous = JSON.parse(JSON.stringify(this._store.getState()));
      console.log('STORE:UPDATE:FOOT', (typeof diff !== 'undefined' ? diff : ' nothing changed'));
      if (typeof diff !== 'undefined') {
        this.filters = document.getElementById('filters');
        this.render(this._store.getState());
      }
    }
  },
  filter: function(event) {
    const filter = event.target.id;
    this._store.dispatch(this._actions.setVisibilityFilter(filter));
  },
  clearCompletedTodos: function(event) {
    this._store.dispatch( this._actions.clearCompleted());
  },
  addRenderedFooterListeners: function(instance) {
    console.log('Add footer listeners');
    instance.filters = document.getElementById('filters');
    instance.clearCompleted = document.getElementById('clearCompleted');
    if(instance.clearCompleted !== null) {
      instance.clearCompleted.addEventListener('click', instance.clearCompletedTodos.bind(instance));
    }
    Array.prototype.forEach.call(document.querySelectorAll('.filter-button'), function(el) {
      el.addEventListener('click', instance.filter.bind(instance));
    }.bind(instance));
  },
  getFooterData: function(state) {
    const remaining = state.todos.filter((todo) => !todo.completed).length;
    const text = (remaining > 1) ? `${remaining} ${window['i18next'].t('items left')}` : (remaining > 0) ? `${remaining} ${window['i18next'].t('item left')}` : window['i18next'].t('No items left');
    return {todos: state.todos, completed: (state.todos.length - remaining), todoCountText: text, filter: state.filter};
  },
  destroy: function() {
    console.log('Foot:destroy:event');
    this._unsubscribe();
    this._unsubscribe = null;
    if(this.clearCompleted !== null) {
      this.clearCompleted.removeEventListener('click', this.clearCompletedTodos);
      this.clearCompleted = null;
    }
    Array.prototype.forEach.call(document.querySelectorAll('.filter-button'), function(el) {
      el.removeEventListener('click', this.filter);
    }.bind(this));
  }
}
