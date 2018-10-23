const testData = `
8 to 10 ounces dried Chinese-style wheat noodles
2 kaffir lime leaves (sliced very thinly, or cut into thin strips with scissors (remove stem))
2 shallots (thinly sliced and diced)
4 cloves garlic (minced)
1 piece galangal (or ginger, sliced thinly)
1 red chilli, sliced finely (and de-seeded if milder noodles are desired)
1/2 package firm tofu (if non-vegetarian, you can substitute shrimp or bite-size pieces of chicken)
3 tomatoes (cut into bite-size pieces)
1 head broccoli (cut into florets, OR 1 cup bok choy or other Chinese-type cabbage)
1 to 2 cups bean sprouts
1/2 cup fresh coriander leaves
1/2 cup fresh basil (roughly chopped if leaves are large)
vegetable oil for stir-frying
1 1/2 tablespoons ground bean sauce (also called "yellow bean" - actually a soy bean sauce found in Asian food stores)
1 tablespoon rice vinegar (or substitute white vinegar)
1 tablespoon fish sauce OR 1 1/2 tablespoons soy sauce
1 1/2 tablespoons lime juice
1 tablespoon brown sugar 
`

const splitIngredients = (raw: string) => raw.trim().split("\n")
const possibleUnits = ["ounces", "cloves", "piece", "package", "head", "cups", "cup", "tablespoon", "tablespoons"]

const parseAmount = (tokens: string[]) => {
  const amount: string[] = []
  let t = tokens.shift()
  if (t == null) {
    return amount
  }
  // ex: 7
  if (typeof t.charAt(0) === "number") {
    amount.push(t)
    t = tokens.shift()
    // ex: 1 1/2
    if (t != null && typeof t.charAt(0) === "number") {
      amount.push(t)
    }
    // ex: 1 to 2
    else if (t != null && t === "to" && tokens[0] != null && typeof tokens[0].charAt(0) === "number") {
      amount.push(t)
      amount.push(tokens[0])
      tokens.shift()
    }
  }
  return amount
}

const parseUnits = (tokens: string[]) => {
  const units: string[] = []
  if (tokens.length <= 1) {
    return units
  }
  const t = tokens.shift()
  possibleUnits.some(unit => t === unit)
  return units
}

const parseIngredients = (data: string) => {
  const ingredients = splitIngredients(data)
  const ingredientMaps = ingredients.map(ingredient => {
    let tokens: string[] = ingredient.split(" ")
    if (!tokens.length) {
      return
    }
    tokens = parseAmount(tokens)
    tokens = parseUnits(tokens)
    // if (t) {
    //   amount.push(t)
    // }
    // if (amount[0].) {
    console.log(tokens)
    // }
    // /(\d+\s)?\d+\/?/
  })
}
