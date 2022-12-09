<!-- Default page that also displays freets -->

<template>
  <main>
    <AddPantryItemForm />
    <hr>
    <h1>My Pantry</h1>
    <p>Keep track and manage the items in your pantry here.</p>
    <section
      v-if="$store.state.pantryItems.length"
    >
      <PantryItemComponent
        v-for="item in $store.state.pantryItems"
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
  components: {PantryItemComponent, AddPantryItemForm},
  mounted() {
    this.$store.commit('refreshPantryItems', true);
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
