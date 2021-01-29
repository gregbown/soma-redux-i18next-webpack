import {events} from '../constants/events';

export const todos = function() {

  const initialState = [
    {
      text: 'Use Soma',
      completed: false,
      id: 0
    },
    {
      text: 'Use Redux',
      completed: false,
      id: 1
    },
    {
      text: 'Use i18next',
      completed: false,
      id: 2
    },
    {
      text: 'Use Webpack',
      completed: false,
      id: 3
    }
  ];

  return function(state = initialState, action) {
    switch (action.type) {
      case events.ADD_TODO:
        return [
          ...state,
          {
            id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
            completed: false,
            text: action.text
          }
        ]

      case events.DELETE_TODO:
        return state.filter(todo =>
          todo.id !== Number(action.id)
        )

      case events.EDIT_TODO:
        return state.map(todo =>
          todo.id === Number(action.id) ?
            { ...todo, text: action.text } :
            todo
        )

      case events.COMPLETE_TODO:
        return state.map(todo =>
          todo.id === Number(action.id) ?
            { ...todo, completed: !todo.completed } :
            todo
        )

      case events.TOGGLE_TODO_COMPLETION:
        const areAllMarked = state.every(todo => todo.completed);
        console.log('Toggle all', areAllMarked);
        return state.map(todo => ({
          ...todo,
          completed: !areAllMarked
        }))

      case events.CLEAR_COMPLETED:
        return state.filter(todo => todo.completed === false)

      default:
        return state
    }
  }
};
