<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'AddToPantryForm',
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
      url: '/api/pantryItems',
      method: 'POST',
      hasBody: true,
      collapsible: false,
      fields: [
        { type: 'text', id: 'name', label: 'Name', value: this.pantryItem.name, placeholder: 'Enter name...' }, 
        { type: 'quantity', id: 'quantity', label: 'Quantity', value: this.pantryItem.quantity, placeholder: 'Enter number...', unit: this.pantryItem.unit },
        { type: 'date', id: 'expiration', label: 'Expiration Date', value: this.pantryItem.expirationDate, expires: this.pantryItem.expirationDate !== '' },
        { type: 'reminder', id: 'remindDays', label: 'Remind Me', value: this.pantryItem.expirationDate ? Math.ceil((new Date(this.pantryItem.expirationDate) - new Date(this.pantryItem.remindDate))/ (1000 * 60 * 60 * 24)) : 3, placeholder: 'Enter number...' }
      ],
      title: 'Add to Pantry',
      refreshPantryItems: true,
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