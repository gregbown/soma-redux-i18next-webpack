import {createStore} from 'redux';

export const configuration = function (reducers) {
  console.log('Config store...');
  return {createStore: () => createStore(reducers)};
}
