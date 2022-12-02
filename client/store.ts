import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various components.
 */
const store = new Vuex.Store({
  state: {
    pantryItems: [], // All pantryItems created in the app
    recipes: [], // All recipes in the app
    username: null, // Username of the logged in user
    alerts: {}, // Blobal success/error messages encountered during submissions to non-visible forms
    units: [
      'count',
      'mL',
      'L',
      'tsp',
      'tbsp',
      'fl oz',
      'c',
      'pt',
      'qt',
      'gal',
      'mg',
      'g',
      'kg',
      'lb',
      'oz'
    ], // Fixed list of units
    baskets: [
      'basket1',
      'basket2'
    ] // Make API call to populate, fixed list for now
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updatePantryItems(state, pantryItems) {
      /**
       * Update the stored pantry items to the provided ones.
       * @param pantryItems - pantry items to store
       */
      state.pantryItems = pantryItems;
    },
    async refreshPantryItems(state, inPantry) {
      /**
       * Request the server for the currently available freets.
       * @param inPantry - boolean denoting whether to filter items by currently in pantry
       */
      const url = `/api/pantryItems?status=${inPantry}`;
      const res = await fetch(url).then(async r => r.json());
      state.pantryItems = res;
    },
    async refreshRecipes(state) {
      /**
       * Request the server for the currently available recipes.
       */
      const url = '/api/recipes';
      const res = await fetch(url).then(async r => r.json());
      state.recipes = res;
    },
  },
  plugins: [createPersistedState()]
});

export default store;
