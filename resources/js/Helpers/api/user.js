export const fetchUserApiKeys = async () => {
  return await axios.get(route("admin.profile.api_keys"));
};

export const createUserApiKey = async (data) => {
  return await axios.post(route("admin.profile.api_keys.create"), data);
};

export const deleteUserApiKey = async (id) => {
  return await axios.delete(route("admin.profile.api_keys.delete", id));
};

export const fetchUserListing = async (params = null) => {
  return await axios.post(route("user.listing", params));
};

export const createUser = async (data) => {
  return await axios.post(route("user.store"), data);
};

export const getUserData = async (id) => {
  return await axios.get(route("user.edit", id));
};

export const updateUser = async (id, data) => {
  return await axios.put(route("user.update", id), data);
};

export const updateUserProfile = async (id, data) => {
  return await axios.post(route("profile.update", id), data);
};

export const updateUserPassword = async (id, data) => {
  return await axios.put(route("user.updatePassword", id), data);
};

export const deleteUser = async (id) => {
  return await axios.delete(route("user.delete", id));
};

export const updatePassword = async (id) => {
  return await axios.put(route("password.update", id));
};

export const attachOrganizationUser = async (id, data) => {
  return await axios.post(route("user.attachOrganization", id), data);
};

export const detachOrganizationUser = async (id, data) => {
  return await axios.post(route("user.detachOrganization", id), data);
};

export const attachTeamUser = async (id, data) => {
  return await axios.post(route("user.attachTeam", id), data);
};

export const detachTeamUser = async (id, data) => {
  return await axios.post(route("user.detachTeam", id), data);
};
