<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'AddFromRecipeToBasketForm',
  mixins: [BlockForm],
  props: {
    // Data from the stored item
    recipe: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      url: '/api/baskets',
      method: 'PATCH',
      hasBody: true,
      collapsible: false,
      title: 'Add to Basket',
      fields: [
        { type: 'foodItems', id: 'foodItems', label: 'Items', foodItems: this.recipe.ingredients.map(ingredient => ({'item': ingredient, 'quantity': ingredient.quantity})) }, 
        { type: 'baskets', id: 'baskets', label: 'Baskets', newBasket: false, newBasketName: '' }
      ],
      checkedFoodItems: this.recipe.ingredients,
      addToBasket: true,
      callback: () => {
        const message = 'Successfully added ingredient item(s)!';
        this.$store.commit('alert', {
          message: message,
          status: 'success'
        });
        this.$emit('refreshRecipePage');
      }
    };
  }
};
</script>