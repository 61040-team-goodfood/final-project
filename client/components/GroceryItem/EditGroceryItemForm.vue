<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'EditGroceryItemForm',
  mixins: [BlockForm],
  props: {
    // Data from the stored item
    groceryItem: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      url: `/api/groceryItems/${this.groceryItem._id}`,
      method: 'PATCH',
      hasBody: true,
      collapsible: false,
      fields: [
        { type: 'text', id: 'name', label: 'Name', value: this.groceryItem.name, placeholder: 'Enter name...' }, 
        { type: 'quantity', id: 'quantity', label: 'Quantity', value: this.groceryItem.quantity, placeholder: 'Enter number...', unit: this.groceryItem.unit },
        { type: 'date', id: 'expiration', label: 'Expiration Date', value: this.groceryItem.expirationDate, expires: this.groceryItem.expirationDate !== '' },
        { type: 'reminder', id: 'remindDays', label: 'Remind Me', value: this.groceryItem.expirationDate ? Math.ceil((new Date(this.groceryItem.expirationDate) - new Date(this.groceryItem.remindDate))/ (1000 * 60 * 60 * 24)) : 3, placeholder: 'Enter number...' }
      ],
      title: 'Edit Item',
      refreshGroceryItems: true,
      isPantry: true,
      expires: true,
      callback: () => {
        const message = 'Successfully edited grocery item!';
        this.$store.commit('alert', {
          message: message,
          status: 'success'
        });
      }
    };
  }
};
</script>