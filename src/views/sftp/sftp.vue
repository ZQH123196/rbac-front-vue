<template>
  <div>
    <el-tree ref="tree" :data="data4list" :props="defaultProps" @node-click="handleTreeNodeClick" />
  </div>
</template>

<script>
export default {
  name: 'SftpPage',
  data() {
    return {
      data4list: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.data4list = [
      {
        type: 'DIRECTORY',
        label: 'dirname',
        children: []
      },
      {
        type: 'REGULAR',
        label: 'filename'
      },
      {
        type: 'REGULAR',
        label: 'filename'
      },
      {
        type: 'REGULAR',
        label: 'filename'
      }
    ]
  },
  methods: {
    handleTreeNodeClick(dataObj, nodeObj, treeObj) {
      console.log('dataObj', dataObj)
      console.log('nodeObj', nodeObj)
      console.log('treeObj', treeObj)
      // 如果是文件夹就展开，其他类型都下载
      if (dataObj.type === 'DIRECTORY') {
        // do nothing
      } else {
        // download xxx
        console.log('download xxx')
      }
    }
  }
}
</script>

