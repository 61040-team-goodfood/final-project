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
    baskets: [], // All baskets in the app
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
    ] // Fixed list of units
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
    // updateFilter(state, inPantry) {
    //   /**
    //    * Update the stored grocery items filter to the specified one.
    //    * @param inPantry - Status of the grocery tiems to filter by
    //    */
    //   state.inPantry = inPantry;
    // },
    updateGroceryItems(state, groceryItems) {
      /**
       * Update the stored grocery items to the provided ones.
       * @param groceryItems - grocery items to store
       */
      state.groceryItems = groceryItems;
    },
    async refreshGroceryItems(state, inPantry) {
      /**
       * Request the server for the currently available grocery items.
       * @param inPantry - boolean denoting whether to filter items by currently in pantry
       */
      const url = `/api/groceryItems?status=${inPantry}`;
      const res = await fetch(url).then(async r => r.json());
      state.groceryItems = res;
    },
    async refreshBaskets(state) {
      /**
       * Request the server for the currently available baskets.
       */
      const url = `/api/baskets`;
      const res = await fetch(url).then(async r => r.json());
      state.baskets = res;
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
