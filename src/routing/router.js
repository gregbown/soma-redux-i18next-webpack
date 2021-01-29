import UniversalRouter from 'universal-router';

export const router = function() {
  const routes = [
    {
      path: '/',
      action: (context, params) => {
        console.log('/ route');
        return [{component: 'home'}]
      }
    },
    {
      path: '/todo',
      action: (context, params) => [{component: 'todo'}],
      children: [
        {
          path: '',
          action: (context, params) => [
            {component: 'input'},
            {component: 'list'},
            {component: 'foot'}
          ]
        }
      ]
    },
    {
      path: '(.*)', // wildcard route (must go last)
      action: (context, params) => {
        console.log('404 route');
        return [
          {component: 'erroneous'}
        ]
      }
    }
  ];

  const options = {
    context: {},
    baseUrl: '',
    resolveRoute(context, params) {
      if (typeof context.route.action === 'function') {
        if (typeof context.route.children !== 'undefined') {
          const all = [context.route.action(context, params)];
          for (let child = 0;child < context.route.children.length; child++) {
            all.push(context.route.children[child].action(context, params));
          }
          return all;
        }
        return context.route.action(context, params)
      }
      return undefined
    },
    errorHandler(err, context) {
      console.log('router error', err)
      console.log('router error context', context)
      return [
        {component: 'error'}
      ]
    }
  }

  return new UniversalRouter(routes, options);
}
