import "./App.css";

import * as R from "ramda";
import * as React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

const App = () => (
  <Router>
    <div className="App">
      <header className="App-header">
        <Link to="/">Recipes</Link>
      </header>
      <Route exact={true} path="/" component={RecipesList} />
      <Route path="/recipe/:id" component={RecipeItem} />
    </div>
  </Router>
);

interface RecipeItemProps {
  match: {
    params: {
      id: string;
    };
  };
}

const RecipeItem = (props: RecipeItemProps) => {
  const recipe: Recipe = recipes[props.match.params.id];
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

const RecipesList = () => {
  const indexedMap = R.addIndex<Recipe>(R.map);
  const recipeItems = indexedMap((recipe, idx) => {
    const thumbnail = recipe.thumbnail || "placeholder.png";
    return (
      <li key={idx}>
        <Link to={`/recipe/${idx}`}>
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
