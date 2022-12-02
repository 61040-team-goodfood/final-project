<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="border rounded my-2 p-4">
    <section v-if="editing">
      <EditPantryItemForm 
        :pantryItem=this.pantryItem 
        @stopEditing="this.stopEditing" 
      />
    </section>
    <section v-else>
      <button 
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
  </article>
</template>

<script>
import EditPantryItemForm from '@/components/PantryItem/EditPantryItemForm.vue';

export default {
  name: 'PantryItemComponent',
  components: {EditPantryItemForm},
  props: {
    // Data from the stored item
    pantryItem: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this item is in edit mode
      alerts: {} // Displays success/error messages encountered during item modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this item.
       */
      this.editing = true; // Keeps track of if a item is being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this item.
       */
      this.editing = false;
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
        const r = await fetch(`/api/pantryItems/${this.pantryItem._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshPantryItems', true);

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
