# Práctica 2 

Recipe Book

![GitHub](https://img.shields.io/github/license/lfresnog/RecipeBook.js)
![GitHub Release Date](https://img.shields.io/github/release-date/lfresnog/RecipeBook.js)
![GitHub last commit](https://img.shields.io/github/last-commit/lfresnog/RecipeBook.js)

## Install/Run

All the necessary packages are in the `package.json` file.

To install them, run this command:

```js
npm install
```

To run the programme in the server 3003

```js
npm start
```
## Query

- Print all recipes

```js
query{
  recipes{
    title
  }
```

- Print all authors

```js
query{
  authors{
    name
  }
```
- Print all ingredients

```js
query{
  ingredients{
    name
  }
```

- Print all recipes of an author

```js
query{
  authorRecipes(name:"Luis"){
    title
  }
}
```

- Print all recipes of a ingredient

```js
query{
  ingredientRecipes(name:"Tomate"){
    title
  }
}
```

## Mutations

- Add a recipe

```js
mutation{
  addRecipe(title:"ensalada2",description:"hi",mail:"lfresnog@gmail.com",ingredients:["1","2"]){
    title
  }
}
```

- Add a author

```js
mutation{
  addAuthor(name:"Hector",mail:"h@gmail.com"){
    name
  }
}
```

- Add a ingredient

```js
mutation{
  addIngredient(name:"Aceite"){
    name
  }
}
```

- Delete a recipe

```js
mutation{
  deleteRecipe(name:"ensalada2")
}
```

- Delete an author

```js
mutation{
  deleteAuthor(name:"Luis")
}
```

- Delete a ingredient

```js
mutation{
  deleteIngredient(name:"Tomate")
}
```

## ⚖️ License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/JaimeDordio/rickymorty/blob/master/LICENSE) file for details

**[⬆ back to top](#features)**