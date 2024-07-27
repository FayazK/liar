export const fetchRoleListing = async () => {
  return await axios.post(route('role.listing'))
}

export const createRole = async (data) => {
  return await axios.post(route('role.store'), data)
}

export const permissionPage = async () => {
  return await axios.get(route('role.permissions'))
}

export const getPermissions = async () => {
  return await axios.get(route('role.getPermissions'))
}

export const getRoleData = async (id) => {
  return await axios.get(route('role.edit', id))
}

export const updateRole = async (id, data) => {
  return await axios.put(route('role.update', id), data)
}

export const storePermissions = async (data) => {
  return await axios.post(route('role.storePermissions'), data)
}

export const deleteRole = async (id) => {
  return await axios.delete(route('role.delete', id))
}
