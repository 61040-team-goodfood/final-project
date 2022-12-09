<!-- Default page that also displays freets -->

<template>
  <main>
    <AddRecipeForm />
    <hr>
    <h1>Recipes</h1>
      <p>Contribute to and explore recipes uploaded by users here.</p>
    <FilterRecipeForm />
    <br>
    <div class="font-italic">
      <h2 v-if="$store.state.keyword && $store.state.ingredients.length">
        Displaying recipes with keyword {{ $store.state.keyword }} and ingredient(s) {{ $store.state.ingredients.join(', ') }}
      </h2>
      <h2 v-else-if="$store.state.keyword">
        Displaying recipes with keyword {{ $store.state.keyword }}
      </h2>
      <h2 v-else-if="$store.state.ingredients.length">
        Displaying recipes with ingredient(s) {{ $store.state.ingredients.join(', ') }}
      </h2>
      <h2 v-else>Displaying all recipes</h2>
    </div>
    <div v-if="fetching">
      <strong>Loading...</strong>
    </div>
    <div v-else>
      <section v-if="recipes.length">
        <RecipeComponent v-for="recipe in recipes" :key="recipe._id" :recipe="recipe" />
      </section>
      <section v-else>
        <p>No recipes found.</p>
      </section>
    </div>
  </main>
</template>
  
<script>
import RecipeComponent from '@/components/Recipe/RecipeComponent.vue';
import AddRecipeForm from '@/components/Recipe/AddRecipeForm.vue';
import FilterRecipeForm from '@/components/Recipe/FilterRecipeForm.vue';

export default {
  name: 'RecipesPage',
  components: { RecipeComponent, AddRecipeForm, FilterRecipeForm },
  data() {
    return {
      fetching: true,
      recipes: [],
    };
  },
  async mounted() {
    const filter = {
      keyword: null,
      ingredients: []
    }

    if (this.$route.query.keyword) filter.keyword = this.$route.query.keyword;
    if (this.$route.query.ingredients) filter.ingredients = [this.$route.query.ingredients];

    this.$store.commit('updateFilter', filter);
    await this.fetchRecipes();
  },
  watch: {
    async '$store.state.ingredients'() {
      await this.fetchRecipes();
    },
    async '$store.state.keyword'() {
      await this.fetchRecipes();
    },
  },
  methods: {
    async fetchRecipes() {
      this.fetching = true;
      const keyword = this.$store.state.keyword ? this.$store.state.keyword : '';
      const ingredients = this.$store.state.ingredients ? this.$store.state.ingredients.join(',') : '';
      const url = `/api/recipes?keyword=${keyword}&ingredients=${ingredients}`;
      const res = await fetch(url).then(async r => r.json());
      this.recipes = res;
      this.fetching = false;
    }
  }
};
</script>
  
<style scoped>
section {
  display: flex;
  flex-direction: column;
}

  header, header > * {
      display: flex;
      justify-content: space-between;
      align-items: center;
  }
  
  section .scrollbox {
    flex: 1 0 50vh;
    padding: 3%;
    overflow-y: scroll;
  }
  </style>
  