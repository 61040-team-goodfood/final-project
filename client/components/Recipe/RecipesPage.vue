<!-- Default page that also displays freets -->

<template>
    <main>
      <AddRecipeForm />
      <hr>
      <h2 class="display-4">All Recipes</h2>
      <FilterRecipeForm />
      <section
        v-if="$store.state.recipes.length"
      >
        <RecipeComponent
          v-for="recipe in $store.state.recipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </section>
      <section v-else>
        <h2>No recipes found.</h2>
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
      this.$store.commit('updateFilter', { keyword: null, ingredients: [] });
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
  