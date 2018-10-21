import "./App.css"

import ApolloClient from "apollo-boost"
import gql from "graphql-tag"
// import * as R from "ramda";
import * as React from "react"
import { ApolloProvider, Query } from "react-apollo"
import { BrowserRouter as Router, Link, Route } from "react-router-dom"

const client = new ApolloClient({ uri: "http://localhost:4000/graphql" })

const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to="/">Recipes</Link>
        </header>
        <Route exact={true} path="/" component={RecipeList} />
        <Route path="/recipe/:id" component={RecipeItem} />
      </div>
    </Router>
  </ApolloProvider>
)

interface RecipeItemProps {
  match: {
    params: {
      id: string
    }
  }
}

const RecipeItem = (props: RecipeItemProps) => (
  <Query
    query={gql`
      query Recipe($id: ID!) {
        recipe(id: $id) {
          id
          name
          image
          ingredients
        }
      }
    `}
    variables={{ id: props.match.params.id }}
  >
    {({ loading, error, data }) => {
      if (loading) {
        return <p>Loading...</p>
      }
      if (error) {
        return <p>Error :(</p>
      }
      const recipe = data.recipe
      const image = recipe.image || "placeholder.png"
      return (
        <div className="RecipeItem">
          <h2>{recipe.name}</h2>
          <img alt="recipe" src={image} width={200} height={200} />
          <ul>
            {recipe.ingredients &&
              recipe.ingredients.map((ingredient: string, id: number) => (
                <li key={id}>{ingredient}</li>
              ))}
          </ul>
        </div>
      )
    }}
  </Query>
)

const RecipeList = () => (
  <Query
    query={gql`
      {
        recipes {
          id
          name
          image
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) {
        return <p>Loading...</p>
      }
      if (error) {
        return <p>Error :(</p>
      }
      const recipeItems = data.recipes.map((recipe: any, idx: number) => {
        const image = recipe.image || "placeholder.png"
        return (
          <li key={idx}>
            <Link to={`/recipe/${recipe.id}`}>
              <img alt="recipe" src={image} width={200} height={200} />
              <div className="recipe-name">{recipe.name}</div>
            </Link>
          </li>
        )
      })

      return (
        <section className="RecipesList">
          <ul>{recipeItems}</ul>
        </section>
      )
    }}
  </Query>
)

export default App
