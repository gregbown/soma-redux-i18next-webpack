import {events} from '../constants/events';
import {parse} from 'query-string';

export const actions = function() {
  return {
    addTodo: text => ({type: events.ADD_TODO, text}),
    deleteTodo: id => ({type: events.DELETE_TODO, id}),
    editTodo: (id, text) => ({type: events.EDIT_TODO, id, text}),
    completeTodo: id => ({type: events.COMPLETE_TODO, id}),
    toggleTodoCompletion: () => ({type: events.TOGGLE_TODO_COMPLETION}),
    clearCompleted: () => ({type: events.CLEAR_COMPLETED}),
    setVisibilityFilter: filter => ({type: events.SET_VISIBILITY_FILTER, filter}),
    setLocale: locale => ({type: events.SET_LOCALE, locale}),
    persistTodo: (value) => (Object.assign({type: events.PERSIST_TODO}, {prev: value.type}, _.omit(value, ['type']))),
    persistCanceled: () => ({type: events.PERSIST_CANCELED}),
    persistSuccess: result => ({type: events.PERSIST_SUCCESS, result}),
    persistFailure: error => ({type: events.PERSIST_FAILURE, error}),

    push: (href) => ({type: events.PUSH, payload: href}),
    replace: (href) => ({type: events.REPLACE, payload: href}),
    go: (index) => ({type: events.GO, payload: index}),
    goBack: () => ({type: events.GO_BACK}),
    goForward: () => ({type: events.GO_FORWARD}),
    locationChange: ({ pathname, search, view }) => {
      console.log('ACTION: locationChange', view);
      return {
        type: events.LOCATION_CHANGE,
          payload: {
          pathname,
            search,
            queries: parse(search),
            view: view
        }
      }
    }
  }
};
