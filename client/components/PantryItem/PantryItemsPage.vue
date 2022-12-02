<!-- Default page that also displays freets -->

<template>
  <main>
    <AddPantryItemForm />
    <hr>
    <h2 class="display-4">My Pantry</h2>
    <section
      v-if="$store.state.pantryItems.length"
    >
      <PantryItemComponent
        v-for="item in $store.state.pantryItems"
        :key="item.id"
        :pantryItem="item"
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
