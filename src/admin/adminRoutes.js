const { addUserHandler, getAllUsersHandler, getUserHandler, editUserByIdHandler, deleteUserHandler} = require('./data/userHandler');
const { addRecipeHandler, getAllRecipesHandler, getRecipeHandler, editRecipeByIdHandler, deleteRecipeHandler } = require('../admin/data/recipeshandler');
const { addNewsHandler, getAllNewsHandler, getNewsHandler, editNewsByIdHandler, deleteNewsHandler} = require('../admin/data/newshandler');

const adminRoutes = [
    {
      method: 'POST',
      path: '/user',
      handler: addUserHandler,
    },
    {
      method: 'GET',
      path: '/user',
      handler: getAllUsersHandler,
    },
    {
      method: 'GET',
      path: '/user/{id}',
      handler: getUserHandler,
    },
    {
      method: 'PUT',
      path: '/user/{id}',
      handler: editUserByIdHandler,
    },
    {
      method: 'DELETE',
      path: '/user/{id}',
      handler: deleteUserHandler,
    },
    {
      method: 'POST',
      path: '/recipes',
      handler: addRecipeHandler,
    },
    {
      method: 'GET',
      path: '/recipes',
      handler: getAllRecipesHandler,
    },
    {
      method: 'GET',
      path: '/recipes/{id}',
      handler: getRecipeHandler,
    },
    {
      method: 'PUT',
      path: '/recipes/{id}',
      handler: editRecipeByIdHandler,
    },
    {
      method: 'DELETE',
      path: '/recipes/{id}',
      handler: deleteRecipeHandler,
    },
    {
      method: 'POST',
      path: '/news',
      handler: addNewsHandler,
    },
    {
      method: 'GET',
      path: '/news',
      handler: getAllNewsHandler,
    },
    {
      method: 'GET',
      path: '/news/{id}',
      handler: getNewsHandler,
    },
    {
      method: 'PUT',
      path: '/news/{id}',
      handler: editNewsByIdHandler,
    },
    {
      method: 'DELETE',
      path: '/news/{id}',
      handler: deleteNewsHandler,
    },
  ];
   
module.exports = adminRoutes;