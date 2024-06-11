const { nanoid } = require('nanoid');
const path = require('path');
const db = path.join(__dirname, '../../firebase.js');

const addRecipeHandler = async (request, h) => {
  const { name, calories, ingredient, directions } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newRecipe = {
    id,
    name,
    calories,
    ingredient,
    directions,
    createdAt,
    updatedAt,
  };

  try {
    const recipeRef = db.collection('recipesCollection').doc(id);
    await recipeRef.set(newRecipe);

    const response = h.response({
      status: 'success',
      message: 'Resep berhasil ditambahkan',
      data: {
        recipeId: id,
      },
    });
    response.code(201);
    return response;
  } catch (error) {
    console.error('Error adding recipe:', error);
    const response = h.response({
      status: 'fail',
      message: 'Resep gagal ditambahkan. Terjadi kesalahan pada server',
    });
    response.code(500);
    return response;
  }
};

const getAllRecipesHandler = async () => {
  try {
    const recipesSnapshot = await db.collection('recipesCollection').get();
    const recipes = [];

    recipesSnapshot.forEach(doc => {
      recipes.push(doc.data());
    });

    return {
      status: 'success',
      data: {
        recipes,
      },
    };
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return {
      status: 'fail',
      message: 'Failed to fetch recipes',
    };
  }
};

const getRecipeHandler = async (request, h) => {
  const { id } = request.params;

  try {
    const recipeDoc = await db.collection('recipesCollection').doc(id).get();

    if (!recipeDoc.exists) {
      return {
        status: 'fail',
        message: 'Recipe not found',
      };
    }

    const recipeData = recipeDoc.data();

    return {
      status: 'success',
      data: {
        recipe: recipeData,
      },
    };
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return {
      status: 'fail',
      message: 'Failed to fetch recipe',
    };
  }
}; 
  
const editRecipeByIdHandler = async (request, h) => {
  const { id } = request.params;
  const { name, calories, ingredient, directions } = request.payload;
  const updatedAt = new Date().toISOString();

  try {
    const recipeRef = db.collection('recipesCollection').doc(id);
    const recipeDoc = await recipeRef.get();

    if (!recipeDoc.exists) {
      return {
        status: 'fail',
        message: 'Recipe not found',
      };
    }

    await recipeRef.update({
      name, 
      calories, 
      ingredient, 
      directions,
      updatedAt,
    });

    return {
      status: 'success',
      message: 'Recipe successfully updated',
    };
  } catch (error) {
    console.error('Error updating recipe:', error);
    return {
      status: 'fail',
      message: 'Failed to update recipe',
    };
  }
};

const deleteRecipeHandler = async (request, h) => {
  const { id } = request.params;

  try {
    const recipeRef = db.collection('recipesCollection').doc(id);
    const recipeDoc = await recipeRef.get();

    if (!recipeDoc.exists) {
      return {
        status: 'fail',
        message: 'recipe not found',
      };
    }

    await recipeRef.delete();

    return {
      status: 'success',
      message: 'Recipe successfully deleted',
    };
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return {
      status: 'fail',
      message: 'Failed to delete recipe',
    };
  }
};

module.exports = { addRecipeHandler, getAllRecipesHandler, getRecipeHandler, editRecipeByIdHandler, deleteRecipeHandler };