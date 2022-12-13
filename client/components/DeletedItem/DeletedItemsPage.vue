<!-- Default page that also displays freets -->

<template>
  <main>
    <h1>Deleted Items <i class="bi bi-info-circle" data-toggle="tooltip" data-placement="right" title="Deleted items are displayed in descending date added to pantry order."></i></h1>
    <p>View all your deleted pantry items here.</p>
    <section
      v-if="$store.state.pantryItems.filter(pantryItem => pantryItem.inPantry === 'false').length"
    >
      <PantryItemComponent
        v-for="item in $store.state.pantryItems.filter(pantryItem => pantryItem.inPantry === 'false').sort((item1, item2) => item2.dateAdded.localeCompare(item1.dateAdded))"
        :key="item._id"
        :pantryItem="item"
        :reminder="$store.state.reminders[item._id]"
        :isPantry="false"
      />
    </section>
    <p v-else>No history items.</p>
  </main>
</template>

<script>
import PantryItemComponent from '@/components/PantryItem/PantryItemComponent.vue';

export default {
  name: 'PantryItemsPage',
  components: {PantryItemComponent},
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
