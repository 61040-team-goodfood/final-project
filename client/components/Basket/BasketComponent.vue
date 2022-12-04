<!-- Reusable component representing a single item and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="border rounded my-2 p-4">
    <section>
      <button 
        class="btn btn-danger btn-sm my-2 bi bi-trash"
        @click="deleteItem"
      >
        Delete
      </button>
      <div class="row">
        <div class="col-9">
          <router-link :to="'/baskets/' + basket._id">
            <h4>{{basket.name}}</h4>
          </router-link>
        </div>
        <button class="btn btn-info btn-sm mr-2 my-2 right"
                @click="toggleAddToPantry">
          Add to pantry
        </button>
      </div>
      <b>Items: </b> {{ basket.ingredients.map(i => i.name).join(', ') }}
    </section>
    <section v-if="addToPantry">
      <AddFromBasketToPantryForm 
        class="mt-4"
        :basket=this.basket   
        :visible="addToPantry"
      />
    </section>
  </article>
  <!-- <article class="border rounded my-2 p-4">
    <section>
      <button
        v-if="!editing" 
        class="btn btn-primary btn-sm mr-2 my-2 bi bi-pencil"
        @click="toggleEditing"
      >
        Edit
      </button>
      <button 
        v-else
        class="btn btn-secondary btn-sm mr-2 my-2 bi bi-x"
        @click="toggleEditing"
      >
        Stop Editing
      </button>
      <button 
        class="btn btn-danger btn-sm my-2 bi bi-trash"
        @click="deleteItem"
      >
        Delete
      </button>
      <button 
        class="btn btn-info btn-sm mr-2 my-2 right"
        @click="toggleAddToPantry"
      >
        Add to Pantry
      </button>
      <div>
        <b>Name:</b> {{ basket.name }} <br>
        <b>Items:</b> 
          <ul class="my-2">
            <li 
              v-for="ingredient in basket.ingredients"
              :key="ingredient.id"
            >
            {{ ingredient.name }} × {{ ingredient.quantity }} {{ ingredient.unit }}
          </li>
        </ul>
      </div>
    </section>
    <section v-if="addToPantry">
      <AddFromBasketToPantryForm 
        class="mt-4"
        :basket=this.basket   
        :visible="addToPantry"
      />
    </section>
    <section>
      <EditBasketForm 
        class="mt-4"
        :basket=this.basket 
        :visible="editing"
      />
    </section>
  </article> -->
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
      addToPantry: false,
    };
  },
  methods: {
    toggleAddToPantry() {
      this.addToPantry = !this.addToPantry;
      this.editing = false;
    },
    toggleEditing() {
      this.editing = !this.editing;
      this.addToPantry = false;
    },
    deleteItem() {
      /**
       * Deletes this item.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted item', status: 'success'
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
