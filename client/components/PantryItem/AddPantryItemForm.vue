<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'AddPantryItemForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/pantryItems',
      method: 'POST',
      hasBody: true,
      collapsible: true,
      dismissible: false,
      fields: [
        { type: 'text', id: 'name', label: 'Name', value: '', placeholder: 'Enter name...' }, 
        { type: 'quantity', id: 'quantity', label: 'Quantity', value: '', placeholder: 'Enter number...', unit: '' },
        { type: 'date', id: 'expiration', label: 'Expiration Date', value: '', expires: true },
        { type: 'reminder', id: 'remindDays', label: 'Remind Me', value: 3, placeholder: 'Enter number...' }
      ],
      title: 'Add New Item',
      refreshPantryItems: true,
      isPantry: true,
      expires: true,
      callback: () => {
        const message = 'Successfully added a pantry item!';
        this.$store.commit('alert', {
          message: message,
          status: 'success'
        });
      }
    };
  }
};
</script>
