const TIMEOUT = 1000;
export const persistence = function() {
  return this;
};

persistence.prototype = {
  persist: function(todo) {
    return new Promise( resolve => {
      let result;
      switch (todo.prev) {
        case 'ADD_TODO':
          console.log(`persist action adding todo, text: ${todo.text}`);
          result = `Added ${todo.text}`;
          break;
        case 'DELETE_TODO':
          console.log(`persist action delete todo, id: ${todo.id}`);
          result = `Deleted todo ${todo.id}`;
          break;
        case 'EDIT_TODO':
          console.log(`persist action edit todo, id: ${todo.id}, text: ${todo.text}`);
          result = `Edit id ${todo.id}, text is ${todo.text}`;
          break;
        case 'COMPLETE_TODO':
          console.log(`persist action complete todo, id: ${todo.id}`);
          result = `Complete todo ${todo.id}`;
          break;
        case 'COMPLETE_ALL_TODOS':
          console.log(`persist action complete all todos`);
          result = 'toggle all todos complete'
          break;
        case 'CLEAR_COMPLETED':
          console.log(`persist action clear completed`);
          result = 'Delete completed todos';
          break;
      }
      setTimeout(() => resolve(result), TIMEOUT)
    })
  }
}
