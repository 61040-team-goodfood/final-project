<!-- Default page that also displays freets -->

<template>
  <main>
    <AddPantryItemForm />
    <hr>
    <h1>My Pantry <i class="bi bi-info-circle" data-toggle="tooltip" data-placement="right" title="Pantry items are displayed by ascending expiration date. If no expiration dates are provided, the items will be displayed by ascending date added after the items with expiration dates."></i></h1> 
    <p>Keep track and manage the items in your pantry here.</p>
    <section
      v-if="$store.state.pantryItems.filter(pantryItem => pantryItem.inPantry === 'true').length"
    >
      <PantryItemComponent
        v-for="item in $store.state.pantryItems.filter(pantryItem => pantryItem.inPantry === 'true').sort((item1, item2) => (item1.expirationDate ? item1.expirationDate : 'a' + item1.dateAdded).localeCompare(item2.expirationDate ? item2.expirationDate : 'a' + item2.dateAdded))"
        :key="item._id"
        :pantryItem="item"
        :isPantry="true"
        :reminder="$store.state.reminders[item._id]"
      />
    </section>
  </main>
</template>

<script>
import PantryItemComponent from '@/components/PantryItem/PantryItemComponent.vue';
import AddPantryItemForm from '@/components/PantryItem/AddPantryItemForm.vue';

export default {
  name: 'PantryItemsPage',
  components: { PantryItemComponent, AddPantryItemForm },
  mounted() {
    this.$store.commit('refreshPantryItems');
    this.$store.commit('refreshReminders');
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
</style>
