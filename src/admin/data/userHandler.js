const { nanoid } = require('nanoid');
const db = require('../../firebase'); 
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('@hapi/jwt');
const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

const addUserHandler = async (request, h) => {
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
    password,
    name,
    id,
    profileurl,
    createdAt,
    updatedAt,
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

const getAllUsersHandler = async () => {
  try {
    const usersSnapshot = await db.collection('usersCollection').get();
    const users = [];

    usersSnapshot.forEach(doc => {
      users.push(doc.data());
    });

    return {
      status: 'success',
      data: {
        users,
      },
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      status: 'fail',
      message: 'Failed to fetch users',
    };
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

    await userRef.update({
      email,
      password,
      name,
      profileurl,
      updatedAt,
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

const deleteUserHandler = async (request, h) => {
  const { id } = request.params;

  try {
    const userRef = db.collection('usersCollection').doc(id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return {
        status: 'fail',
        message: 'User not found',
      };
    }

    await userRef.delete();

    return {
      status: 'success',
      message: 'User successfully deleted',
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      status: 'fail',
      message: 'Failed to delete user',
    };
  }
};

module.exports = { addUserHandler, getAllUsersHandler, getUserHandler, editUserByIdHandler, deleteUserHandler };