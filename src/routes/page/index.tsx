import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Button, Input, message, Modal, Divider, Select, Form, Popconfirm } from 'antd';
import { DeleteOutlined, DatabaseOutlined, FormOutlined, InsertRowBelowOutlined, UsergroupDeleteOutlined } from '@ant-design/icons';
import { addNewPage, getPageList, deletePage, updatePage } from '../../server'
import './index.css'

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [pageName, setPageName] = useState<string>('')
  const [pageList, setPageList] = useState<pageJsonProps[]>([])

  // 公共方法，初始化所有数据
  const initDataSource = async (value: any) => {
    const res = await getPageList(value)
    setPageList(res)
  }

  // 搜索
  const onSearch = async (value: string) => {
    await initDataSource({ pageName: value })
  }

  // 新增页面
  const handleAddNewPage = () => {
    setPageName("")
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    await addNewPage({
      pageId: new Date().getTime(),
      pageName,
    })
    initDataSource("")
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const changePageName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPageName(e?.target?.value)
  }

  const handleDeletePage = async (id: string) => {
    await deletePage(id)
    initDataSource({ pageName: "" })
  }

  const toBuilderPage = (pageId: string) => {
    window?.open(`http://127.0.0.1:9090/?pageId=${pageId}`)
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
                      title={<span>{item.pageName || '匿名'}</span>}
                      extra={
                        <Popconfirm
                          title="删除页面"
                          description="是否删除此页面?"
                          cancelText="取消"
                          okText="确认"
                          onConfirm={() => { handleDeletePage(item.pageId) }}
                        >
                          <DeleteOutlined />
                        </Popconfirm>
                      }
                      bordered={false}
                    >
                      <div style={{ height: '50px' }}>
                        <Button type='text' onClick={() => { toBuilderPage(item.pageId) }}>编辑页面</Button>
                        <Button type='text'>预览页面</Button>
                      </div>
                    </Card>
                  </Col>
                )
              })
            }
          </Row>
        </div>
      </div>
      {/* 点击新建页面按钮弹出的模态框区域 */}
      <Modal title="创建页面" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText='创建' cancelText='取消'>
        <Input addonBefore="页面名称" value={pageName} onChange={changePageName} />
      </Modal>
    </div>
  )
}
