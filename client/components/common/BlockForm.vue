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
          required
        />
        
        <div v-else-if="field.type === 'collection'">
          <input 
            class="form-control" 
            :name="field.id" 
            :value="field.value" 
            :placeholder="field.placeholder"
            @input="field.value = $event.target.value" 
            @keydown.enter.prevent="{
              addItem(field.collection, $event.target.value);
              field.value = '';
            }"
          >
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
        <div 
          v-else-if="field.type === 'quantity'"
          class="row"
        >
          <div class="col-6">
            <input 
              class="form-control"
              type="number" 
              :name="field.id" 
              :value="field.value"
              :placeholder="field.placeholder"
              min="1" 
              @input="field.value = $event.target.value" 
              required
            >
          </div>
          <div class="col-6">
            <select 
              class="form-control"
              @change="field.unit = $event.target.value"
              required
            >
              <option 
                value="" 
                :selected="field.unit === ''"
                disabled
              >Select a unit</option>
              <option
                v-for="unit in $store.state.units"
                :key="unit"
                :value="unit"
                :selected="field.unit === unit"
              >
                {{ unit }}
              </option>
            </select>
          </div>
        </div>
        <input
          v-else-if="field.type === 'numerical'"
          class="form-control"
          type="number"
          :name="field.id"
          :value="field.value"
          :placeholder="field.placeholder"
          min="0"
          @input="field.value = $event.target.value" 
          required
        >
        <div
          v-else-if="field.type === 'date'"
          class="row date"
        >
          <div
            class="col-10"
          >
            <input
              class="form-control"
              type="date"
              :name="field.id"
              :value="field.value"
              :required="expires"
              :disabled="!expires"
              @input="field.value = $event.target.value" 
            >
          </div>
          <div 
            class="form-check col-2 align-middle"
          >
            <input 
              class="form-check-input" 
              type="checkbox" 
              value="" 
              :id="field.id"
              :checked="!expires"
              @change="expires = !expires"
            >
            <label 
              class="form-check-label" 
              :for="field.id"
            >
              None
            </label>
          </div>
        </div>
        <div 
          v-else-if="field.type === 'reminder'"
          class="row"
        >
          <div class="col-9">
            <input 
              class="form-control"
              type="number" 
              :name="field.id" 
              :value="field.value"
              :placeholder="field.placeholder"
              :disabled="!expires"
              min="1" 
              @input="field.value = $event.target.value" 
              required
            >
          </div>
          days in advance
        </div>
        <div
          v-else-if="field.type === 'ingredients'"
        >
          <div class="row">
            <div class="col-5">
              <input 
                class="form-control" 
                type="text" 
                :name="field.id" 
                :value="field.name"
                placeholder="Name" 
                @input="field.name = $event.target.value"
              >
            </div>
            <div class="col-3">
              <input 
                class="form-control"
                type="number" 
                :name="field.id" 
                :value="field.quantity"
                placeholder="Quantity"
                min="1" 
                @input="field.quantity = $event.target.value" 
              >
            </div>
            <div class="col-3">
              <select 
                class="form-control"
                @change="field.unit = $event.target.value"
              >
                <option 
                  value="" 
                  :selected="field.unit === ''"
                  disabled
                >Select a unit</option>
                <option
                  v-for="unit in $store.state.units"
                  :key="unit"
                  :value="unit"
                  :selected="field.unit === unit"
                >
                  {{ unit }}
                </option>
              </select>
            </div>
            <div class="col-1">
              <button 
                class="btn btn-info"
                @click.prevent="{
                  addIngredient(field.ingredients, field.name, field.quantity, field.unit);
                  field.name = '';
                  field.quantity = '';
                  field.unit = '';
                };"
              >
                Add
              </button>
            </div>
          </div>
          <ul class="list-group">
            <li 
              v-for="(item, index) in field.ingredients"
              :key="item"
              class="list-group-item"
            >
              {{ item.name }} × {{ item.quantity }} {{ item.unit }}
              <span 
                class="bi bi-x-circle float-right" 
                @click="removeItem(field.ingredients, index)" 
              />
            </li>
          </ul>
        </div>

        <div
          v-else-if="field.type === 'baskets'"
          class="form-check"
        >
          <div
            v-for="basket in $store.state.baskets"
            :key="basket"
          >
            <input 
              class="form-check-input" 
              type="checkbox" 
              :value="basket" 
              :id="basket"
              v-model="checkedBaskets"
              :checked="checkedBaskets.includes(basket)"
              @input="field.value = $event.target.value"
            >
            <label 
              class="form-check-label" 
              :for="basket"
            >
              {{ basket }}
            </label>
          </div>
        </div>
        <input 
          v-else 
          class="form-control" 
          :type="field.type === 'password' ? 'password' : 'text'" 
          :name="field.id"
          :value="field.value" 
          :placeholder="field.placeholder" 
          @input="field.value = $event.target.value"
          required
        >
        <p v-if="field.append">{{ field.append }}</p>
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
import moment from 'moment';

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
      refreshGroceryItems: false,
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null, // Function to run after successful form submission 
      checkedBaskets: [],
      expires: true,
      editing: false,
    };
  },
  created() {
    for (const field of this.fields) {
      if (field.type === 'date') {
        this.expires = field.expires;
      }
    }
  },
  methods: {
    addItem(collection, item) {
      const regex = /^[a-zA-Z]+$/i;
      if (!regex.test(item)) {
        const formattingErrorMessage = 'Item must be nonempty words.';
        this.$store.commit('alert', {
          message: formattingErrorMessage,
          status: 'danger'
        });
      } else if (collection.includes(item)) {
        const duplicateErrorMessage = 'You have already added this item!';
        this.$store.commit('alert', {
          message: duplicateErrorMessage,
          status: 'danger'
        });
      } else {
        collection.push(item);
      }
    },
    addIngredient(ingredients, name, quantity, unit) {
      const regex = /^[a-zA-Z]+$/i;

      if (name === '' || quantity === '' || unit === '') {
        const emptyFieldMessage = 'Fields cannot be left empty!';
        this.$store.commit('alert', {
          message: emptyFieldMessage,
          status: 'danger'
        });
      } else if (!regex.test(name)) {
        const formattingErrorMessage = 'Name must be nonempty words.';
        this.$store.commit('alert', {
          message: formattingErrorMessage,
          status: 'danger'
        });
      } else if (ingredients.some(ingredient => ingredient.name === name)) {
        const duplicateErrorMessage = 'You have already added this ingredient!';
        this.$store.commit('alert', {
          message: duplicateErrorMessage,
          status: 'danger'
        });
      } else {
        ingredients.push({
          name: name,
          quantity: quantity,
          unit: unit
        });
      }
    },
    removeItem(collection, index) {
      collection.splice(index, 1);
    },
    async submit() {
      // Error checking entries before submission.
      if (this.expires) {
        let expireDate = null;
        for (const field of this.fields) {
          if (field.type === 'date') {
            expireDate = new Date(field.value);

            if (expireDate <= new Date()) {
              const expirationDateErrorMessage = 'Expiration date must be in the future!';
              this.$store.commit('alert', {
                message: expirationDateErrorMessage,
                status: 'danger'
              });
              return;
            }
          } 

          if (field.type === 'reminder' && expireDate !== null) {
            const remindDate = new Date(expireDate.setDate(expireDate.getDate() - field.value));
            if (remindDate <= new Date()) {
              const reminderDateErrorMessage = 'Reminder date must be in the future!';
              this.$store.commit('alert', {
                message: reminderDateErrorMessage,
                status: 'danger'
              });
              return;
            }
          }
        }
      }
      
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
              const { id, collection } = field;
              field.value = '';
              field.collection = [];
              return [id, collection];
            } else if (type === 'ingredients') {
              const { id, ingredients } = field;
              field.name = '';
              field.quantity = '';
              field.unit = '';
              field.ingredients = [];
              return [id, ingredients];
            } else if (type === 'quantity') {
              const { id, value, unit } = field;
              field.value = '';
              field.unit = '';
              return [id, { 
                value: value, 
                unit: unit
              }];
            } else if (type === 'date') {
              const { id, value } = field;
              field.value = '';
              const hasExpiration = this.expires;
              this.expires = true;
              return hasExpiration ? [id, value] : [id, null];
            } else if (type === 'reminder') {
              const {id, value} = field;
              field.value = 3;
              return [id, value];
            } else if (type === 'baskets') {
              const { id } = field;
              const baskets = this.checkedBaskets;
              this.checkedBaskets = [];
              return [id, baskets];
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

        if (this.refreshGroceryItems) {
          this.$store.commit('refreshGroceryItems', this.isPantry);
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

.date {
  display: flex;
  align-items: center;
}

.btn-info {
  width: 100%;
}
</style>
