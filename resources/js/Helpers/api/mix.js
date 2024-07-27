export const fetchOptions = (type, search, params = {}) => {
  return axios.post(route('admin.dropdown', { type }), { q: search, ...params })
}
