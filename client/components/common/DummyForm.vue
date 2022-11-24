<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'DummyPage',
  mixins: [BlockForm],
  data() {
    return {
      url: '/dummy',
      method: 'POST',
      hasBody: true,
      fields: [
        { type: 'text', id: 'username', label: 'Username', value: '' }, 
        { type: 'password', id: 'password', label: 'Password', value: '' },
        { type: 'content', id: 'description', label: 'Description', value: '', placeholder: 'Start typing...' },
        { type: 'collection', id: 'tags', label: 'Tags', value: '', placeholder: 'Type tag and press enter...', collection: [] },
        { type: 'quantity', id: 'quantity', label: 'Quantity', value: '', placeholder: 'Enter number...', unit: '' },
        { type: 'numerical', id: 'remindMe', label: 'Remind Me', value: '', placeholder: 'Enter number...' },
        { type: 'date', id: 'expirationDate', label: 'Expiration Date', value: '', expires: false },
        { type: 'ingredients', id: 'ingredients', label: 'Ingredients', name: '', quantity: '', unit: '', ingredients: [] },
        { type: 'baskets', id: 'baskets', label: 'Baskets' }
      ],
      title: 'Example Form',
      callback: () => {
        const message = 'Successfully submitted form!';
        this.$store.commit('alert', {
          message: message,
          status: 'success'
        });
      }
    };
  }
};
</script>
