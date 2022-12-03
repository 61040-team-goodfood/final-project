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
        { type: 'collection', id: 'ingredients', label: 'Ingredients', value: '', placeholder: 'Type ingredient and press enter...', collection: [] },
      ],
      title: 'Filter Recipes',
      refreshRecipes: true,
    };
  }
};
</script>
