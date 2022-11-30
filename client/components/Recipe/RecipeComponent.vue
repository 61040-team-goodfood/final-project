<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="recipe">
    <section>
      <button class="btn btn-primary m-2" @click="deleteRecipe">
        Delete
      </button>
      <h4>{{recipe.name}}</h4>
      <p>Cook Time: {{recipe.cookTime}} minutes</p>
    </section>
  </article>

</template>

<script>

export default {
  name: 'RecipeComponent',
  components: {},
  props: {
    // Data from the stored recipe
    recipe: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      alerts: {} // Displays success/error messages encountered during recipe modification
    };
  },
  methods: {
    deleteRecipe() {
      /**
      * Deletes this recipe.
      */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted recipe', status: 'success'
          });
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
      * Submits a request to the item's endpoint
      * @param params - Options for the request
      * @param params.body - Body for the request, if it exists
      * @param params.callback - Function to run if the the request succeeds
      */
      const options = {
        method: params.method, headers: { 'Content-Type': 'application/json' }
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/recipes/${this.recipe._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshRecipes');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.recipe {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
}
</style>
