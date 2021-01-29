'use strict';

export const loader = function(rws, emitter) {
  emitter.addListener('start', () => {
    rws.load('json/config.json').then((config) => {
      emitter.dispatch('config', [config]);
    }).catch((error) => {
      console.log('Error loading config', error);
    });
  })
};
