<!-- Reusable component representing a single item and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="border rounded my-2 p-4">
    <section>
      <button
        v-if="!editing && isPantry" 
        class="btn btn-primary btn-sm mr-2 my-2 bi bi-pencil"
        @click="editing = true"
      >
        Edit
      </button>
      <button 
        v-if="editing && isPantry"
        class="btn btn-secondary btn-sm mr-2 my-2 bi bi-x"
        @click="editing = false"
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
        v-if="!isPantry"
        class="btn btn-info btn-sm mr-2 my-2 right"
        @click="openAddToPantry"
      >
        Add to Pantry
      </button>
      <button 
        class="btn btn-info btn-sm mr-2 my-2 right"
        @click="openAddToBasket"
      >
        Add to Baskets
      </button>
      <div>
        <b>Name:</b> {{ pantryItem.name }} <br>
        <b>Quantity:</b> {{ pantryItem.quantity }} {{ pantryItem.unit }}
      </div>
      <div>
        <b>In pantry since:</b> {{ pantryItem.dateAdded }}
      </div>
      <div v-if="pantryItem.expirationDate">
        <b>Expires on:</b> {{ pantryItem.expirationDate }} <br>
        <b>Reminder on:</b> {{ pantryItem.remindDate }}
      </div>
    </section>
    <section v-if="addToPantry && !isPantry">
      <AddToPantryForm 
        class="mt-4"
        :pantryItem=this.pantryItem   
        :visible="addToPantry"
      />
    </section>
    <section v-if="addToBasket">
      <AddToBasketForm 
        class="mt-4"
        :pantryItem=this.pantryItem 
        :visible="addToBasket"
      />
    </section>
    <section>
      <EditPantryItemForm 
        class="mt-4"
        :pantryItem=this.pantryItem 
        :visible=editing
      />
    </section>
  </article>
</template>

<script>
import EditPantryItemForm from '@/components/PantryItem/EditPantryItemForm.vue';
import AddToPantryForm from '@/components/PantryItem/AddToPantryForm.vue';
import AddToBasketForm from '@/components/PantryItem/AddToBasketForm.vue';

export default {
  name: 'PantryItemComponent',
  components: {EditPantryItemForm, AddToPantryForm, AddToBasketForm},
  props: {
    // Data from the stored item
    pantryItem: {
      type: Object,
      required: true
    },
    isPantry: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this pantry item is in edit mode
      addToPantry: false,
      addToBasket: false,
    };
  },
  methods: {
    openAddToPantry() {
      this.addToPantry = !this.addToPantry;
      this.addToBasket = false;
    },
    openAddToBasket() {
      this.addToBasket = !this.addToBasket;
      this.addToPantry = false;
    },
    deleteItem() {
      /**
       * Deletes this item.
       */
      const params = {
        method: this.isPantry ? 'PATCH' : 'DELETE',
        callback: () => {
          if (this.isPantry) {
            this.$store.commit('alert', {
              message: 'Successfully removed item from current pantry', status: 'success'
            });
          } else {
            this.$store.commit('alert', {
              message: 'Successfully removed item from history', status: 'success'
            });
          }
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
      if (this.isPantry) {
        options.body = JSON.stringify({inPantry: false});
      }

      try {
        const r = await fetch(`/api/pantryItems/${this.pantryItem._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshPantryItems', this.isPantry);

        params.callback();
      } catch (e) {
        this.$store.commit('alerts', {
          message: e,
          status: 'danger'
        });
      }
    }
  }
};
</script>

<style scoped>
.right {
  float: right;
}
</style>
