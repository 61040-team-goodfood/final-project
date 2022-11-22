<!-- Default page that also displays freets -->

<template>
  <main>
    <header>
      <h2>My Pantry</h2>
    </header>
    <AddGroceryItemForm />
    <section
      v-if="$store.state.groceryItems.length"
    >
      <GroceryItemComponent
        v-for="item in $store.state.groceryItems"
        :key="item.id"
        :groceryItem="item"
      />
    </section>
  </main>
</template>

<script>
import GroceryItemComponent from '@/components/GroceryItem/GroceryItemComponent.vue';
import AddGroceryItemForm from '@/components/GroceryItem/AddGroceryItemForm.vue';

export default {
  name: 'GroceryItemsPage',
  components: {GroceryItemComponent, AddGroceryItemForm},
  mounted() {
    this.$store.commit('refreshGroceryItems', true);
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
