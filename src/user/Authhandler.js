const { nanoid } = require('nanoid');
const db = require('../firebase'); 
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('@hapi/jwt');
const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

const registerHandler = async (request, h) => {
  const { email, password, name, profileurl } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const emailQuerySnapshot = await db.collection('usersCollection')
                                       .where('email', '==', email)
                                       .get();

    if (!emailQuerySnapshot.empty) {
        throw Boom.conflict('Email already exists');
    }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    email,
    password : hashedPassword,
    name,
    id,
    profileurl,
    createdAt : createdAt,
    updatedAt : updatedAt,
  };

  try {
    const userRef = db.collection('usersCollection').doc(id); // Use your actual Firestore collection name
    await userRef.set(newUser);

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId: id,
      },
    });
    response.code(201);
    return response;
  } catch (error) {
    console.error('Error adding user:', error);
    const response = h.response({
      status: 'fail',
      message: 'User gagal ditambahkan. Terjadi kesalahan pada server',
    });
    throw Boom.internal('Error registering user');
    response.code(500);
    return response;
  }
};

const getUserHandler = async (request, h) => {
  const { id } = request.params;

  try {
    const userDoc = await db.collection('usersCollection').doc(id).get();

    if (!userDoc.exists) {
      return {
        status: 'fail',
        message: 'User not found',
      };
    }

    const userData = userDoc.data();

    return {
      status: 'success',
      data: {
        user: userData,
      },
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return {
      status: 'fail',
      message: 'Failed to fetch user',
    };
  }
}; 

const loginHandler = async (request, h) => {
  try {
    const { email, password } = request.payload;
    console.log('Received email:', email); // Add logging

    // Query Firestore to find the user with the provided email
    const userQuerySnapshot = await db.collection('usersCollection')
                                      .where('email', '==', email)
                                      .get();

    // Check if user exists
    if (userQuerySnapshot.empty) {
        throw Boom.unauthorized('Invalid email or password');
    }

    // Get the first document from the result
    const userDoc = userQuerySnapshot.docs[0];
    const userData = userDoc.data();

    // Compare the provided password with the hashed password stored in the database
    const isValidPassword = await bcrypt.compare(password, userData.password);

    // If password is invalid, throw unauthorized error
    if (!isValidPassword) {
        throw Boom.unauthorized('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.token.generate(
        {
            aud: 'urn:audience:test',
            iss: 'urn:issuer:test',
            sub: userData.id, // Use user ID as the subject
        },
        {
            key: JWT_SECRET,
            algorithm: 'HS256'
        }
    );

    // Return success response with token
    return h.response({ status: 'success', id : userData.id, token }).code(200);

  } catch (error) {
    console.error('Error in loginHandler:', error);
    throw Boom.internal('An internal server error occurred');
  }
};
  
const editUserByIdHandler = async (request, h) => {
  const { id } = request.params;
  const { email, password, name, profileurl } = request.payload;
  const updatedAt = new Date().toISOString();

  try {
    const userRef = db.collection('usersCollection').doc(id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return {
        status: 'fail',
        message: 'User not found',
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userRef.update({
      email,
      password : hashedPassword,
      name,
      profileurl,
      updatedAt : updatedAt,
    });

    return {
      status: 'success',
      message: 'User successfully updated',
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      status: 'fail',
      message: 'Failed to update user',
    };
  }
};

const logoutHandler = async (request, h) => {
  return h.response({ status: 'success', message: 'User logged out successfully' }).code(200);
};

module.exports = { registerHandler, getUserHandler, loginHandler, editUserByIdHandler, logoutHandler };
