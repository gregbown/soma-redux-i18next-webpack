import {events} from '../constants/events';

export const actions = function() {
  return {
    addTodo: text => ({ type: events.ADD_TODO, text }),
    deleteTodo: id => ({ type: events.DELETE_TODO, id }),
    editTodo: (id, text) => ({ type: events.EDIT_TODO, id, text }),
    completeTodo: id => ({ type: events.COMPLETE_TODO, id }),
    completeAllTodos: () => ({ type: events.COMPLETE_ALL_TODOS }),
    clearCompleted: () => ({ type: events.CLEAR_COMPLETED }),
    setVisibilityFilter: filter => ({ type: events.SET_VISIBILITY_FILTER, filter}),
    setLocale: locale => ({ type: events.SET_LOCALE, locale})
  }
};
