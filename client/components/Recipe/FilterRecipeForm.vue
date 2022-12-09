<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'FilterRecipeForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/recipes',
      method: 'GET',
      hasBody: true,
      collapsible: true,
      isFilterForm: true,
      fields: [
        { type: 'text', id: 'keyword', label: 'Keyword', value: '', placeholder: 'Enter keyword...' }, 
        { type: 'collection', id: 'ingredients', label: 'Ingredients', value: '', placeholder: 'Type ingredient and hit enter...', collection: [], tooltip: 'Hit enter or press the add button to add individual ingredients to the search filter' },
      ],
      title: 'Filter Recipes',
      tooltip: 'Filter to show recipes that contain both the keyword and list of ingredients.',
      refreshRecipes: true,
    };
  }
};
</script>
