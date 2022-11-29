<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="border rounded my-2 p-4">
    <section v-if="editing && isPantry">
      <EditGroceryItemForm 
        :groceryItem=this.groceryItem 
        @stopEditing="this.stopEditing" 
      />
    </section>
    <section v-else>
      <button 
        v-if="isPantry"
        class="btn btn-primary btn-sm mr-2 my-2 bi bi-pencil"
        @click="startEditing"
      >
        Edit
      </button>
      <button 
        class="btn btn-danger btn-sm my-2 bi bi-trash"
        @click="deleteItem"
      >
        Delete
      </button>
      <div>
        <b>Name:</b> {{ groceryItem.name }} <br>
        <b>Quantity:</b> {{ groceryItem.quantity }} {{ groceryItem.unit }}
      </div>
      <div>
        <b>In pantry since:</b> {{ groceryItem.dateAdded }}
      </div>
      <div v-if="groceryItem.expirationDate">
        <b>Expires on:</b> {{ groceryItem.expirationDate }} <br>
        <b>Reminder on:</b> {{ groceryItem.remindDate }}
      </div>
      <button 
        v-if="!isPantry"
        class="btn btn-primary btn-sm mr-2 my-2 bi"
        @click="openAddToPantry"
      >
        Add to Pantry
      </button>
      <button 
        class="btn btn-primary btn-sm mr-2 my-2 bi"
        @click="openAddToBasket"
      >
        Add to Baskets
      </button>
    </section>
    <section v-if="addToPantry && !isPantry">
      <AddToPantryForm 
        :groceryItem=this.groceryItem 
        @stopEditing="closeAddToPantry" 
      />
    </section>
    <section v-if="addToBasket">
      <AddToBasketForm 
        :groceryItem=this.groceryItem 
        @stopEditing="closeAddToBasket" 
      />
    </section>
  </article>
</template>

<script>
import EditGroceryItemForm from '@/components/GroceryItem/EditGroceryItemForm.vue';
import AddToPantryForm from '@/components/GroceryItem/AddToPantryForm.vue';
import AddToBasketForm from '@/components/GroceryItem/AddToBasketForm.vue';

export default {
  name: 'GroceryItemComponent',
  components: {EditGroceryItemForm, AddToPantryForm, AddToBasketForm},
  props: {
    // Data from the stored item
    groceryItem: {
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
      editing: false, // Whether or not this grocery item is in edit mode
      addToPantry: false,
      addToBasket: false,
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
    },
    openAddToPantry() {
      this.addToPantry = true;
      this.addToBasket = false;
    },
    closeAddToPantry() {
      this.addToPantry = false;
    },
    openAddToBasket() {
      this.addToBasket = true;
      this.addToPantry = false;
    },
    closeAddToBasket() {
      this.addToBasket = false;
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
        const r = await fetch(`/api/groceryItems/${this.groceryItem._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshGroceryItems', this.isPantry);

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
