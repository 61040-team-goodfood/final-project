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
      <section
        v-if="$store.state.recipes.length"
      >
        <RecipeComponent
          v-for="recipe in $store.state.recipes"
          :key="recipe._id"
          :recipe="recipe"
        />
      </section>
      <section v-else>
        <p>No recipes found.</p>
      </section>
    </main>
  </template>
  
  <script>
  import RecipeComponent from '@/components/Recipe/RecipeComponent.vue';
  import AddRecipeForm from '@/components/Recipe/AddRecipeForm.vue';
  import FilterRecipeForm from '@/components/Recipe/FilterRecipeForm.vue';
  
  export default {
    name: 'RecipesPage',
    components: {RecipeComponent, AddRecipeForm, FilterRecipeForm},
    mounted() {
      const filter = {
        keyword: null,
        ingredients: []
      }

      if (this.$route.query.keyword) filter.keyword = this.$route.query.keyword;
      if (this.$route.query.ingredients) filter.ingredients = this.$route.query.ingredients;

      this.$store.commit('updateFilter', filter);
      this.$store.commit('refreshRecipes');
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
  