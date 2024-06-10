import axios from 'axios'

// 添加
export const addNewPage = (data: any) => axios.post('/api/page-json', data).then(res => res.data)

// 模糊查询
export const getPageList = (data: any) => axios.get('/api/page-json', {
  params: data
}).then(res => res.data)

// 删除页面
export const deletePage = (pageId: string) => axios.delete(`/api/page-json/${pageId}`).then(res => res.data)

// 更新页面
export const updatePage = (pageId: string, data: any) => axios.patch(`/api/page-json/${pageId}`, data).then(res => res.data)

// 获取图片列表
export const getImageList = () => axios.get('/api/upload/images').then(res => res.data)

// 获取实体列表及表数据
export const getDataForTables = () => axios.get('/api/data-base/getDataForTables').then(res => res.data)

// 新增实体
export const addEntity = (data: any) => axios.post('/api/data-base/table', data).then(res => res.data)

// 删除实体
export const deleteEntity = (tableCode: string) => axios.delete(`/api/data-base/${tableCode}`).then(res => res.data)