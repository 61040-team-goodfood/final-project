<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'AddRecipeForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/recipes',
      method: 'POST',
      hasBody: true,
      collapsible: true,
      fields: [
        { type: 'text', id: 'name', label: 'Name', value: '', placeholder: 'Enter name...' }, 
        { type: 'ingredients', id: 'ingredients', label: 'Ingredients', name: '', quantity: '', unit: '', ingredients: [], tooltip: 'Hit enter or press the add button to add individual ingredients to the recipe' },
        { type: 'content', id: 'instructions', label: 'Instructions', value: '' }, 
        { type: 'cookTime', id: 'cookTime', label: 'Cook Time (in minutes)', value: '', placeholder: 'Enter a number...' }, 
      ],
      title: 'Add New Recipe',
      refreshRecipes: true,
      callback: () => {
        const message = 'Successfully added a recipe!';
        this.$store.commit('alert', {
          message: message,
          status: 'success'
        });
      }
    };
  }
};
</script>
