import fetchModel from "../lib/fetchModelData";

const models = {
  schemaInfo: () => fetchModel("/test/info"),
  userListModel: () => fetchModel("/user/list"),
  userModel: (userId) => fetchModel(`/user/${userId}`),
  photoOfUserModel: (userId) => fetchModel(`/photosOfUser/${userId}`),

  login: async (loginName, password) => {
    return await fetchModel('/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ login_name: loginName, password }),
    });
  },

  logout: async () => {
    return await fetchModel('/admin/logout', {
      method: 'POST',
      credentials: 'include'
    });
  },

  addCommentToPhoto: async (photoId, comment, userId) => {
    return await fetchModel(`/photosOfUser/commentsOfPhoto/${photoId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ comment, user_id: userId }),
    });
  },
  commentsOfUser: (userId) => fetchModel(`/user/comment/${userId}`),

  register: async (userData) => {
    return await fetchModel('/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData),
    });
  },

  uploadPhoto: async (file, userId) => {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('user_id', userId);

    return await fetchModel('/photosOfUser/new', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
  },

  deletePhoto: async (photoId) => {
    return await fetchModel(`/photosOfUser/${photoId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
  },
};

export default models;
