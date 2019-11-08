import {GraphQLServer} from 'graphql-yoga';
import * as uuid from 'uuid';

const recipeData = [{
    id:"1",
    title: "Ensalada",
    description: "Ensalada tradicional",
    date: "02/04/2014",
    author: "1",
    ingredients:["1","2"]
}];
const authorData = [{
    id:"1",
    name:"Luis",
    mail:"lfresnog@gmail.com"
}];
const ingredientData = [
    {id:"1",name:"Tomate"},
    {id:"2",name:"Lechuga"}
];

const typeDefs = `
type Recipe{
    id: ID!
    title: String!
    description: String!
    date: String!
    author: Author!
    ingredients:[Ingredient!]!
}
type Author{
    id: ID!
    name: String!
    mail: String!
    recipes: [Recipe!]
}
type Ingredient{
    id: ID!
    name: String!
    recipes: [Recipe!]
}
type Query{
    recipes:[Recipe!]!
    authors:[Author!]!
    ingredients:[Ingredient!]!
    authorRecipes(name:String!):[Recipe!]
    ingredientRecipes(name:String!):[Recipe!]
}
type Mutation{
    addRecipe(title:String!,description:String!,mail:String!,ingredients:[String!]!):Recipe!
    addAuthor(name:String!,mail:String!):Author!
    addIngredient(name:String!):Ingredient!
    deleteRecipe(name:String!) : String!
    deleteAuthor(name:String!): String!
    deleteIngredient(name: String!): String!
    updateAuthor(name:String!,n_name:String,n_mail:String):String!
    updateIngredient(name:String!,n_name:String!):String!
}
`
const resolvers = {
    Recipe:{
        author:(parent, args, ctx, info)=>{
            const authorID = parent.author;
            return authorData.find(elem => elem.id == authorID);
        },
        ingredients: (parent, args, ctx, info)=>{
            const ingredientsID = parent.ingredients;
            return ingredientData.filter(elem => ingredientsID.includes(elem.id));
        }
    },
    Author:{
        recipes: (parent, args, ctx, info)=>{
        const authorID = parent.id;
        return recipeData.filter(elem => elem.author == authorID);
        },
    },
    Ingredient:{
        recipes: (parent, args, ctx, info)=>{
            const ingredientID = parent.id;
            return recipeData.filter(elem => elem.ingredients.includes(ingredientID));
          },
    },
    Query:{
        recipes: () => {return recipeData;},
        authors: () => {return authorData;},
        ingredients: () => {return ingredientData;},
        authorRecipes(parent, args, ctx, info){
            const f_author = authorData.find(elem => elem.name == args.name);
            return recipeData.filter(elem => elem.author == f_author.id);
        },
        ingredientRecipes(parent, args, ctx, info){
            const f_ingredient = ingredientData.find(elem => elem.name == args.name);
            return recipeData.filter(elem => elem.ingredients.includes(parent.id))
        }
    },
    Mutation:{
        addRecipe(parent, args, ctx, info){
            const{title,description,mail,ingredients} = args;
            if(recipeData.some(elem => elem.title === title)){
                throw new Error (`Recipe: ${title} already in use`);
            }
            if(!authorData.some(elem => elem.mail === mail)){
                throw new Error (`Mail: ${mail} doesnt exist`);
            }
            const author = authorData.find(elem => elem.mail == mail);
            const n_recipe = {
                id: uuid.v1(),
                title,
                description,
                date: new Date().getDate(),
                author: author.id,
                ingredients
            }
            recipeData.push(n_recipe);
            return n_recipe;
        },
        addAuthor(parent,args,ctx,info){
            const {name,mail} = args; 
            if(authorData.some(elem => elem.name === name)){
                throw new Error (`User name ${name} already in use`);
            }
            const n_author = {id:uuid.v4(),name,mail};
            authorData.push(n_author);
            return n_author;
        },
        addIngredient(parent,args,ctx,info){
            const{name} = args;
            if(ingredientData.some(elem => elem.name === name)){
                throw new Error(`Name ${name} alredy exist`);
            }
            const n_ingredient = {id: uuid.v4(),name};
            ingredientData.push(n_ingredient);
            return n_ingredient;
        },
        deleteRecipe(parent,args,ctx,info){
            if(!recipeData.some(elem => elem.title === args.name)){
                throw new Error (`The recipe ${args.name} doenst exist`);
            }
            const index_recipe = recipeData.findIndex(elem => elem.title === args.name);
            recipeData.splice(index_recipe,1);
            return "Deleted";
        },
        deleteAuthor(parent,args,ctx,info){
            if(!authorData.some(elem => elem.name === args.name)){
                throw new Error (`The author ${args.name} doenst exist`);
            }
            recipeData.forEach((elem,i)=>{
                if(elem.author === args.name){
                    recipeData.splice(i,1);
                }
            })
            const index_author = authorData.findIndex(elem => elem.name === args.name);
            authorData.splice(index_author,1);
            return "Deleted";
        },
        deleteIngredient(parent,args,ctx,info){
            if(!ingredientData.some(elem => elem.name === args.name)){
                throw new Error (`The ingredient ${args.name} doenst exist`);
            }
            recipeData.forEach((elem,i)=>{
                if(elem.ingredients.includes(args.name)){
                    recipeData.splice(i,1);
                }
            })
            const index_ingredient = ingredientData.findIndex(elem => elem.name === args.name);
            ingredientData.splice(index_ingredient,1);
            return "Deleted";
        },
        updateAuthor(parent,args,ctx,info){
            const f_author = authorData.find(elem => elem.name === args.name);
            f_author.name = args.n_name || f_author.name;
            f_author.email = args.n_mail || f_author.mail;
            return "Updated";
        },
        updateIngredient(parent,args,ctx,info){
            const f_ingredient = ingredientData.find(elem => elem.name === args.name);
            f_ingredient.name = args.n_name;
            return "Updated";
        }
    }
}
const server = new GraphQLServer({typeDefs, resolvers})
server.start({port: "3003"})
console.log("\nServer started\n");