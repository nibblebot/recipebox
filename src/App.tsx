// @flow
import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { ramda as R } from "ramda";

import "./App.css";
import recipes, { Recipe } from "./recipes";

const App = () => (
  <Router>
    <div className="App">
      <header className="App-header">
        <Link to="/">Recipes</Link>
      </header>
      <Route exact path="/" component={RecipesList} />
      <Route path="/recipe/:id" component={RecipeItem} />
    </div>
  </Router>
);

const RecipeItem = ({
  match
}: {
  match: {
    params: Object
  }
}) => {
  const recipe: Recipe = recipes[match.params.id];
  const thumbnail = recipe.thumbnail || "placeholder.png";
  return (
    <div className="RecipeItem">
      <h2>{recipe.name}</h2>
      <img alt="recipe" src={thumbnail} width={200} height={200} />
      <ul>
        {recipe.ingredients &&
          recipe.ingredients.map((ingredient, id) => (
            <li key={id}>{ingredient}</li>
          ))}
      </ul>
    </div>
  );
};

const RecipesList = (): React$Element<any> => {
  const recipeItems = R.mapObjIndexed((recipe, id) => {
    const thumbnail = recipe.thumbnail || "placeholder.png";
    return (
      <li key={id}>
        <Link to={`/recipe/${id}`}>
          <img alt="recipe" src={thumbnail} width={200} height={200} />
          <div className="recipe-name">{recipe.name}</div>
        </Link>
      </li>
    );
  }, recipes);
  return (
    <section className="RecipesList">
      <ul>{recipeItems}</ul>
    </section>
  );
};

export default App;
