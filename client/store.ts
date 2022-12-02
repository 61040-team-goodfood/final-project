import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various components.
 */
const store = new Vuex.Store({
  state: {
    // inPantry: true, // Status to filter shown items by (true = in pantry, false = in history)
    groceryItems: [], // All groceryItems created in the app
    recipes: [], // All recipes in the app
    username: null, // Username of the logged in user
    alerts: {}, // Blobal success/error messages encountered during submissions to non-visible forms
    keyword: null,
    ingredients: [],
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
    updateGroceryItems(state, groceryItems) {
      /**
       * Update the stored grocery items to the provided ones.
       * @param groceryItems - grocery items to store
       */
      state.groceryItems = groceryItems;
    },
    updateFilter(state, filter) {
      state.keyword = filter.keyword;
      state.ingredients = [...filter.ingredients];
    },
    async refreshGroceryItems(state, inPantry) {
      /**
       * Request the server for the currently available freets.
       * @param inPantry - boolean denoting whether to filter items by currently in pantry
       */
      const url = `/api/groceryItems?status=${inPantry}`;
      const res = await fetch(url).then(async r => r.json());
      state.groceryItems = res;
    },
    async refreshRecipes(state) {
      /**
       * Request the server for the currently available recipes.
       */

      const keyword = state.keyword ? state.keyword : '';
      const ingredients = state.ingredients ? state.ingredients.join(',') : '';
      const url = `/api/recipes?keyword=${keyword}&ingredients=${ingredients}`;
      const res = await fetch(url).then(async r => r.json());
      state.recipes = res;
    },
  },
  plugins: [createPersistedState()]
});

export default store;
