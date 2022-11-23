<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form 
    class="border rounded p-4" 
    @submit.prevent="submit"
  >
    <h3>{{ title }}</h3>
    <article v-if="fields.length">
      <div 
        v-for="field in fields" 
        :key="field.id"
        class="mb-2" 
      >
        <label :for="field.id"><i>{{ field.label }}:</i></label>
        <textarea 
          v-if="field.type === 'content'" 
          class="form-control" 
          :name="field.id" 
          :value="field.value"
          :placeholder="field.placeholder" 
          @input="field.value = $event.target.value" 
        />
        <div v-else>
          <div v-if="field.type === 'collection'">
            <input 
              class="form-control" 
              :name="field.id" 
              :value="field.value" 
              :placeholder="field.placeholder"
              @input="field.value = $event.target.value" 
              @keydown.enter.prevent="{
                addItem(field.collection, $event.target.value);
                field.value = '';
              }">
            <span 
              v-for="(item, index) in field.collection" 
              :key="item"
              class="badge badge-pill badge-secondary px-2 mx-1 py-1"
            >
              {{ item }}
              <span 
                class="bi bi-x-circle" 
                @click="removeItem(field.collection, index)" 
              />
            </span>
          </div>
          <input 
            v-else 
            class="form-control" 
            :type="field.type === 'password' ? 'password' : 'text'" 
            :name="field.id"
            :value="field.value" 
            :placeholder="field.placeholder" 
            @input="field.value = $event.target.value"
          >
        </div>
      </div>
    </article>
    <article v-else>
      <p>{{ content }}</p>
    </article>
    <button 
      type="submit" 
      class="btn btn-block btn-primary"
    >
      {{ title }}
    </button>
  </form>
</template>

<script>

export default {
  name: 'BlockForm',
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: '', // Url to submit form to
      method: 'GET', // Form request method
      hasBody: false, // Whether or not form request has a body
      setUsername: false, // Whether or not stored username should be updated after form submission
      callback: null // Function to run after successful form submission
    };
  },
  methods: {
    addItem(collection, item) {
      const regex = /^[a-zA-Z]+$/i;
      if (!regex.test(item)) {
        const formattingErrorMessage = `Item must be nonempty words.`
        this.$store.commit('alert', {
          message: formattingErrorMessage,
          status: 'danger'
        });
      } else if (collection.includes(item)) {
        const duplicateErrorMessage = `You have already added this item!`;
        this.$store.commit('alert', {
          message: duplicateErrorMessage,
          status: 'danger'
        });
      } else {
        collection.push(item);
      }
    },
    removeItem(collection, index) {
      collection.splice(index, 1);
    },
    async submit() {
      /**
        * Submits a form with the specified options from data().
        */
      const options = {
        method: this.method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      if (this.hasBody) {
        options.body = JSON.stringify(Object.fromEntries(
          this.fields.map(field => {
            const { type } = field;
            if (type === 'collection') {
              const { collectionName, collection } = field;
              field.collection = [];
              return [collectionName, collection];
            } else {
              const { id, value } = field;
              field.value = '';
              return [id, value]
            }
          })
        ));
      }

      try {
        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        if (this.setUsername) {
          const text = await r.text();
          const res = text ? JSON.parse(text) : { user: null };
          this.$store.commit('setUsername', res.user ? res.user.username : null);
        }

        if (this.callback) {
          this.callback();
        }
      } catch (e) {
        this.$store.commit('alert', {
          message: e, 
          status: 'danger'
        });
      }
    }
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}

article>div {
  display: flex;
  flex-direction: column;
}

form>article p {
  margin: 0;
}

form h3,
form>* {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

textarea {
  font-family: inherit;
  font-size: inherit;
}
</style>
