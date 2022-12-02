<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="border rounded my-2 p-4">
    <section>
      <button v-if="$store.state.username === recipe.author" class="btn btn-danger btn-sm my-2 bi bi-trash" @click="deleteRecipe">
        Delete
      </button>
      <router-link :to="'/recipes/' + recipe._id">
        <h4>{{recipe.name}}</h4>
      </router-link>
      <b>Ingredients: </b> {{ recipe.ingredients.map(i => i.name).join(', ') }}
      <br>
      <b>Cook Time:</b> {{ recipe.cookTime }} minutes
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
  methods: {
    deleteRecipe() {
      /**
      * Deletes this recipe.
      */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted recipe!', 
            status: 'success'
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
        this.$store.commit('alert', { message: e, status: 'danger'});
      }
    }
  }
};
</script>