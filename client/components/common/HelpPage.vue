<template>
    <main>
      <section>
        <header>
          <h1>About GoodFood</h1>
        </header>
        <article>
          <br/>
          <p>Each year, 108 billion pounds of food are wasted in the United States, much of which is attributable to wasted groceries. Enter GoodFood, an app that encourages people to use their groceries before they expire.</p>
          <p>We provide users with a convenient, expedited way to keep track of all their groceries. On the Pantry page, you can add items to your pantry:</p>
          <img src="@/public/addPantryItem.png" style="max-width: 80%"/>
          <p>When adding items to the pantry, you only need to specify the item name, quantity and unit. If you choose to add an expiration date, you will be allowed to decide when to be reminded about the item. The default date is three days before the expiration date. Else, if no expiration date is provided, we will remind you about the item a month later. The reminders will appear on the Home page once logged in along with a badge indicating how many reminders you have. You will have the option to dismiss the reminder or view recipes that can help you use up the item:</p>
          <img src="@/public/reminders.png" style="max-width: 80%"/>
          <p>After adding the items, you will see them listed in the Pantry page, where you can edit or delete the items as they are being used: </p>
          <img src="@/public/pantryPage.png" style="max-width: 80%"/>
          <p>Once the items are deleted from the pantry, they will appear on the Deleted Items page:</p>
          <img src="@/public/deletedItems.png" style="max-width: 80%"/>
          <p>This page provides an easy way to add items back into the pantry:</p>
          <img src="@/public/addToPantry.png" style="max-width: 80%"/>
          <p>Both items in the pantry and in the deleted items page also has an option to add to baskets:</p>
          <img src="@/public/addToBaskets.png" style="max-width: 80%"/>
          <p>Baskets are a way of keeping track of different sets of items you want to buy. On the baskets page, you can see the list of baskets as well as the items in each:</p>
          <img src="@/public/basketsPage.png" style="max-width: 80%"/>
          <p>When creating baskets, you first need to name it and optionally, populate it with items, one at a time:</p>
          <img src="@/public/createBasket.png" style="max-width: 80%"/>
          <p>Once on an individual baskets page, you can modify/delete the basket. When you've bought items in a basket, you can also express add it to the pantry:</p>
          <img src="@/public/basketPage.png" style="max-width: 80%"/>
          <p>Next up, we have recipes, a place for you to explore recipes:</p>
          <img src="@/public/recipesPage.png" style="max-width: 80%"/>
          <p>You can upload your own recipes:</p>
          <img src="@/public/addRecipe.png" style="max-width: 80%"/>
          <p>Or filter through already uploaded recipes for ones that contain both the inputted keyword and ingredients: </p>
          <img src="@/public/filterRecipe.png" style="max-width: 80%"/>
          <p></p>
        </article>
      </section>
    </main>
  </template>
  
  <script>
  
  export default {
    name: 'AboutPage',
  };
  </script>