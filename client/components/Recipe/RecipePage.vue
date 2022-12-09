<template>
    <div>
        <div v-if="fetching">
            <strong>Loading...</strong>
        </div>  
        <main v-else>
            <header>
                <h1>{{ recipe.name }}</h1>
                <button
                    v-if="$store.state.username === recipe.author" 
                    class="btn btn-danger my-2 bi bi-trash" 
                    @click="deleteRecipe"
                >
                    Delete
                </button>
            </header>
            <p>Recipe by @{{ recipe.author }}</p><br>
            <p class="text-secondary"><i>Cook Time:</i> {{ recipe.cookTime }} minutes</p>

            <div class="border rounded my-3 px-4 py-2">
                <h4 class="my-2">Ingredients</h4>
                <ul>
                    <li
                        v-for="ingredient in recipe.ingredients"
                    >
                        {{ ingredient.name }} × {{ ingredient.quantity }} {{ ingredient.unit }}
                    </li>
                </ul>
            </div>
            <div class="border rounded my-3 px-4 py-2">
                <h4 class="my-2">Instructions</h4>
                {{ recipe.instructions }}
            </div>
        </main>   
    </div>
</template>

<script>
export default {
    name: 'RecipePage',
    data() {
        return {
            fetching: true,
            recipe: null,
        }
    },
    watch: {
        async $route() {
            await this.fetchData();
        }
    },
    async created() {
        await this.fetchData();
    },
    methods: {
        async fetchData() {
            this.fetching = true;

            const options = {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                credentials: 'same-origin'
            };

            try {
                const url = `/api/recipes/${this.$route.params.recipeId}`;
                const r = await fetch(url, options);
                const res = await r.json();

                if (!r.ok) {
                    throw new Error(res.error)
                }

                this.recipe = res; 
                this.fetching = false;

            } catch (e) { 
                this.$store.commit('alert', {
                    message: e, 
                    status: 'danger'
                });
                this.$router.push({ path: '/404' });
            }
        }, 
        async deleteRecipe() {
            const options = {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                credentials: 'same-origin'
            };

            try {
                const url = `/api/recipes/${this.$route.params.recipeId}`;
                const r = await fetch(url, options);
                const res = await r.json();

                if (!r.ok) {
                    throw new Error(res.error)
                }
                
                this.$store.commit('alert', {
                    message: 'Successfully deleted recipe!', 
                    status: 'success'
                });

            } catch (e) { 
                this.$store.commit('alert', {
                    message: e, 
                    status: 'danger'
                });
                this.$router.push({ path: '/404' });
            }

            this.$router.push({ path: '/recipes' });
        }
    }

}
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  height: max-content;
}
</style>