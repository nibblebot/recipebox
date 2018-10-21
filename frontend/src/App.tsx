import "./App.css";

import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
// import * as R from "ramda";
import * as React from "react";
import { ApolloProvider, Query } from "react-apollo";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

const client = new ApolloClient({ uri: "http://localhost:4000/graphql" });
const Empty = () => <div />;

const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to="/">Recipes</Link>
        </header>
        <Route exact={true} path="/" component={RecipeList} />
        <Route path="/recipe/:id" component={Empty} />
      </div>
    </Router>
  </ApolloProvider>
);

// interface RecipeItemProps {
//   match: {
//     params: {
//       id: string;
//     };
//   };
// }

// const RecipeItem = (props: RecipeItemProps) => {
//   const recipe: Recipe = recipes[props.match.params.id];
//   const thumbnail = recipe.thumbnail || "placeholder.png";
//   return (
//     <div className="RecipeItem">
//       <h2>{recipe.name}</h2>
//       <img alt="recipe" src={thumbnail} width={200} height={200} />
//       <ul>
//         {recipe.ingredients &&
//           recipe.ingredients.map((ingredient, id) => (
//             <li key={id}>{ingredient}</li>
//           ))}
//       </ul>
//     </div>
//   );
// };

const RecipeList = () => (
  <Query
    query={gql`
      {
        recipes {
          name
          image
          ingredients
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) {
        return <p>Loading...</p>;
      }
      if (error) {
        return <p>Error :(</p>;
      }
      const recipeItems = data.recipes.map((recipe: any, idx: number) => {
        const image = recipe.image || "placeholder.png";
        return (
          <li key={idx}>
            <Link to={`/recipe/${idx}`}>
              <img alt="recipe" src={image} width={200} height={200} />
              <div className="recipe-name">{recipe.name}</div>
            </Link>
          </li>
        );
      });

      return (
        <section className="RecipesList">
          <ul>{recipeItems}</ul>
        </section>
      );
    }}
  </Query>
);

export default App;
