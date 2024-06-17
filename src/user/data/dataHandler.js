const path = require('path');
const db = require('../../firebase');
const crypto = require('crypto');


const getAllNewsHandler = async () => {
    try {
      const newsSnapshot = await db.collection('newsCollection').get();
      const news = [];
  
      newsSnapshot.forEach(doc => {
        news.push(doc.data());
      });
  
      return {
        status: 'success',
        data: {
          news,
        },
      };
    } catch (error) {
      console.error('Error fetching news:', error);
      return {
        status: 'fail',
        message: 'Failed to fetch news',
      };
    }
};

const getNewsHandler = async (request, h) => {
  const { id } = request.params;

  try {
    const newsDoc = await db.collection('newsCollection').doc(id).get();

    if (!newsDoc.exists) {
      return {
        status: 'fail',
        message: 'News not found',
      };
    }

    const newsData = newsDoc.data();

    return {
      status: 'success',
      data: {
        news: newsData,
      },
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    return {
      status: 'fail',
      message: 'Failed to fetch news',
    };
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

const postPredictHandler = async (request, h) => {
  // Extract the userId from the correct key in the credentials
  const { user: userId } = request.auth.credentials;

  if (!userId) {
      const response = h.response({
          status: 'fail',
          message: 'User ID is missing from authentication credentials'
      });
      response.code(400);
      return response;
  }

  const { label, calories } = request.payload;
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
      id: id,
      label: label,
      calories: calories,
      createdAt: createdAt
  };

  try {
      const parentCollection = db.collection('usersCollection'); // Parent collection name
      const subCollection = parentCollection.doc(userId).collection('foodCollection'); // Use userId as the document ID

      console.log('Attempting to write data to Firestore:', data);

      await subCollection.doc(id).set(data); // Store the data in the sub-collection
      
      const response = h.response({
          status: 'success',
          message: 'Model is predicted successfully',
          data
      });

      response.code(201);
      return response;
  } catch (error) {
      console.error('Error writing to Firestore:', error);
      const response = h.response({
          status: 'fail',
          message: 'Error writing to Firestore',
          error: error.message
      });

      response.code(500);
      return response;
  }
};

async function getCaloriesHandler(request, h) {
  // Extract the userId from the correct key in the credentials
  const { user: userId } = request.auth.credentials;

  if (!userId) {
      return h.response({
          status: 'fail',
          message: 'User ID is missing from authentication credentials'
      }).code(400);
  }

  try {
      // Reference to the user's food collection
      const userRef = db.collection('usersCollection').doc(userId);
      const foodCollectionRef = userRef.collection('foodCollection');

      // Fetch all documents in the food collection
      const foodSnapshot = await foodCollectionRef.get();

      // Initialize objects to store daily and weekly calories
      const dailyCalories = {};
      const weeklyCalories = {};
      let totalCalories = 0;

      // Iterate over each document in the food collection
      foodSnapshot.forEach(doc => {
          const data = doc.data();
          const date = new Date(data.createdAt);
          const dayKey = date.toDateString(); // Use date string as the key for daily calories
          const week = getWeekNumber(date); // Get the week number from the date for weekly calories

          const calories = data.calories || 0;

          // Add calories to the total sum
          totalCalories += calories;

          // Add calories to daily total
          if (!dailyCalories[dayKey]) {
              dailyCalories[dayKey] = 0;
          }
          dailyCalories[dayKey] += calories;

          // Add calories to weekly total
          if (!weeklyCalories[week]) {
              weeklyCalories[week] = 0;
          }
          weeklyCalories[week] += calories;
      });

      const sortedDailyCalories = Object.keys(dailyCalories)
        .sort((a, b) => new Date(b) - new Date(a))
        .reduce((obj, key) => {
            obj[key] = dailyCalories[key];
            return obj;
        }, {});

      return h.response({
          status: 'success',
          message: 'Calories retrieved successfully',
          data: { sortedDailyCalories, weeklyCalories, totalCalories }
      }).code(200);
  } catch (error) {
      console.error('Error retrieving calories:', error);
      return h.response({
          status: 'fail',
          message: 'Error retrieving calories',
          error: error.message
      }).code(500);
  }
}

// Helper function to get the week number from a date
function getWeekNumber(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - startOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}

module.exports = {getAllNewsHandler, getNewsHandler, getAllRecipesHandler, getRecipeHandler, getCaloriesHandler, postPredictHandler};
