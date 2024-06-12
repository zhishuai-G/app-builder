import { useEffect, useState } from 'react'
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Divider, Input, message, Modal, Popconfirm, Select, Table } from 'antd';
import { getDataForTables, deleteEntity, addEntity } from '../../server'

const typeOptions = [
  { value: 'VARCHAR(255)', label: 'VARCHAR(255)' }, // 可变长度的字符串，最大长度为255    
  { value: 'VARCHAR(MAX)', label: 'VARCHAR(MAX)' }, // 在某些数据库中表示可变长度的最大字符串（如SQL Server）    
  { value: 'TEXT', label: 'TEXT' },         // 长文本    
  { value: 'TINYTEXT', label: 'TINYTEXT' },     // 很小的文本（如MySQL）    
  { value: 'MEDIUMTEXT', label: 'MEDIUMTEXT' },   // 中等长度的文本（如MySQL）    
  { value: 'LONGTEXT', label: 'LONGTEXT' },     // 很长的文本（如MySQL）    
  { value: 'CHAR(255)', label: 'CHAR(255)' },    // 固定长度的字符串，最大长度为255（注意：CHAR类型通常会为所有字符预留空间，即使它们是空的）    
  { value: 'INT', label: 'INT' },          // 整数    
  { value: 'TINYINT', label: 'TINYINT' },      // 很小的整数（如MySQL）    
  { value: 'SMALLINT', label: 'SMALLINT' },     // 小的整数（如MySQL）    
  { value: 'MEDIUMINT', label: 'MEDIUMINT' },    // 中等大小的整数（如MySQL）    
  { value: 'BIGINT', label: 'BIGINT' },       // 大整数    
  { value: 'FLOAT', label: 'FLOAT' },        // 浮点数    
  { value: 'DOUBLE', label: 'DOUBLE' },       // 双精度浮点数    
  { value: 'DECIMAL(10,2)', label: 'DECIMAL(10,2)' },// 精确的小数，总共10位数字，小数点后有2位    
  { value: 'DATE', label: 'DATE' },         // 日期    
  { value: 'DATETIME', label: 'DATETIME' },     // 日期和时间    
  { value: 'TIMESTAMP', label: 'TIMESTAMP' },    // 时间戳（自动更新或手动设置）    
  { value: 'TIME', label: 'TIME' },         // 时间    
  { value: 'YEAR', label: 'YEAR' },         // 年份    
  { value: 'BINARY(255)', label: 'BINARY(255)' },  // 二进制数据，长度为255    
  { value: 'VARBINARY(255)', label: 'VARBINARY(255)' },// 可变长度的二进制数据，最大长度为255    
  { value: 'BLOB', label: 'BLOB' },         // 二进制大对象（BLOB）    
  { value: 'TINYBLOB', label: 'TINYBLOB' },     // 小的BLOB（如MySQL）    
  { value: 'MEDIUMBLOB', label: 'MEDIUMBLOB' },   // 中等大小的BLOB（如MySQL）    
  { value: 'LONGBLOB', label: 'LONGBLOB' }     // 长的BLOB（如MySQL）  
];

interface Entity {
  tableCode?: string,
  tableName?: string
}


export default function DataBase() {
  const [entity, setEntity] = useState<Entity>({})
  const [entityDataList, setEntityDataList] = useState([])
  const [showEntityModal, setShowEntityModal] = useState<boolean>(false)
  const [entityCode, setEntityCode] = useState<string>('')
  const [entityName, setEntityName] = useState<string>('')
  const [columns, setColumns] = useState<any[]>([]) // 每个实体所包含的列
  const [columnsList, setColumnsList] = useState<any[]>([]) // 新增的实体列
  const [tableData, setTableData] = useState<any[]>([]) // 表格数据

  // 公共方法，初始化所有数据
  const initDataSource = async () => {
    const res = await getDataForTables()
    if (res?.code === 200) {
      console.log(res.data);
      const data = res.data
      setEntityDataList(data)
    }
  }

  const handleAddEntity = async () => {
    setShowEntityModal(true)
  }

  // 删除实体
  const handleDeleteEntity = async (id: string) => {
    const res = await deleteEntity(id)
    if (res?.code === 200) {
      message.success('实体删除成功')
    } else {
      message.error('实体删除失败')
    }
    initDataSource()
  }

  const handleOk = async () => {
    if (entityName === '' || entityCode === '') {
      message.error('请输入实体名称或编码')
      return;
    }
    const res = await addEntity({
      tableName: entityName,
      tableCode: entityCode,
      columns: columnsList
    })
    if (res?.code === 200) {
      message.success('页面新增成功')
    } else {
      message.error('页面新增失败')
    }
    setShowEntityModal(false)
    console.log(columnsList);
    setColumnsList([])
    setEntityName('')
    setEntityCode('')
    initDataSource()
  }

  const handleCancel = () => {
    setShowEntityModal(false)
    setColumnsList([])
  }

  const handleOnClick=(item: any)=>{
    console.log(item.columns);
    const { data, columns } = item
    const columnData = columns.map((item: any) => {
      return {
        title: item.columnName,
        dataIndex: item.columnName,
        key: item.columnName,
      }
    })
    const tableData = data.map((item: any) => {
      return {
        ...item,
        key: item.id
      }
    })
    setTableData(tableData)
    setColumns(columnData)
    setEntity(item)
  }

  useEffect(() => {
    initDataSource();
  }, [])

  return (
    <div className='PageList'>
      <div className='pageLeft'>
        <div className='leftHeader'>ZhiLinBuilder</div>
        <div className='leftDiscribe'>实体管理平台</div>
        <div>
          {
            entityDataList?.map((item: any, index: number) => {
              return (
                <div style={entity?.tableCode === item?.tableCode ? { backgroundColor: '#edeaeb' } : {}} onClick={() => { handleOnClick(item) }} key={index} className='imageItem'>
                  {item?.tableName}
                  <Popconfirm
                    title="删除页面"
                    description="是否删除此实体?"
                    cancelText="取消"
                    okText="确认"
                    onConfirm={() => { handleDeleteEntity(item?.tableCode) }}
                  >
                    <DeleteOutlined style={{ position: 'relative', left: '230px', cursor: 'pointer' }} />
                  </Popconfirm>
                </div>
              )
            })
          }
        </div>
      </div>
      <div>
        <Button type='primary' onClick={handleAddEntity} style={{ marginTop: '100px', marginLeft: '25px' }}>新增实体</Button>
        <Table
          style={{ width: 1300, marginTop: '20px', marginLeft: '20px' }}
          columns={columns}
          dataSource={tableData}
        />
      </div>
      <Modal
        title="新增实体"
        width={700}
        open={showEntityModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Button style={{ position: 'relative', left: "550px", marginBottom: '20px' }} type='primary' onClick={() => { setColumnsList([...columnsList, {}]) }}>新增字段</Button>
        <div style={{ display: 'flex', width: '600px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', width: '280px', justifyContent: 'space-around' }}>
            <p>实体名称:</p>
            <Input value={entityName} onChange={(e) => setEntityName(e.target.value)} style={{ height: '30px', width: '180px', marginTop: '10px' }} />
          </div>
          <div style={{ display: 'flex', width: '280px', justifyContent: 'space-around' }}>
            <p>实体编码:</p>
            <Input value={entityCode} onChange={(e) => setEntityCode(e.target.value)} style={{ height: '30px', width: '180px', marginTop: '10px' }} />
          </div>
        </div>
        <Divider />
        {
          columnsList.map((item, index) => {
            return (
              <div key={index} style={{ display: 'flex', width: '600px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', width: '280px', justifyContent: 'space-around' }}>
                  <p>字段:</p>
                  <Input onChange={(e) => item.columnName = e.target.value} style={{ height: '30px', width: '180px', marginTop: '10px' }} />
                </div>
                <div style={{ display: 'flex', width: '280px', justifyContent: 'space-around' }}>
                  <p>类型:</p>
                  <Select options={typeOptions} onChange={(value) => item.type = value} style={{ height: '30px', width: '180px', marginTop: '10px' }} />
                </div>
              </div>
            )
          })
        }
      </Modal>
    </div>
  )
}