<!-- Reusable component representing a single item and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="border rounded my-2 p-4">
    <section>
      <button
        v-if="!editing" 
        class="btn btn-primary btn-sm mr-2 my-2 bi bi-pencil"
        @click="editing = true"
      >
        Edit
      </button>
      <button 
        v-else
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
    </section>
    <br>
    <section>
      <EditGroceryItemForm 
        :groceryItem=this.groceryItem 
        :visible=editing
      />
    </section>
  </article>
</template>

<script>
import EditGroceryItemForm from '@/components/GroceryItem/EditGroceryItemForm.vue';

export default {
  name: 'GroceryItemComponent',
  components: {EditGroceryItemForm},
  props: {
    // Data from the stored item
    groceryItem: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this item is in edit mode
      // draft: this.item.content, // Potentially-new content for this item
      alerts: {} // Displays success/error messages encountered during item modification
    };
  },
  methods: {
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
        const r = await fetch(`/api/groceryItems/${this.groceryItem._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshGroceryItems', true);

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
