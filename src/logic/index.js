import {createLogic} from 'redux-logic';
import {events} from '../constants/events';

export const logic = function() {
  return this;
}

logic.prototype = {
  persistEffect: createLogic({
    type: [
      events.ADD_TODO,
      events.DELETE_TODO,
      events.EDIT_TODO,
      events.COMPLETE_TODO,
      events.TOGGLE_TODO_COMPLETION,
      events.CLEAR_COMPLETED
    ],
    process({actions, action}, dispatch, done) {
      console.log(`Intercept TODO ${action.type}`);
      dispatch(actions.persistTodo(action));
      done();
    }
  }),
  persistLogic: createLogic({
    type: events.PERSIST_TODO,
    cancelType: events.PERSIST_CANCELED,
    latest: true,
    process({actions, persistence, action }, dispatch, done) {
      persistence.persist(action)
        .then(result => {
          console.log('TODO persisted', result);
          dispatch(actions.persistSuccess(result))
        })
        .catch((err) => {
          console.log('Persist error', err);
          dispatch(actions.persistFailure(err))
        })
        .then(() => done());
    }
  })
}



