import { useEffect, useState } from 'react'
import { FileImageOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Image, message, Upload } from 'antd';
import type { GetProp, UploadProps } from 'antd';
import { getImageList } from '../../server'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};


export default function UploadImage() {
  const [imageList, setImageList] = useState([])
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  // 公共方法，初始化所有数据
  const initDataSource = async () => {
    const res = await getImageList()
    if (res?.code === 200) {
      console.log(res.data);
      setImageList(res.data)
    }
  }

  // 处理上传图片事件
  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
        initDataSource()
      });
    }
  };

  // 上传图片按钮
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const getImage = (imageName: string) => {
    return () => {
      // 图片地址要与服务端访问静态资源的地址保持一致
      setImageUrl(`http://127.0.0.1:9091/uploadImage/${imageName}`);
    }
  }

  useEffect(() => {
    initDataSource();
  }, [])

  return (
    <div className='PageList'>
      <div className='pageLeft'>
        <div className='leftHeader'>ZhiLinBuilder</div>
        <div className='leftDiscribe'>图片管理平台</div>
        <div>
          {
            // imageList.map((item: any) => {
            //   return (
            //     <div className='imageItem' key={item.id}>
            //       <img src={`http://127.0.0.1:9091/uploadImage/${item}`} alt="" />
            //     </div>
            //   )
            // })
            imageList.map((item: any, index: number) => {
              return (
                <div style={imageUrl.includes(item) ? { backgroundColor: '#edeaeb' } : {}} onClick={getImage(item)} key={index} className='imageItem'>
                  <FileImageOutlined style={{ marginRight: '10px' }} />
                  {item}
                </div>
              )
            })
          }
        </div>
      </div>
      <div className='imageRight'>
        <Upload
          name="file"
          listType="picture-card"
          showUploadList={false}
          // 访问上传接口
          action="http://127.0.0.1:9092/api/upload/album"
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {
            uploadButton
          }
        </Upload>
        <Image
          width={500}
          src={imageUrl}
        />
      </div>
    </div>
  )
}