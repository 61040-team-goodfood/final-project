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
  data() {
    return {
      url: '/api/baskets',
      method: 'POST',
      hasBody: true,
      fields: [
        { type: 'text', id: 'name', label: 'Name', value: this.pantryItem.name, placeholder: 'Enter name...' }, 
        { type: 'quantity', id: 'quantity', label: 'Quantity', value: this.pantryItem.quantity, placeholder: 'Enter number...', unit: this.pantryItem.unit },
        { type: 'baskets', id: 'baskets', label: 'Baskets' }
      ],
      title: 'Add to Basket',
      refreshPantryItems: true,
      isPantry: false,
      expires: true,
      callback: () => {
        const message = 'Successfully added pantry item!';
        this.$store.commit('alert', {
          message: message,
          status: 'success'
        });
        if (!this.alerts.length) {
          this.$emit('stopEditing');
        }
      }
    };
  }
};
</script>