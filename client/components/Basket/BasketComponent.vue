<!-- Reusable component representing a single item and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="border rounded my-2 p-4">
    <section>
      <div class="row">
        <div class="col-9">
          <router-link :to="'/baskets/' + basket._id">
            <h4>{{basket.name}}</h4>
          </router-link>
        </div>
      </div>
      <b>Items: </b> {{ basket.ingredients.map(i => i.name).join(', ') }}
    </section>
  </article>
</template>

<script>
import EditBasketForm from '@/components/Basket/EditBasketForm.vue';
import AddFromBasketToPantryForm from '@/components/Basket/AddFromBasketToPantryForm.vue';

export default {
  name: 'BasketComponent',
  components: {EditBasketForm, AddFromBasketToPantryForm},
  props: {
    // Data from the stored item
    basket: {
      type: Object,
      required: true
    }
  },
  watch: {
    basket: function(newBasket, oldBasket) {
      this.editing = false;
    }
  },
  data() {
    return {
      editing: false, // Whether or not this item is in edit mode
    };
  },
  methods: {
    toggleEditing() {
      this.editing = !this.editing;
    },
    stopEditing() {
      // TODO
    },
    async request(params) {
      /**
       * Submits a request to the item's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/baskets/${this.basket._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshBaskets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        this.$store.commit('alert', { message: e, status: 'danger'});
      }
    }
  }
};
</script>
