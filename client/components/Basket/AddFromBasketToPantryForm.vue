<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'AddFromBasketToPantryForm',
  mixins: [BlockForm],
  props: {
    // Data from the stored item
    basket: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      url: '/api/pantryItems',
      method: 'POST',
      hasBody: true,
      collapsible: false,
      title: 'Add to Pantry',
      fields: [
        { type: 'foodItems', id: 'foodItems', label: 'Items', foodItems: this.basket.ingredients.map(ingredient => ({'item': ingredient, 'quantity': ingredient.quantity})) }, 
      ],
      checkedFoodItems: this.basket.ingredients,
      addFromBasket: true,
      callback: () => {
        const message = 'Successfully added pantry item(s)!';
        this.$store.commit('alert', {
          message: message,
          status: 'success'
        });
        this.$emit('refreshBasketPage');
      }
    };
  }
};
</script>