<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form 
    class="border rounded p-4" 
    @submit.prevent="submit" 
    :hidden="!visible"
  >
    <section v-if="collapsible">
      <button @click="collapsed = !collapsed" class="btn btn-link btn-block text-left p-0" type="button" data-toggle="collapse" :data-target="('#' + title)" aria-expanded="false">
        <h3>
          {{ title }}
          <i v-if="collapsed" class="bi bi-caret-left-fill right"></i>
          <i v-else class="bi bi-caret-down-fill right"></i>
        </h3>
      </button>
    </section>
    <h3 v-else>{{ title }}</h3>
    <section v-bind:class="{'collapse show': !collapsible, 'collapse': collapsible}" :id="title">
      <article v-if="fields.length">
        <div v-for="field in fields" :key="field.id" class="mb-2">
          <label :for="field.id"><i>{{ field.label }}:</i></label>
          <textarea v-if="field.type === 'content'" class="form-control" :name="field.id" :value="field.value"
            :placeholder="field.placeholder" @input="field.value = $event.target.value" required />

          <div v-else-if="field.type === 'collection'">
            <div class="input-group">
              <input class="form-control" :name="field.id" :value="field.value" :placeholder="field.placeholder"
                @input="field.value = $event.target.value" @keydown.enter.prevent="{
                  addItem(field.collection, $event.target.value);
                  field.value = '';
                }">
              <div class="input-group-append">
                <button
                  type="button"
                  class="btn btn-info px-4"
                  @click.prevent="addItem(field.collection, field.value)"
                >
                  Add
                </button>
              </div>
            </div>
            <span v-for="(item, index) in field.collection" :key="item"
              class="badge badge-pill badge-secondary px-2 mx-1 py-1">
              {{ item }}
              <span class="bi bi-x-circle" @click="removeItem(field.collection, index)" />
            </span>
          </div>
          <div v-else-if="field.type === 'quantity'" class="row">
            <div class="col-6">
              <input class="form-control" type="number" :name="field.id" :value="field.value"
                :placeholder="field.placeholder" min="1" @input="field.value = $event.target.value" required>
            </div>
            <div class="col-6">
              <select class="form-control" @change="field.unit = $event.target.value" required>
                <option value="" :selected="field.unit === ''" disabled>Select a unit</option>
                <option v-for="unit in $store.state.units" :key="unit" :value="unit" :selected="field.unit === unit">
                  {{ unit }}
                </option>
              </select>
            </div>
          </div>
          <input v-else-if="field.type === 'numerical'" class="form-control" type="number" :name="field.id"
            :value="field.value" :placeholder="field.placeholder" min="0" @input="field.value = $event.target.value"
            required>
          <div v-else-if="field.type === 'date'" class="row date">
            <div class="col-10">
              <input class="form-control" type="date" :name="field.id" :value="field.value" :required="expires"
                :disabled="!expires" @input="field.value = $event.target.value">
            </div>
            <div class="form-check col-2 align-middle">
              <input class="form-check-input" type="checkbox" value="" :id="field.id" :checked="!expires"
                @change="expires = !expires">
              <label class="form-check-label" :for="field.id">
                None
              </label>
            </div>
          </div>
          <div v-else-if="field.type === 'reminder'" class="row">
            <div class="col-9">
              <input class="form-control" type="number" :name="field.id" :value="field.value"
                :placeholder="field.placeholder" :disabled="!expires" min="1" @input="field.value = $event.target.value"
                required>
            </div>
            days in advance
          </div>
          <div v-else-if="field.type === 'ingredients'">
            <div class="row">
              <div class="col-4 pr-0">
                <input class="form-control" type="text" :name="field.id" :value="field.name" placeholder="Name"
                  @input="field.name = $event.target.value">
              </div>
              <div class="col-3 pr-0">
                <input class="form-control" type="number" :name="field.id" :value="field.quantity" placeholder="Quantity"
                  min="1" @input="field.quantity = $event.target.value">
              </div>
              <div class="col-3 pr-0">
                <select class="form-control" @change="field.unit = $event.target.value">
                  <option value="" :selected="field.unit === ''" disabled>Select a unit</option>
                  <option v-for="unit in $store.state.units" :key="unit" :value="unit" :selected="field.unit === unit">
                    {{ unit }}
                  </option>
                </select>
              </div>
              <div class="col-2">
                <button class="btn btn-info px-4" @click.prevent="{
                  addIngredient(field.ingredients, field.name, field.quantity, field.unit);
                  field.name = '';
                  field.quantity = '';
                  field.unit = '';
                };">
                  Add
                </button>
              </div>
            </div>
            <ul class="list-group">
              <li v-for="(item, index) in field.ingredients" :key="item" class="list-group-item">
                {{ item.name }} × {{ item.quantity }} {{ item.unit }}
                <span class="bi bi-x-circle float-right" @click="removeItem(field.ingredients, index)" />
              </li>
            </ul>
          </div>
          <div v-else-if="field.type === 'baskets'" >
            <div class="form-check">
              <div v-for="basket in $store.state.baskets" :key="basket">
                <input class="form-check-input" type="checkbox" :value="basket" :id="basket" v-model="checkedBaskets"
                  :checked="checkedBaskets.includes(basket)" @input="field.value = $event.target.value">
                <label class="form-check-label" :for="basket">
                  {{ basket.name }}
                </label>
              </div>
              <div class="">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="newBasket"
                  @input="field.value = $event.target.value"
                  @click="addNewBasket = !addNewBasket"
                  :checked="addNewBasket"
                >
                <label class="form-check-label form-inline" for="newBasket">
                  <i>Create a new basket: </i>
                  <input 
                    class="form-control form-control-sm mx-3" 
                    type="text" 
                    placeholder="New basket name" 
                    :required="addNewBasket"
                    @input="newBasketName = $event.target.value"
                  >
                </label>
              </div>
            </div>
          </div>
          <div v-else-if="field.type === 'foodItems'" >
            <div class="form-check">
              <div v-for="item in field.foodItems" :key="item" class="row">
                <div class="col-3">
                  <input class="form-check-input" type="checkbox" :value="item.item" :id="item.item" v-model="checkedFoodItems"
                  :checked="checkedFoodItems.includes(item.item)" @input="field.value = $event.target.value">
                  <label class="form-check-label">
                    {{ item.item.name }}:
                  </label>
                </div>
                <div class="col-7">
                  <input class="form-control" type="number" :value="item.quantity"
                    :placeholder="field.placeholder" min="1" @input="item.quantity = $event.target.value" required>
                </div>
                <div class="col-2">
                  <label class="form-check-label">
                  {{ item.item.unit }}
                </label>
                </div>
              </div>
            </div>
          </div>
          <input v-else-if="field.type === 'cookTime'" class="form-control" type="number" :name="field.id"
            :value="field.value" :placeholder="field.placeholder" min="1" @input="field.value = $event.target.value"
            required>
          <input v-else class="form-control" :type="field.type === 'password' ? 'password' : 'text'" :name="field.id"
            :value="field.value" :placeholder="field.placeholder" @input="field.value = $event.target.value" :required="!isFilterForm">
          <p v-if="field.append">{{ field.append }}</p>
        </div>
      </article>
      <article v-else>
        <p>{{ content }}</p>
      </article>
      <button 
        v-if="isFilterForm"
        type="submit" 
        class="btn btn-block btn-success mt-4"
      >
        <i class="bi bi-search"></i>
        {{ title }}
      </button>
      <button 
        v-else
        type="submit" 
        class="btn btn-block btn-primary mt-4"
      >
        {{ title }}
      </button>
  </section>
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
      refreshPantryItems: false,
      refreshBaskets: false,
      refreshRecipes: false,
      refreshReminders: false,
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null, // Function to run after successful form submission 
      checkedBaskets: [],
      expires: true,
      visible: true,
      isFilterForm: false,
      collapsed: true,
      addToBasket: false,
      addNewBasket: false,
      newBasketName: '',
      checkedFoodItems: [],
      addFromBasket: false,
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
      const regex = /^[a-zA-Z ]+$/i;

      if (!item.trim()) {
        const emptyErrorMessage = 'Item name cannot be left empty.';
        this.$store.commit('alert', {
          message: emptyErrorMessage,
          status: 'danger'
        });
      }
      else if (!regex.test(item)) {
        const formattingErrorMessage = 'Item must consist of letters and spaces only.';
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
      const regex = /^[a-zA-Z ]+$/i

      if (!name.trim()) {
        const emptyErrorMessage = 'Name cannot be empty.';
        this.$store.commit('alert', {
          message: emptyErrorMessage,
          status: 'danger'
        });
      }
      else if (quantity === '' || unit === '') {
        const emptyFieldMessage = 'Fields cannot be left empty!';
        this.$store.commit('alert', {
          message: emptyFieldMessage,
          status: 'danger'
        });
      } else if (!regex.test(name)) {
        const formattingErrorMessage = 'Name must consist of letters and spaces only.';
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
      // Special submission procedure for filter form.
      if (this.isFilterForm) {
        let keyword = '';
        let ingredients = [];

        for (const field of this.fields) {
          if (field.id === 'keyword') {
            keyword = field.value;
            field.value = '';
          } 

          if (field.id === 'ingredients') {
            ingredients = field.collection;
            field.collection = [];
          }
        }

        const filter = {
          keyword,
          ingredients
        };

        this.$store.commit('updateFilter', filter);
        this.$store.commit('refreshRecipes');
        return;
      }

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

          if (field.type === 'content' || field.type === 'text') {
            if (!field.value.trim()) {
              const emptyFieldMessage = 'Fields cannot be left empty!';
              this.$store.commit('alert', {
                message: emptyFieldMessage,
                status: 'danger'
              });
              return;
            }
          }
        }
      }

      // checks to see if any baskets are chosen when adding to basket
      if (this.addToBasket) {
        if (this.checkedBaskets.length === 0 && !this.addNewBasket) {
          const emptyFieldMessage = 'Please choose a basket!';
            this.$store.commit('alert', {
              message: emptyFieldMessage,
              status: 'danger'
            });
            return;
        }
      }

      // checks to for duplicate basket names
      if (this.addNewBasket) {
        for (const basket of this.$store.state.baskets) {
          if (this.newBasketName && this.newBasketName === basket.name) {
            const duplicateNameMessage = 'A basket with this name already exists!';
            this.$store.commit('alert', {
              message: duplicateNameMessage,
              status: 'danger'
            });
            return;
          }
        }
      }

      if (this.addFromBasket) {
        if (this.checkedFoodItems.length === 0) {
          const emptyFieldMessage = 'Please choose an item!';
            this.$store.commit('alert', {
              message: emptyFieldMessage,
              status: 'danger'
          });
          return;
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
              const { id, value } = field;
              field.value = 3;
              return [id, value];
            } else if (type === 'baskets') {
              const { id } = field;
              const baskets = this.checkedBaskets;
              const name = this.addNewBasket ? this.newBasketName : null;

              this.checkedBaskets = [];
              // field.newBasket = false;
              // field.newBasketName = '';

              return [id, { new: name, baskets: baskets }];
            } else if (type === 'foodItems') {
              const { id, foodItems } = field;
              const checkedFoodItems = [];
              for (const foodItem of foodItems) {
                if (this.checkedFoodItems.includes(foodItem.item)) {
                  checkedFoodItems.push({name: foodItem.item.name, quantity: foodItem.quantity, unit: foodItem.item.unit})
                }
              }
              return [id, checkedFoodItems];
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

        if (this.refreshPantryItems) {
          this.$store.commit('refreshPantryItems', this.isPantry);
        }

        if (this.refreshReminders) {
          this.$store.commit('refreshReminders')
        }

        if (this.refreshBaskets) {
          this.$store.commit('refreshBaskets');
        }
        
        if (this.refreshRecipes) {
          this.$store.commit('refreshRecipes');
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

.btn-link {
  color: inherit;
}

.right {
  float: right;
}
</style>
