<!-- Default page that also displays freets -->

<template>
    <main>
      <header>
        <h2>Recipes</h2>
      </header>
      <AddRecipeForm />
      <section
        v-if="$store.state.recipes.length"
      >
        <RecipeComponent
          v-for="recipe in $store.state.recipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </section>
    </main>
  </template>
  
  <script>
  import RecipeComponent from '@/components/Recipe/RecipeComponent.vue';
  import AddRecipeForm from '@/components/Recipe/AddRecipeForm.vue';
  
  export default {
    name: 'RecipesPage',
    components: {RecipeComponent, AddRecipeForm},
    mounted() {
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
  
  button {
      margin-right: 10px;
  }
  
  section .scrollbox {
    flex: 1 0 50vh;
    padding: 3%;
    overflow-y: scroll;
  }
  </style>
  