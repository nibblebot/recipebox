//@flow
export interface Recipe {
  name: string;
  thumbnail?: string;
  ingredients?: string[];
}

const recipes: { [key: string]: Recipe } = {
  "0": {
    name: "Vegan Cheese"
  },
  "1": {
    name: "Tofu Green Curry"
  },
  "2": {
    name: "Oat Waffles"
  },
  "3": {
    ingredients: [
      "8 to 10 ounces dried Chinese-style wheat noodles",
      "2 kaffir lime leaves (sliced very thinly, or cut into thin strips with scissors (remove stem))",
      "2 shallots (thinly sliced and diced)",
      "4 cloves garlic (minced)",
      "1 piece galangal (or ginger, sliced thinly)",
      "1 red chilli, sliced finely (and de-seeded if milder noodles are desired)",
      "1/2 package firm tofu (if non-vegetarian, you can substitute shrimp or bite-size pieces of chicken)",
      "3 tomatoes (cut into bite-size pieces)",
      "1 head broccoli (cut into florets, OR 1 cup bok choy or other Chinese-type cabbage)",
      "1 to 2 cups bean sprouts",
      "1/2 cup fresh coriander leaves",
      "1/2 cup fresh basil (roughly chopped if leaves are large)",
      "vegetable oil for stir-frying ",
      '1 1/2 tablespoons ground bean sauce (also called "yellow bean" - actually a soy bean sauce found in Asian food stores)',
      "1 tablespoon rice vinegar (or substitute white vinegar)",
      "1 tablespoon fish sauce OR 1 1/2 tablespoons soy sauce",
      "1 1/2 tablespoons lime juice",
      "1 tablespoon brown sugar "
    ],
    name: "Tofu Drunken Noodles",
    thumbnail: "/tofu-drunken-noodles.jpg",
  },
  "4": {
    name: "Korean Braised Tofu"
  },
  "5": {
    name: "Almond Cookies"
  },
  "6": {
    name: "Soy Protein Pankcakes"
  }
};
export default recipes;
