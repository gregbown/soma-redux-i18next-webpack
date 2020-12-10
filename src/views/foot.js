'use strict';

/**
 * Foot
 *
 * @param {object} store
 * @param {object} actions
 * @param {object} renderer
 * @param {object} emitter
 *
 */
export const foot = function (store, actions, renderer, emitter) {
  console.log('Foot:constructor');
  this.footer = document.getElementById('footer');
  this.clearCompleted = null;
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
      this.renderFooter(this._current);
    }
  })
  return this;
};

foot.prototype = {
  renderFooter: function(state) {
    if (Array.isArray(state.todos)) {
      this._renderer.render(this, this.getFooterData(state), {mode: 'replace', id: 'footer'}, this.addRenderedFooterListeners);
    }
  },
  storeUpdated: function() {
    this._current = this._store.getState();
    console.log('Store updated in footer', this._current);
    this.renderFooter(this._current);
  },
  filter: function(event) {
    console.log('View:todo:filter', event);
    const filter = event.target.id;
    this._store.dispatch(this._actions.setVisibilityFilter(filter));
  },
  clearCompletedTodos: function(event) {
    console.log('Clear completed', event);
    this._store.dispatch( this._actions.clearCompleted());
  },
  addRenderedFooterListeners: function(instance) {
    console.log('Add footer listeners');
    instance.footer = document.getElementById('footer');
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
  }
}
