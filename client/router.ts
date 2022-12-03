import Vue from 'vue';
import VueRouter from 'vue-router';
import AccountPage from './components/Account/AccountPage.vue';
import PantryItemsPage from './components/PantryItem/PantryItemsPage.vue';
import BasketsPage from './components/Basket/BasketsPage.vue';
import HistoryPage from './components/History/HistoryPage.vue';
import RecipesPage from './components/Recipe/RecipesPage.vue';
import RecipePage from './components/Recipe/RecipePage.vue'
import LoginPage from './components/Login/LoginPage.vue';
import NotFound from './NotFound.vue';
import HomePage from './components/common/HomePage.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/pantry', name: 'My Pantry', component: PantryItemsPage},
  {path: '/baskets', name: 'My Baskets', component: BasketsPage},
  { path: '/history', name: 'History', component: HistoryPage},
  { path: '/recipes', name: 'Recipes', component: RecipesPage},
  { path: '/recipes/:recipeId', name: 'Recipe', component: RecipePage },
  { path: '/account', name: 'Account', component: AccountPage },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '*', name: 'Not Found', component: NotFound }
];

const router = new VueRouter({ routes });

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name === 'Login' && router.app.$store.state.username) {
      next({ name: 'Account' }); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === 'Account' && !router.app.$store.state.username) {
      next({ name: 'Login' }); // Go to Login page if user navigates to Account and are not signed in
      return;
    }
  }

  next();
});

export default router;
