import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Button, Input, message, Modal, Divider, Select, Form, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { addNewPage, getPageList, deletePage, updatePage } from '../../server'
import './index.css'
import { useNavigate } from 'react-router-dom';

const { Search } = Input

interface pageJsonProps {
  id: number,
  pageId: string,
  pageName: string,
  pagJson: {
    [key: string]: any
  }
}

export default function Page() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)  // 新增页面弹窗
  const [pageName, setPageName] = useState<string>('') // 新增页面名称
  const [editPageName, setEditPageName] = useState<string>('') // 编辑页面名称
  const [editModalOpenId, setEditModalOpenId] = useState<string | null>(null)  // 编辑页面名称弹窗
  const [pageList, setPageList] = useState<pageJsonProps[]>([])
  const [form] = Form.useForm() // 新增页面的弹窗表单

  // 公共方法，初始化所有数据
  const initDataSource = async (value: any) => {
    const res = await getPageList(value)
    if (res?.code === 200) {
      setPageList(res.data)
    }
  }

  // 搜索
  const onSearch = async (value: string) => {
    await initDataSource({ pageName: value })
  }

  // 新增页面
  const handleAddNewPage = () => {
    setPageName("")
    form.resetFields() // 重置表单
    setIsModalOpen(true)
  }

  // 新增页面的弹框的确定按钮的回调
  const handleOk = async () => {
    try {
      await form.validateFields()
      // const values = form.getFieldsValue() // 获取表单的值
      const res = await addNewPage({
        pageId: new Date().getTime(),
        pageName
      })
      if (res?.code === 200) {
        message.success('页面新增成功')
      } else {
        message.error('页面新增失败')
      }
      setIsModalOpen(false)
      form.resetFields() // 重置表单
      initDataSource("")
    } catch (error) {
      console.log('校验失败', error)
    }
  }

  const handleCancel = () => {
    setPageName("")
    form.resetFields()  // 重置表单
    setIsModalOpen(false)
  }

  const changePageName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPageName(e?.target?.value)
  }

  // 删除页面
  const handleDeletePage = async (id: string) => {
    const res = await deletePage(id)
    if (res?.code === 200) {
      message.success('页面删除成功')
    } else {
      message.error('页面删除失败')
    }
    initDataSource({ pageName: "" })
  }

  // 跳转到编辑的设计器页面
  const toBuilderPage = (pageId: string) => {
    window?.open(`http://127.0.0.1:9090/?pageId=${pageId}`)
  }

  // 跳转到预览页面
  const toPreviewPage = (pageId: string) => {
    window?.open(`http://127.0.0.1:9090/render?pageId=${pageId}`)
  }

  // 编辑页面名称的图标的回调
  const handleEditPageName = (pageId: string) => {
    const page = pageList.find(item => item.pageId === pageId)
    if (page) {
      setEditPageName(page.pageName) // 初始化当前编辑的页面名称
      setEditModalOpenId(pageId) // 初始化当前编辑的页面id
    }
  }

  // 编辑页面名称的弹框的确定按钮的回调
  const handleEditPageNameOk = async (pageId: string) => {
    if (!editModalOpenId) return
    const res = await updatePage(pageId, {
      pageName: editPageName
    })
    if (res?.code === 200) {
      message.success('页面名称修改成功')
    } else {
      message.error('页面名称修改失败')
    }
    setEditModalOpenId(null) // 页面Id设置为空，关闭弹窗
    initDataSource({ pageName: "" })
  }

  const handleEditPageNameCancel = () => {
    setEditModalOpenId(null) // 页面Id设置为空，关闭弹窗
  }

  const updateEditPageName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditPageName(e?.target?.value)
  }

  const upLoadImage = () => {
    navigate('/uploadImage')
  }

  const toDataBase = () => {
    navigate('/dataBase')
  }

  useEffect(() => {
    initDataSource({ pageName: "" });
  }, [])

  return (
    <div className='PageList'>
      {/* 左侧区域 */}
      <div className='pageLeft'>
        <div className='leftHeader'>ZhiLinBuilder</div>
        <div className='leftDiscribe'>轻量级的低代码平台</div>
        <Divider />
        <Button onClick={upLoadImage} size='large' type='link'>图片管理</Button>
        <Divider />
        <Button onClick={toDataBase} size='large' type='link'>实体管理</Button>
        <Divider />
      </div>
      {/* 右侧区域 */}
      <div className='pageRight'>
        <div className='PageHeader'>
          <Search
            style={{ width: 304 }}
            onSearch={onSearch}
            allowClear
          />
          <Button className='pageButton' onClick={handleAddNewPage}>新建页面</Button>
        </div>
        <Divider />
        <div className='PageBody'>
          <Row style={{ width: '100%' }} gutter={16}>
            {
              pageList?.map(item => {
                return (
                  <Col style={{ marginTop: '10px' }} key={item.id} span={6}>
                    <Card
                      title={<span>{item.pageName}</span>}
                      extra={
                        <>
                          <EditOutlined style={{ marginRight: '10px' }} onClick={() => handleEditPageName(item.pageId)} />
                          <Popconfirm
                            title="删除页面"
                            description="是否删除此页面?"
                            cancelText="取消"
                            okText="确认"
                            onConfirm={() => { handleDeletePage(item.pageId) }}
                          >
                            <DeleteOutlined />
                          </Popconfirm>
                        </>
                      }
                      bordered={false}
                    >
                      <div style={{ height: '50px' }}>
                        <Button type='text' onClick={() => { toBuilderPage(item.pageId) }}>编辑页面</Button>
                        <Button type='text' onClick={() => { toPreviewPage(item.pageId) }}>预览页面</Button>
                      </div>
                      <Modal title="编辑页面名称" open={editModalOpenId === item.pageId} onOk={() => { handleEditPageNameOk(item?.pageId) }} onCancel={handleEditPageNameCancel} okText='确认' cancelText='取消'>
                        <Input addonBefore="页面名称" value={editPageName} onChange={updateEditPageName} />
                      </Modal>
                    </Card>
                  </Col>
                )
              })
            }
          </Row>
        </div>
      </div>
      {/* 点击新建页面按钮弹出的模态框区域 */}
      <Modal title="新建页面" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText='创建' cancelText='取消'>
        <Form form={form}>
          <Form.Item
            label="页面名称"
            name="pageName"
            rules={[{ required: true, message: '请输入页面名称' }]}
          >
            <Input value={pageName} onChange={changePageName} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
