export const store = function(configuration) {
    console.log(`Creating Redux store`);
    return configuration.createStore();
}

export default {store};
