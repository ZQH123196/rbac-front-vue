<template>
  <div style="padding: 20px">
    <el-row :gutter="20">
      <!-- 第一列 -->
      <el-col :span="4">
        <el-input
          v-model="deptName"
          placeholder="请输入区划名称"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          style="margin-bottom: 20px"
        />
        <el-tree
          ref="tree"
          :data="treeData"
          :props="defaultProps"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          default-expand-all
          @node-click="handleTreeNodeClick"
        />
      </el-col>
      <!-- 第二列 -->
      <el-col :span="20">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleUserAdd">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="el-icon-edit" size="mini" @click="handleUserEdit">
              修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleDelete">删除</el-button>
          </el-col>
        </el-row>
        <el-table :v-loading="detailTableDataLoading" :data="detailTableData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column v-if="columns[0].visible" key="userId" label="用户编号" align="center" prop="userId" />
          <el-table-column
            v-if="columns[1].visible"
            key="userName"
            label="用户名称"
            align="center"
            prop="userName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            v-if="columns[2].visible"
            key="nickName"
            label="用户昵称"
            align="center"
            prop="nickName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            v-if="columns[3].visible"
            key="deptName"
            label="区划"
            align="center"
            prop="dept.deptName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            v-if="columns[4].visible"
            key="phonenumber"
            label="手机号码"
            align="center"
            prop="phonenumber"
            width="120"
          />
          <el-table-column v-if="columns[5].visible" key="status" label="状态" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column v-if="columns[6].visible" label="创建时间" align="center" prop="createTime" width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                style="padding: 0; min-width: 40px"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUserEdit(scope.row)"
              >修改</el-button>
              <el-button
                v-if="scope.row.userId !== 1"
                style="padding: 0; min-width: 40px"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
              <el-button
                style="padding: 0; min-width: 40px"
                size="mini"
                type="text"
                icon="el-icon-key"
                @click="handleResetPwd(scope.row)"
              >重置
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="userDialogTitle" :visible.sync="openUserEditDialog" width="600px" append-to-body>
      <el-form ref="form" :model="userForm" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="userForm.userId == undefined" label="用户名称" prop="userName">
              <el-input v-model="userForm.userName" placeholder="请输入用户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="userForm.userId == undefined" label="用户密码" prop="password">
              <el-input v-model="userForm.password" placeholder="请输入用户密码" type="password" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="归属区划" prop="deptId">
              <treeselect v-model="userForm.deptId" :options="treeData" :show-count="true" placeholder="请选择归属区划" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input v-model="userForm.phonenumber" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userForm.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- TODO -->
        <!-- <el-row>
                    <el-col :span="12">
                        <el-form-item label="状态">
                            <el-radio-group v-model="userForm.status">
                                <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">
                                    {{dict.dictLabel}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row> -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="userForm.roleIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.status == 1"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="userForm.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RightToolbar from '@/components/RightToolbar'
import rbacAPI from '../../api/rbac.js'
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'UserManage',
  components: {
    RightToolbar,
    Treeselect
  },
  data() {
    return {
      // 树状结构数据
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 用户表格数据
      detailTableData: [],
      // 选中数组
      selectedItemId: [],
      detailTableDataLoading: false,
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `用户名称`, visible: true },
        { key: 2, label: `用户昵称`, visible: true },
        { key: 3, label: `区划`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `状态`, visible: true },
        { key: 6, label: `创建时间`, visible: true }
      ],
      showADialog: false,
      showBDialog: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
      },
      openUserEditDialog: false,
      // 表单参数
      userForm: {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        status: '0',
        remark: undefined,
        roleIds: []
      },
      userDialogTitle: '',
      // 角色选项
      roleOptions: [],
      // 状态数据字典
      statusOptions: []
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.getTreeData()
      this.getDetailTableData()
    },
    getTreeData() {
      rbacAPI.getAdmdiv().then((res) => {
        this.treeData = res.data
      })
    },
    getDetailTableData(id) {
      this.detailTableDataLoading = true

      console.log('getDetailTableData')
      rbacAPI
        .getUsers(id)
        .then((res) => {
          this.detailTableData = res.data
        })
        .catch((err) => {
          console.error('error', err)
        })
        .finally((res) => {
          this.detailTableDataLoading = false
        })
    },
    // 节点单击事件
    handleTreeNodeClick(data, node, selfRef) {
      this.queryParams.deptId = data.id
      this.getDetailTableData(this.queryParams.deptId)
    },
    userFormReset() {
      this.userForm = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: '0',
        remark: undefined,
        roleIds: []
      }
    },
    handleUserAdd() {
      this.userFormReset() // 重置表单
      this.getTreeData() // 更新一下 tree 数据
      rbacAPI
        .getRoles()
        .then((res) => {
          // 请求可用角色的数据
          this.roleOptions = res.data
          this.openUserEditDialog = true
          this.userDialogTitle = '添加用户'
          this.userForm.password = ''
          this.userForm.status = true
        })
        .catch((err) => {
          console.error('error', err)
        })
    },
    handleSelectionChange() {},
    /** 修改按钮操作 */
    async handleUserEdit(row) {
      this.userFormReset()
      this.getTreeData()
      const userId = row.userId || this.selectedItemId

      await rbacAPI
        .getRoles(userId)
        .then((res) => {
          // 请求可用角色的数据
          this.roleOptions = res.data
        })
        .catch((err) => {
          console.error('error', err)
        })

      await rbacAPI
        .getUsers(userId)
        .then((res) => {
          this.userForm = res.data // data 内返回的是 userForm 对象的超集
          this.openUserEditDialog = true
          this.userDialogTitle = '修改用户'
          this.userForm.password = ''
          this.userForm.status = true
          this.userForm.roleIds = res.roleIds // 已有角色 todo
        })
        .catch((err) => {
          console.error('error', err)
        })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectedItemId = selection.map((item) => item.userId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    }
  }
}
</script>

<style scoped>
</style>
