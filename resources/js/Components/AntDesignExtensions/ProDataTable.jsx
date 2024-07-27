import { ProTable } from '@ant-design/pro-components'
import { Button, Input, Space } from 'antd'
import { useState } from 'react'
import { useDebounceFn } from 'ahooks'

export default function ProDataTable({
  columns,
  routeName,
  rowKey,
  toolBar,
  title = '',
  paginationSize = 25,
  ...props
}) {
  const [tableParams, setTableParams] = useState({})

  const { run: handleSearch } = useDebounceFn(
    e => {
      setTableParams(prevState => ({ ...prevState, search: e.target.value }))
    },
    { wait: 500 }
  )
  return (
    <ProTable
      columns={columns}
      params={tableParams}
      request={async (params, sort, filter) => {
        const res = await axios.post(route(routeName, { page: params.current }), {
          ...params,
          sort,
          filter,
        })
        return {
          data: res.data.data,
          success: true,
          total: res.data.meta.total,
        }
      }}
      pagination={{
        pageSize: paginationSize,
      }}
      bordered
      size={'middle'}
      search={false}
      rowKey={rowKey}
      toolBarRender={() => {
        return (
          <Space>
            <Input allowClear={true} placeholder={'Search'} onChange={handleSearch} />
            {toolBar}
          </Space>
        )
      }}
      toolbar={{
        title: title,
      }}
      options={{ density: true, fullScreen: true }}
      {...props}
    />
  )
}
