import "./App.css"

import ApolloClient from "apollo-boost"
import * as React from "react"
import { ApolloProvider } from "react-apollo"
import { BrowserRouter as Router, Link, Route } from "react-router-dom"
import AllRecipes from "./AllRecipes"
import RecipeItem from "./RecipeItem"
import RecipesByIngredient from "./RecipesByIngredient"

const client = new ApolloClient({ uri: "/graphql" })

const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <div className="App">
        <header className="App-header">
          <Link className="App-title" to="/">
            RecipeBox
          </Link>
        </header>
        <div className="App-content">
          <Route exact={true} path="/" component={AllRecipes} />
          <Route path="/recipe/:id" component={RecipeItem} />
          <Route path="/recipes/byIngredient/:ingredient" component={RecipesByIngredient} />
        </div>
      </div>
    </Router>
  </ApolloProvider>
)

export default App
