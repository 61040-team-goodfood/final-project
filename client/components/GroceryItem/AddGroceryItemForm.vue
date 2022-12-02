<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'AddGroceryItemForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/groceryItems',
      method: 'POST',
      hasBody: true,
      collapsible: true,
      fields: [
        { type: 'text', id: 'name', label: 'Name', value: '', placeholder: 'Enter name...' }, 
        { type: 'quantity', id: 'quantity', label: 'Quantity', value: '', placeholder: 'Enter number...', unit: '' },
        { type: 'date', id: 'expiration', label: 'Expiration Date', value: '', expires: true },
        { type: 'reminder', id: 'remindDays', label: 'Remind Me', value: 3, placeholder: 'Enter number...' }
      ],
      title: 'Add New Item',
      refreshGroceryItems: true,
      expires: true,
      callback: () => {
        const message = 'Successfully added a grocery item!';
        this.$store.commit('alert', {
          message: message,
          status: 'success'
        });
      }
    };
  }
};
</script>
