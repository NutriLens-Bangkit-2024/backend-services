const { getUserHandler, editUserByIdHandler, logoutHandler} = require('./Authhandler');
const {getAllNewsHandler, getNewsHandler, getAllRecipesHandler, getRecipeHandler, getCaloriesHandler, postPredictHandler} = require('../user/data/dataHandler');
const routes = [
    {
      method: 'GET',
      path: '/user/{id}',
      handler: getUserHandler,
      options :{
        auth: 'jwt'
      }
    },
    {
      method: 'PATCH',
      path: '/user/{id}',
      handler: editUserByIdHandler,
      options :{
        auth: 'jwt'
      }
    },
    {
      method: 'POST',
      path: '/logout',
      handler: logoutHandler,
      options: {
          auth: 'jwt' 
      }
    },
    {
      method: 'GET',
      path: '/recipes',
      handler: getAllRecipesHandler,
      options: {
        auth: 'jwt' 
      }
    },
    {
      method: 'GET',
      path: '/recipes/{id}',
      handler: getRecipeHandler,
      options: {
        auth: 'jwt' 
      }
    },
    {
      method: 'GET',
      path: '/news',
      handler: getAllNewsHandler,
      options: {
        auth: 'jwt' 
      }
    },
    {
      method: 'GET',
      path: '/news/{id}',
      handler: getNewsHandler,
      options: {
        auth: 'jwt' 
      }
    },
    {
      method: 'POST',
      path: '/saveFood',
      handler: postPredictHandler,
      options:{
        auth: 'jwt'
      }
    },
    {
      path: '/weekly-calories',
      method: 'GET',
      handler: getCaloriesHandler,
      options: {
          auth: 'jwt' 
      }
    },
  ];
   
module.exports = routes;
