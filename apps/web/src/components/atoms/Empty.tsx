import { Empty as AntdEmpty } from 'antd'

function Empty({ description }: { description?: string }) {
  return (
    <div className="flex h-[calc(100vh_-_120px)] w-full items-center justify-center">
      <div className="rounded-20 bg-lightGray m-auto flex h-80 w-[500px] items-center justify-center overflow-auto p-3">
        <AntdEmpty image={AntdEmpty.PRESENTED_IMAGE_SIMPLE} description={description} />
      </div>
    </div>
  )
}

export default Empty
