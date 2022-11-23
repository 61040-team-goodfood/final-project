<!-- Form for creating freets (block style) -->

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
      fields: [
        {id: 'name', label: 'Name', value: ''},
        {id: 'quantity', label: 'Quantity', value: ''},
        {id: 'unit', label: 'Unit', value: '', options: [
          {id: 'count', value: 'Count'},
          {id: 'cups', value: 'Cups'},
          {id: 'ounces', value: 'Ounces'},
          {id: 'tablespoons', value: 'Tablespoons'},
          {id: 'teaspoons', value: 'Teaspoons'},
          {id: 'grams', value: 'Grams'}
        ]},
        {id: 'expiration', label: 'Expiration Date', value: null},
        {id: 'remindDays', label: 'Remind me', value: 3, append: 'days in advance'}
      ],
      title: 'Add New Item',
      refreshGroceryItems: true,
      callback: () => {
        const message = 'Successfully added a grocery item!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>