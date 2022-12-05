<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'AddToBasketForm',
  mixins: [BlockForm],
  props: {
    // Data from the stored item
    pantryItem: {
      type: Object,
      required: true
    },
    isPantry: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    pantryItem: function(newItem, oldItem) {
      this.fields = [
        { type: 'text', id: 'name', label: 'Name', value: newItem.name, placeholder: 'Enter name...' }, 
        { type: 'quantity', id: 'quantity', label: 'Quantity', value: newItem.quantity, placeholder: 'Enter number...', unit: newItem.unit },
        { type: 'baskets', id: 'baskets', label: 'Baskets', newBasket: false, newBasketName: '' }
      ];
    }
  },
  data() {
    return {
      url: '/api/baskets',
      method: 'PATCH',
      hasBody: true,
      title: 'Add to Basket',
      fields: [
        { type: 'text', id: 'name', label: 'Name', value: this.pantryItem.name, placeholder: 'Enter name...' }, 
        { type: 'quantity', id: 'quantity', label: 'Quantity', value: this.pantryItem.quantity, placeholder: 'Enter number...', unit: this.pantryItem.unit },
        { type: 'baskets', id: 'baskets', label: 'Baskets', newBasket: false, newBasketName: '' }
      ],
      refreshPantryItems: true,
      refreshReminders: true,
      collapsible: false,
      isPantry: this.isPantry,
      expires: true,
      addToBasket: true,
      callback: () => {
        const message = 'Successfully added pantry item to basket(s)!';
        this.$store.commit('alert', {
          message: message,
          status: 'success'
        });
      }
    };
  }
};
</script>