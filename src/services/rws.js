import * as $ from 'jquery';

/**
 * A very minimalistic AJAX implementation that returns promise instead of relying in callbacks.
 *
 * @module rws
 * @author gregbown@yahoo.com
 *
 * @constructor
 */
export const rws = () => {
  console.log('Singleton service ajax');
  if (typeof $ === 'undefined') {
    throw new Error('jQuery is not defined');
  }
  return this;
};

rws.prototype = {
  /**
   * A function to perform ajax requests. It returns promise instead of relying on callbacks.
   * @memberof module:rws
   *
   * @param {object} options
   * @return {Promise<unknown>}
   */
  base: (options) => {
    return new Promise(function (resolve, reject) {
      $.ajax(options).done(resolve).fail(reject);
    });
  },

  /**
   * @method get
   * @description Utility for getting JSON
   * Designed to use CSRF token from server, not implemented here
   * @param {string} path The API path for the get request
   * @param {string} token A single use CSRF token
   */
  get: function(path, token) {
    return this.base({
      type: 'GET',
      url: path,
      headers: {'CSRF-Token': token},
      dataType: 'json',
      contentType: 'application/json'
    });
  },

  /**
   * @method post
   * @description Utility for posting JSON
   * Designed to use CSRF token from server, not implemented here
   * @param {string} path The API path for the post request
   * @param {string} data The JSON stringified
   * @param {string} token A single use CSRF token
   */
  post: function(path, data, token) {
    if (typeof data !== 'string') {
      throw new Error('ERROR: JSON data should be stringified');
    }
    return this.base({
      type: 'POST',
      url: path,
      headers: {'CSRF-Token': token},
      data,
      dataType: 'json',
      contentType: 'application/json'
    });
  },

  /**
   * @method download
   * @description Utility for posting JSON
   * Designed to use CSRF token from server, not implemented here
   * @param {string} path The API path for the post request
   * @param {string} data The JSON stringified
   * @param {string} token A single use CSRF token
   */
  download: function(path, data, token) {
    if (typeof data !== 'string') {
      throw new Error('ERROR: JSON data should be stringified');
    }
    return this.base({
      type: 'POST',
      url: path,
      headers: {'CSRF-Token': token},
      data,
      dataType: 'binary',
      contentType: 'application/json',
      xhrFields: {
        responseType: 'arraybuffer',
        processData: false
      }
    });
  },

  /**
   * @method form
   * @description Utility for posting application/x-www-form-urlencoded models
   * Designed to use CSRF token from server, not implemented here
   * @param {string} path The API path for the post request.
   * @param {string} type The type of xhr request. ['POST', 'DELETE']
   * @param {string} data The URL encoded data to post. Note: CSRF token must be in here.
   */
  form: function(path, type, data) {
    if (typeof data !== 'string' || data.indexOf('=') === -1) {
      throw new Error('ERROR: form method requires URL encoded data');
    }
    /* Check for token key in form encoded string &_csrf=bu87hk35f1d&firstname=shan */
    if (data.indexOf('_csrf') === -1) {
      throw new Error('ERROR: attempting form submit without CSRF token');
    }
    return this.base({
      type,
      url: path,
      data,
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
    });
  },

  /**
   * @method multipart
   * @description for posting multipart for data, like images
   * Designed to use CSRF token from server, not implemented here
   * @param {string} path The API path for the post request.
   * @param {*} formData
   * @param {string} token
   */
  multipart: function(path, formData, token) {
    return this.base({
      type: 'POST',
      enctype: 'multipart/form-data',
      url: path,
      headers: {'CSRF-Token': token},
      data: formData,
      processData: false,
      contentType: false,
      cache: false,
      timeout: 600000
    });
  },

  /**
   * @method load
   * @description Utility for loading JSON assets like configuration
   * @param {string} path The API path for the get request
   */
  load: function(path) {
    return this.base({
      type: 'GET',
      url: path,
      dataType: 'json',
      contentType: 'application/json'
    });
  }
};
