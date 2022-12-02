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
      method: 'POST',
      hasBody: true,
      title: 'Add to Basket',
      fields: [
        { type: 'text', id: 'name', label: 'Name', value: this.pantryItem.name, placeholder: 'Enter name...' }, 
        { type: 'quantity', id: 'quantity', label: 'Quantity', value: this.pantryItem.quantity, placeholder: 'Enter number...', unit: this.pantryItem.unit },
        { type: 'baskets', id: 'baskets', label: 'Baskets', newBasket: false, newBasketName: '' }
      ],
      refreshPantryItems: true,
      collapsible: false,
      isPantry: false,
      expires: true,
      callback: () => {
        const message = 'Successfully added pantry item!';
        this.$store.commit('alert', {
          message: message,
          status: 'success'
        });
      }
    };
  }
};
</script>