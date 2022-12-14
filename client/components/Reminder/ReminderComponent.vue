<!-- Reusable component representing a single item and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <div>
    <div class="modal fade" :id="reminder._id + 'confirmationModal'" tabindex="-1" role="dialog" :aria-labelledby="reminder._id + 'confirmationModalLabel'" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Are you sure you want to dismiss this reminder?
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-danger" 
              data-dismiss="modal"
              @click="dismissReminder"
            >
              Confirm
            </button>
            <button 
              type="button" 
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    <article class="border rounded my-2 p-4">
      <section>
        <button 
          class="btn btn-danger btn-sm my-2 bi bi-x-circle" 
          data-toggle="modal" 
          :data-target="'#' + reminder._id + 'confirmationModal'"
        >
          Dismiss
        </button>
        <router-link
          type="button"
          class="btn btn-info btn-sm right"
          :to="{
            path: 'recipes',
            query: {
              ingredients: [reminder.item.name]
            }
          }"
        >
          See Recipes
        </router-link>
        <div>
          <b>Name:</b> {{ reminder.item.name }} <br>
          <b>Quantity:</b> {{ reminder.item.quantity }} {{ reminder.item.unit }}
        </div>
        <div>
          <b>In pantry since:</b> {{ reminder.item.dateAdded }}
        </div>
        <div v-if="reminder.item.expirationDate">
          <b>Expires on:</b> {{ reminder.item.expirationDate }} <br>
        </div>
      </section>
    </article>
  </div>
</template>
  
<script>

export default {
  name: 'ReminderComponent',
  props: {
    // Data from the stored item
    reminder: {
      type: Object,
      required: true
    },
  },
  methods: {
    dismissReminder() {
      /**
       * Deletes this item.
       */
      const params = {
        method: 'PATCH',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully dismissed reminder', status: 'success'
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
      options.body = JSON.stringify({ dismissed: true });

      try {
        const r = await fetch(`/api/reminders/${this.reminder.item._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

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
  