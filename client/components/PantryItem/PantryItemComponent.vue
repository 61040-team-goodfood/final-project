<!-- Reusable component representing a single item and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="border rounded my-2 p-4">
    <section>
      <button
        v-if="!editing && isPantry" 
        class="btn btn-primary btn-sm mr-2 my-2 bi bi-pencil"
        @click="toggleEditing"
      >
        Edit
      </button>
      <button 
        v-if="editing && isPantry"
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
        v-if="!isPantry"
        class="btn btn-info btn-sm mr-2 my-2 right"
        @click="toggleAddToPantry"
      >
        Add to Pantry
      </button>
      <button 
        class="btn btn-info btn-sm mr-2 my-2 right"
        @click="toggleAddToBasket"
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
        <b>Reminder on:</b> {{ reminder.date }}
      </div>
    </section>
    <section v-if="addToPantry && !isPantry">
      <AddToPantryForm 
        class="mt-4"
        :pantryItem=this.pantryItem   
        :visible="addToPantry"
        :reminder=this.reminder
      />
    </section>
    <section v-if="addToBasket">
      <AddToBasketForm 
        class="mt-4"
        :pantryItem=this.pantryItem 
        :visible="addToBasket"
        :reminder=this.reminder
      />
    </section>
    <section>
      <EditPantryItemForm 
        class="mt-4"
        :pantryItem=this.pantryItem 
        :visible="editing"
        :reminder=this.reminder
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
    reminder: {
      type: Object,
      required: true
    },
    isPantry: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    pantryItem: function(newItem, oldItem) {
      this.editing = false;
      this.addToBasket = false;
      this.addToPantry = false;
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
    toggleAddToPantry() {
      this.addToPantry = !this.addToPantry;
      this.addToBasket = false;
      this.editing = false;
    },
    toggleAddToBasket() {
      this.addToBasket = !this.addToBasket;
      this.addToPantry = false;
      this.editing = false;
    },
    toggleEditing() {
      this.editing = !this.editing;
      this.addToBasket = false;
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

        this.$store.commit('refreshPantryItems', this.isPantry);
        this.$store.commit('refreshReminders');

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
