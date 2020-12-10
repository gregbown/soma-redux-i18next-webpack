import ejs from 'ejs';

/**
 * @constructor
 */
export const renderer = function() {
  /* constructor if needed */
  return this;
};

renderer.prototype = {
  render : function(instance, data, options, cb) {
    console.log('Rendering', instance, data, options);
    // Just some testing
    // let parser = new DOMParser();
    // let doc = parser.parseFromString(ejs.render(instance.templates[options.id].join(''), data), "text/html");
    // if (doc.body.firstElementChild) {
    //   console.log('New document rendered', (doc.body.firstElementChild).querySelectorAll('.filter-button'));
    // }
    // while (el.firstChild) {
    //   el.removeChild(el.firstChild);
    // }
    // el.insertAdjacentHTML('afterbegin', ejs.render(template.join(''), data));
    switch (options.mode) {
      case 'replace': // Replace the element in place
        const fragment = document.createRange().createContextualFragment(ejs.render(instance.templates[options.id].join(''), data));
        instance[options.id].replaceWith(fragment);
        break;
      case 'beforebegin': // Before the element itself
        // TODO
        break;
      case 'beforeend': // Just inside the element, after its last child
        // TODO
        break;
      case 'afterend': // After the element itself, possibly will work for adding consecutive children, using the previous element as the after
        // TODO
        break;
      case 'afterbegin': // Just inside the element, before its first child
        while (instance[options.id].firstChild) {
          instance[options.id].removeChild(instance[options.id].firstChild);
        }
        instance[options.id].insertAdjacentHTML('afterbegin', ejs.render(instance.templates[options.id].join(''), data));
        break;
      default:
        while (instance[options.id].firstChild) {
          instance[options.id].removeChild(instance[options.id].firstChild);
        }
        instance[options.id].insertAdjacentHTML('afterbegin', ejs.render(instance.templates[options.id].join(''), data));
    }
    /* this is injected into the callback so it can re-attach event handlers after they are created */
    if (typeof cb === 'function') {
      cb(instance);
    }
  }
};
