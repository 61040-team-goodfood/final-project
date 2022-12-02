<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'EditPantryItemForm',
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
      url: `/api/pantryItems/${this.pantryItem._id}`,
      method: 'PATCH',
      hasBody: true,
      fields: [
        { type: 'text', id: 'name', label: 'Name', value: this.pantryItem.name, placeholder: 'Enter name...' }, 
        { type: 'quantity', id: 'quantity', label: 'Quantity', value: this.pantryItem.quantity, placeholder: 'Enter number...', unit: this.pantryItem.unit },
        { type: 'date', id: 'expiration', label: 'Expiration Date', value: this.pantryItem.expirationDate, expires: this.pantryItem.expirationDate !== '' },
        { type: 'reminder', id: 'remindDays', label: 'Remind Me', value: this.pantryItem.expirationDate ? Math.ceil((new Date(this.pantryItem.expirationDate) - new Date(this.pantryItem.remindDate))/ (1000 * 60 * 60 * 24)) : 3, placeholder: 'Enter number...' }
      ],
      title: 'Edit Item',
      refreshPantryItems: true,
      isPantry: true,
      expires: true,
      callback: () => {
        const message = 'Successfully edited pantry item!';
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