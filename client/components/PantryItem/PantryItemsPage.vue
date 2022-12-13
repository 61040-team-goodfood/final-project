<!-- Default page that also displays freets -->

<template>
  <main>
    <AddPantryItemForm />
    <hr>
    <h1>My Pantry <i class="bi bi-info-circle" data-toggle="tooltip" data-placement="right"
        title="Pantry items are displayed by ascending expiration date. If no expiration dates are provided, the items will be displayed by ascending date added after the items with expiration dates."></i>
    </h1>
    <section>
      <p>Keep track and manage the items in your pantry here.</p>
      <header class="inline">
        <h3>
          <i>Viewing {{ expiringItemsOnly ? 'expiring items only' : 'all pantry items' }}</i>
          <button v-if="expiringItemsOnly" class="btn btn-primary mr-2 my-2 right" @click="toggleDisplay">
            View all pantry items
          </button>
          <button v-else class="btn btn-primary mr-2 my-2 right" @click="toggleDisplay">
            View expiring items only
          </button>
        </h3>
      </header>
    </section>
    <section v-if="$store.state.pantryItems.filter(pantryItem => pantryItem.inPantry === 'true').length">
      <PantryItemComponent
        v-for="item in $store.state.pantryItems.filter(pantryItem => expiringItemsOnly ? pantryItem.inPantry === 'true' && pantryItem.expirationDate : pantryItem.inPantry === 'true').sort((item1, item2) => (item1.expirationDate ? item1.expirationDate : 'a' + item1.dateAdded).localeCompare(item2.expirationDate ? item2.expirationDate : 'a' + item2.dateAdded))"
        :key="item._id" :pantryItem="item" :isPantry="true" :reminder="$store.state.reminders[item._id]" />
    </section>
  </main>
</template>

<script>
import PantryItemComponent from '@/components/PantryItem/PantryItemComponent.vue';
import AddPantryItemForm from '@/components/PantryItem/AddPantryItemForm.vue';

export default {
  name: 'PantryItemsPage',
  components: { PantryItemComponent, AddPantryItemForm },
  data() {
    return {
      expiringItemsOnly: false,
    }
  },
  mounted() {
    this.$store.commit('refreshPantryItems');
    this.$store.commit('refreshReminders');
  },
  methods: {
    toggleDisplay() {
      this.expiringItemsOnly = !this.expiringItemsOnly;
    }
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}

.right {
  float: right;
}

.inline {
    display: inline;
}
</style>
