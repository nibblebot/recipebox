# RecipeBox

A simple recipe web application built with React, Apollo, Mongo and Typescript.

Both frontend and backend are written in Typescript with TSLint and Prettier.

----
## Backend
`ts-node` with apollo-express middleware and mongoose ORM

[Scraping scripts](/backend/scripts/) grab recipes/images from Yummly with Puppeteer.

**Installing**

```
$ cd backend
$ npm install
```

**Features**

`async`/`await` everywhere (file system, network, mongo, puppeteer)

**Running Apollo Server**

(in `backend` directory)
```
$ npm run start
```

---
## Frontend
Forked from create-react-app

**Installing**

```
$ cd frontend
$ npm install
```

**Running Dev Server**

(in `frontend` directory)
```
$ npm run start
```

**Features**

- React Router
- Apollo Client state management
- Hot reloading

---
## Screenshots

* Show all Recipes
  ![Show All Recipes](/screenshots/AllRecipes.jpg)
* Recipe View
  ![Recipe View](/screenshots/Recipe.jpg)
* Recipes by Ingredient
  ![Recipes by Ingredient](/screenshots/RecipesByIngredient.jpg)
