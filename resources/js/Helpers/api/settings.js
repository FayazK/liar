export const updateTemplateState = async (template, data) => {
  return await axios.post(route('settings.updateTemplateState', template), data)
}

export const updateAppSettings = async data => {
  return await axios.post(route('settings.update'), data)
}

export const updateTaxonomySettings = async data => {
  return await axios.post(route('settings.taxonomy'), data)
}
// Delete a specific setting tag
export const deleteSetting = async data => {
  return await axios.delete(route('settings.delete'), data)
}

export const getStagesList = async (currentPage = 1) => {
  return await axios.post(
    route('settings.getStages', {
      _query: {
        page: currentPage,
      },
    })
  )
}
export const updateStageOrder = async (sourceId, destinationId) => {
  console.log(sourceId, destinationId)
}
