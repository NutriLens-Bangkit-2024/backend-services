const { nanoid } = require('nanoid');
const path = require('path');
const db = path.join(__dirname, '../../firebase.js');

const addNewsHandler = async (request, h) => {
  const { title, content, source } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNews = {
    id,
    title,
    content,
    source,
    createdAt,
    updatedAt,
  };

  try {
    const newsRef = db.collection('newsCollection').doc(id);
    await newsRef.set(newNews);

    const response = h.response({
      status: 'success',
      message: 'Berita berhasil ditambahkan',
      data: {
        newsId: id,
      },
    });
    response.code(201);
    return response;
  } catch (error) {
    console.error('Error adding news:', error);
    const response = h.response({
      status: 'fail',
      message: 'Berita gagal ditambahkan. Terjadi kesalahan pada server',
    });
    response.code(500);
    return response;
  }
};

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
  
const editNewsByIdHandler = async (request, h) => {
  const { id } = request.params;
  const { title, content, source } = request.payload;
  const updatedAt = new Date().toISOString();

  try {
    const newsRef = db.collection('newsCollection').doc(id);
    const newsDoc = await newsRef.get();

    if (!newsDoc.exists) {
      return {
        status: 'fail',
        message: 'News not found',
      };
    }

    await newsRef.update({
      title, 
      content, 
      source,
      updatedAt,
    });

    return {
      status: 'success',
      message: 'News successfully updated',
    };
  } catch (error) {
    console.error('Error updating news:', error);
    return {
      status: 'fail',
      message: 'Failed to update news',
    };
  }
};

const deleteNewsHandler = async (request, h) => {
  const { id } = request.params;

  try {
    const newsRef = db.collection('newsCollection').doc(id);
    const newsDoc = await newsRef.get();

    if (!newsDoc.exists) {
      return {
        status: 'fail',
        message: 'news not found',
      };
    }

    await newsRef.delete();

    return {
      status: 'success',
      message: 'news successfully deleted',
    };
  } catch (error) {
    console.error('Error deleting news:', error);
    return {
      status: 'fail',
      message: 'Failed to delete news',
    };
  }
};

module.exports = { addNewsHandler, getAllNewsHandler, getNewsHandler, editNewsByIdHandler, deleteNewsHandler};