import cookies from 'browser-cookies';

'use strict';

/**
 * Head
 *
 * @param {object} store
 * @param {object} actions
 * @param {object} renderer
 * @param {object} emitter
 *
 */
export const header = function (store, actions, renderer, emitter) {
  console.log('Head:constructor');
  this.templates = null;
  this._previous = null;
  this._store = store;
  this._actions = actions;
  this._renderer = renderer;
  this._emitter = emitter;

  this._emitter.addListener('config', (event) => {
    console.log('Head:config:event', event);
    if (typeof event.templates !== 'undefined') {
      this.templates = event.templates;
      this._previous = JSON.parse(JSON.stringify(this._store.getState()));
      this._store.subscribe(this.update.bind(this));
      this.render({locale: this._previous.locale, view: this._previous.router.view});
    }
  });
};

header.prototype = {
  render: function(state) {
    /* note: the id passed into the renderer is both the DOM id and the template id,
     * however; it is only used inside the renderer as the template id */
    this._renderer.render(this, state, {mode: 'replace', id: 'header', template: 'header'}, this.addListeners);
  },
  update: function() {
    if (typeof this.templates !== 'undefined') {
      const diff = DD.DeepDiff(this._previous, this._store.getState(), function (path, key) {
        /* Only respond to router and locale */
        const exclude = ['todos', 'filter'];
        return (path.length === 0 && exclude.indexOf(key) > -1);
      });

      /* Re-do deep copy */
      this._previous = JSON.parse(JSON.stringify(this._store.getState()));
      console.log('STORE:UPDATE:HEADER', (typeof diff !== 'undefined' ? diff : ' nothing changed'));
      if (typeof diff !== 'undefined') {
        /* Must check for locale change before render. Even though sending the correct locale to renderer
         * the renderer calls the i18next lib independently inside the template, therefore it will
         * render the wrong locale unless locale is changed prior */
        if (diff.length === 1 && diff[0].kind === 'E' && diff[0].path[0] === 'locale') {
          this.changeLocale(this._previous.locale);
        }
        this.removeListeners(this);
        this.header = null;
        this.render({locale: this._previous.locale, view: this._previous.router.view});
      }
    }
  },
  changeLocale: function(locale) {
    cookies.set('locale', locale, {expires: new Date(Date.now() + 86400000), httpOnly: false, domain: 'localhost'});
    window['i18next'].changeLanguage(locale)
      .then((t) => {
        console.log(`locale: ${t('locale')}`);
      }).catch((err) => {
      console.log('something went wrong changing locale', err);
    })
  },
  localeEventHandler: function(event) {
    event.preventDefault();
    console.log(`Switch locale to ${event.target.dataset.locale}`);
    Array.prototype.forEach.call(document.getElementsByClassName('locale-link'), function(element) {
      element.removeAttribute('disabled');
      element.classList.remove('active');
    });
    this._store.dispatch( this._actions.setLocale(event.target.dataset.locale));
  },
  addListeners: function(instance) {
    // console.log('Add header listeners');
    /* HTMLCollection does not have forEach despite being array like */
    Array.prototype.forEach.call(document.getElementsByClassName('locale-link'), function(element) {
      element.addEventListener('click', instance.localeEventHandler.bind(instance), false);
    }.bind(instance));
  },
  removeListeners: function(instance) {
    // console.log('Remove header listeners');
    /* HTMLCollection does not have forEach despite being array like */
    Array.prototype.forEach.call(document.getElementsByClassName('locale-link'), function(element) {
      element.removeEventListener('click', instance.localeEventHandler);
    }.bind(instance));
  }
}
