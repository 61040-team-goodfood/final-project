<!-- Default page that also displays freets -->

<template>
  <main>
    <h2 class="display-4">History</h2>
    <section
      v-if="$store.state.pantryItems.filter(pantryItem => pantryItem.inPantry === 'false').length"
    >
      <PantryItemComponent
        v-for="item in $store.state.pantryItems.filter(pantryItem => pantryItem.inPantry === 'false')"
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
