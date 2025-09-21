<template>
  <div class="api-container">
    <div id="content-containers">
      <!-- 将标题和卡片放入同一个可滚动容器中 -->
      <div class="api-content-wrapper">
        <div id="api-cards" class="api-cards-container">
          <h1>API统计信息</h1>
          <!-- API管理操作按钮 -->
          <div class="api-actions" id="apiActions" v-show="showAdminActions">
            <button class="api-btn" id="insertApiBtn" @click="showManageApiModal('insert')">
              <i class="fas fa-plus"></i> 插入新API
            </button>
            <button class="api-btn" id="updateApiBtn" @click="showManageApiModal('update')">
              <i class="fas fa-edit"></i> 更新API描述
            </button>
          </div>
          <!-- 加载状态 -->
          <div v-if="loading" class="api-card">正在加载数据...</div>

          <!-- 错误状态 -->
          <div v-else-if="error" class="api-card" style="color: red;">加载失败: {{ error }}</div>

          <!-- 空状态 -->
          <div v-else-if="apiData.length === 0" class="api-card">暂无API数据</div>

          <!-- API卡片列表 -->
          <div v-else class="api-cards-container-inner">
            <div v-for="(api, index) in apiData" :key="index" class="api-card">
              <div class="api-description">{{ api.description || '暂无描述' }}</div>
              <div class="api-url">{{ api.url || '未知路径' }}</div>
              <div class="api-count">调用次数: {{ api.count || 0 }}</div>
              <div class="api-description">
                <button class="api-btn" @click="showApiDetail(api)">查看详情</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- API详情弹窗 -->
    <div id="apiModal" class="api-modal" :style="{ display: detailModalVisible ? 'flex' : 'none' }">
      <div class="api-modal-content">
        <button class="api-modal-close" @click="closeApiModal">&times;</button>
        <div id="modalContent">
          <div class="api-modal-url">{{ selectedApi.url || '未知路径' }}</div>
          <div class="api-modal-description">
            <strong>描述:</strong> {{ selectedApi.description || '暂无描述' }}
          </div>
          <div class="api-modal-description">
            <strong>调用次数:</strong> {{ selectedApi.count || 0 }}
          </div>
          <div>
            <strong>调用示例:</strong>
            <div class="api-modal-code">{{ selectedApi.code || defaultCodeExample }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- API管理弹窗 -->
    <div id="manageApiModal" class="api-modal" :style="{ display: manageModalVisible ? 'flex' : 'none' }">
      <div class="api-modal-content">
        <button class="api-modal-close" @click="closeManageApiModal">&times;</button>
        <div id="manageModalContent">
          <h2 v-if="manageModalType === 'insert'">插入新API</h2>
          <h2 v-else-if="manageModalType === 'update'">更新API描述</h2>

          <div class="modal-form">
            <div class="input-group">
              <label for="apiNameInput">API名称:</label>
              <input
                  type="text"
                  id="apiNameInput"
                  class="api-input"
                  placeholder="请输入API名称"
                  v-model="manageForm.apiName"
              >
            </div>

            <div v-if="manageModalType === 'update'" class="input-group">
              <label for="descriptionInput">描述:</label>
              <input
                  type="text"
                  id="descriptionInput"
                  class="api-input"
                  placeholder="请输入描述"
                  v-model="manageForm.description"
              >
            </div>

            <div v-if="manageModalType === 'update'" class="input-group">
              <label for="codeInput">调用代码:</label>
              <textarea
                  id="codeInput"
                  class="api-input"
                  placeholder="请输入调用代码示例"
                  rows="4"
                  v-model="manageForm.code"
              ></textarea>
            </div>

            <div class="modal-buttons">
              <button
                  v-if="manageModalType === 'insert'"
                  class="api-btn"
                  @click="confirmInsertApi"
              >
                <i class="fas fa-check"></i> 确认插入
              </button>
              <button
                  v-else-if="manageModalType === 'update'"
                  class="api-btn"
                  @click="confirmUpdateApi"
              >
                <i class="fas fa-check"></i> 确认更新
              </button>
              <button
                  class="api-btn"
                  @click="closeManageApiModal"
                  style="background: #999;"
              >
                <i class="fas fa-times"></i> 取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAuth } from '../composables/useAuth'

// 使用认证状态
const { isLoggedIn, userInfo } = useAuth()

// 响应式数据
const apiData = ref([])
const loading = ref(false)
const error = ref(null)
const selectedApi = ref({})

// 模态框状态
const detailModalVisible = ref(false)
const manageModalVisible = ref(false)
const manageModalType = ref('')

// 管理表单数据
const manageForm = ref({
  apiName: '',
  description: '',
  code: ''
})

// 计算属性：是否显示管理员操作按钮
const showAdminActions = computed(() => {
  return isLoggedIn.value &&
      userInfo.value &&
      userInfo.value.grade >= 3 &&
      userInfo.value.isEnable === true
})

// 默认代码示例
const defaultCodeExample = computed(() => {
  return `// 示例代码
fetch('${selectedApi.value.url || '未知路径'}')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`
})

// 获取API数据
const loadApiData = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetchWithToken('http://luren.online:2345/proxy/apiStats')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    apiData.value = data || []
  } catch (err) {
    console.error('获取API统计信息失败:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// 带token的fetch请求函数
const fetchWithToken = async (url, options = {}) => {
  // 获取token
  const token = localStorage.getItem('userToken')

  // 设置默认选项
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    }
  }

  // 如果有token，则添加到请求头
  if (token) {
    defaultOptions.headers['Authorization'] = `Bearer ${token}`
  }

  // 合并选项
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  }

  return fetch(url, mergedOptions)
}

// 显示API详情模态框
const showApiDetail = (api) => {
  selectedApi.value = api
  detailModalVisible.value = true
}

// 关闭API详情模态框
const closeApiModal = () => {
  detailModalVisible.value = false
}

// 显示管理API模态框
const showManageApiModal = (type) => {
  if (!isLoggedIn.value) {
    // 这里可以使用你的消息提示组件或路由跳转
    console.log('请先登录')
    // 例如: router.push('/login')
    return
  }

  manageModalType.value = type
  manageForm.value = {
    apiName: '',
    description: '',
    code: ''
  }
  manageModalVisible.value = true
}

// 关闭管理API模态框
const closeManageApiModal = () => {
  manageModalVisible.value = false
}

// 确认插入API
const confirmInsertApi = async () => {
  if (!isLoggedIn.value) {
    console.log('请先登录')
    // 例如: router.push('/login')
    return
  }

  const apiName = manageForm.value.apiName.trim()
  if (!apiName) {
    console.log('请输入API名称')
    return
  }

  try {
    const response = await fetchWithToken('http://luren.online:2345/proxy/insertApiUrl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `apiName=${encodeURIComponent(apiName)}`
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log(data.message || '操作成功')

    closeManageApiModal()
    // 重新加载API数据
    await loadApiData()
  } catch (err) {
    console.error('插入API失败:', err)
    console.log('操作失败: ' + err.message)
  }
}

// 确认更新API
const confirmUpdateApi = async () => {
  if (!isLoggedIn.value) {
    console.log('请先登录')
    // 例如: router.push('/login')
    return
  }

  const { apiName, description, code } = manageForm.value
  if (!apiName) {
    console.log('请输入API名称')
    return
  }

  if (!description) {
    console.log('请输入描述')
    return
  }

  try {
    // 构造请求参数
    let requestBody = `apiName=${encodeURIComponent(apiName)}&description=${encodeURIComponent(description)}`
    if (code) {
      requestBody += `&code=${encodeURIComponent(code)}`
    }

    const response = await fetchWithToken('http://luren.online/proxy/updateApiUrl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log(data.message || '操作成功')

    closeManageApiModal()
    // 重新加载API数据
    await loadApiData()
  } catch (err) {
    console.error('更新API失败:', err)
    console.log('操作失败: ' + err.message)
  }
}

// 处理模态框外部点击关闭
const handleModalClick = (event) => {
  if (event.target.id === 'apiModal') {
    closeApiModal()
  }
  if (event.target.id === 'manageApiModal') {
    closeManageApiModal()
  }
}

// 处理ESC键关闭模态框
const handleEscKey = (event) => {
  if (event.key === 'Escape') {
    if (detailModalVisible.value) {
      closeApiModal()
    }
    if (manageModalVisible.value) {
      closeManageApiModal()
    }
  }
}

// 组件挂载时
onMounted(() => {
  // 加载API数据
  loadApiData()

  // 每分钟刷新一次数据
  const interval = setInterval(loadApiData, 60000)

  // 添加事件监听器
  document.addEventListener('click', handleModalClick)
  document.addEventListener('keydown', handleEscKey)

  // 清理函数
  onUnmounted(() => {
    clearInterval(interval)
    document.removeEventListener('click', handleModalClick)
    document.removeEventListener('keydown', handleEscKey)
  })
})
</script>

<style scoped>
@import '../assets/css/api.css';


/* 添加自定义样式 */
#content-containers h1 {
  color: white !important;
  text-align: center;
  margin-bottom: 30px;
}

/* 新增包装器，用于包含标题和卡片 */
.api-content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

/* 确保卡片容器居中对齐 */
.api-cards-container {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: center !important;
  gap: 20px !important;
  padding: 20px !important;
  width: 100%;
}

/* 确保所有卡片大小相同 */
.api-card {
  background: rgba(255, 255, 255, 0.7) !important;
  border-radius: 15px !important;
  padding: 20px !important;
  width: 341px !important; /* 固定宽度 */
  min-height: 200px !important; /* 最小高度确保一致性 */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
  backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
}

/* 确保卡片内的内容填充方式一致 */
.api-card .api-description,
.api-card .api-url,
.api-card .api-count {
  margin-bottom: 15px !important;
}

.api-card .api-description:last-child {
  margin-bottom: 0 !important;
  margin-top: auto !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .api-card {
    width: 250px !important;
    min-height: 180px !important;
  }
}

@media (max-width: 480px) {
  .api-card {
    width: 100% !important;
    min-height: 180px !important;
  }
}

/* 确保模态框正确显示 */
.api-modal {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background-color: rgba(0, 0, 0, 0.5) !important;
  z-index: 1000 !important;
  justify-content: center !important;
  align-items: center !important;
}

/* 新增样式：卡片容器内部 */
.api-cards-container-inner {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: center !important;
  gap: 20px !important;
  padding: 20px !important;
  width: 100%;
}
</style>
