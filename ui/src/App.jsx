import { useState, useEffect } from 'react'
import Header from './components/Header'
import ProductCard from './components/ProductCard'
import ShoppingCart from './components/ShoppingCart'
import AdminDashboard from './components/AdminDashboard'
import InventoryManagement from './components/InventoryManagement'
import OrderManagement from './components/OrderManagement'
import { menuAPI, orderAPI, handleAPIError, checkAPIHealth } from './services/api'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('admin')
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // 메뉴 데이터
  const [menuItems, setMenuItems] = useState([])
  
  // 관리자 화면 상태 관리
  const [inventory, setInventory] = useState([])
  const [orders, setOrders] = useState([])
  const [orderStats, setOrderStats] = useState({
    total_orders: 0,
    received_orders: 0,
    preparing_orders: 0,
    completed_orders: 0,
    cancelled_orders: 0
  })

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadInitialData()
  }, [])

  // 관리자 화면으로 전환 시 데이터 새로고침
  useEffect(() => {
    if (currentScreen === 'admin') {
      loadAdminData()
    }
  }, [currentScreen])

  // 화면 전환 함수
  const handleScreenChange = (screen) => {
    setCurrentScreen(screen)
    if (screen === 'admin') {
      loadAdminData()
    }
  }

  // 초기 데이터 로드
  const loadInitialData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // API 상태 확인
      const isAPIHealthy = await checkAPIHealth()
      if (!isAPIHealthy) {
        throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.')
      }
      
      // 메뉴 데이터와 재고 정보 병렬 로드
      const [menuResponse, inventoryResponse] = await Promise.all([
        menuAPI.getMenus(),
        menuAPI.getInventory()
      ])
      
      setMenuItems(menuResponse.data)
      setInventory(inventoryResponse.data)
      
    } catch (error) {
      console.error('초기 데이터 로드 실패:', error)
      setError(handleAPIError(error, '데이터를 불러오는데 실패했습니다.'))
    } finally {
      setLoading(false)
    }
  }

  // 관리자 데이터 로드
  const loadAdminData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 병렬로 데이터 로드
      const [inventoryResponse, ordersResponse, statsResponse] = await Promise.all([
        menuAPI.getInventory(),
        orderAPI.getOrders(),
        orderAPI.getOrderStats()
      ])
      
      setInventory(inventoryResponse.data)
      setOrders(ordersResponse.data.orders)
      setOrderStats(statsResponse.data)
      
    } catch (error) {
      console.error('관리자 데이터 로드 실패:', error)
      setError(handleAPIError(error, '관리자 데이터를 불러오는데 실패했습니다.'))
    } finally {
      setLoading(false)
    }
  }

  // 장바구니 관련 함수들
  const addToCart = (item, options) => {
    // 재고 확인
    const inventoryItem = inventory.find(inv => inv.name === item.name)
    const currentStock = inventoryItem?.stock_quantity || inventoryItem?.quantity || item.stock_quantity || 0
    
    if (currentStock <= 0) {
      alert(`${item.name}이(가) 품절되었습니다.`)
      return
    }

    const cartItem = {
      id: `${item.id}-${JSON.stringify(options)}`,
      name: item.name,
      basePrice: item.price,
      options: options,
      quantity: 1
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => 
        cartItem.name === item.name && 
        JSON.stringify(cartItem.options) === JSON.stringify(options)
      )

      if (existingItem) {
        // 재고 확인 (기존 아이템 + 새로 추가할 아이템)
        const totalQuantity = existingItem.quantity + 1
        if (totalQuantity > currentStock) {
          alert(`재고가 부족합니다. (현재 재고: ${currentStock}개)`)
          return prevCart
        }
        
        return prevCart.map(cartItem =>
          cartItem.id === existingItem.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      } else {
        return [...prevCart, cartItem]
      }
    })
  }

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const optionsPrice = (item.options.addShot ? 500 : 0) + (item.options.addSyrup ? 0 : 0)
      return total + (item.basePrice + optionsPrice) * item.quantity
    }, 0)
  }

  // 주문 처리
  const handleOrder = async () => {
    if (cart.length === 0) {
      alert('장바구니가 비어있습니다.')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      // 주문 데이터 구성
      const orderData = {
        items: cart.map(item => {
          const menuItem = menuItems.find(menu => menu.name === item.name)
          if (!menuItem) {
            throw new Error(`메뉴를 찾을 수 없습니다: ${item.name}`)
          }
          
          return {
            menu_id: menuItem.id,
            quantity: item.quantity,
            unit_price: item.basePrice + (item.options.addShot ? 500 : 0) + (item.options.addSyrup ? 0 : 0),
            options: [
              ...(item.options.addShot ? [{ name: '샷 추가', price: 500 }] : []),
              ...(item.options.addSyrup ? [{ name: '시럽 추가', price: 0 }] : [])
            ]
          }
        }),
        customer_name: null,
        customer_phone: null,
        notes: null
      }
      
      // 주문 생성
      const response = await orderAPI.createOrder(orderData)
      
      alert(`주문이 완료되었습니다!\n주문번호: ${response.data.order_number}\n총 금액: ${response.data.total_amount.toLocaleString()}원`)
      setCart([])
      
      // 관리자 화면이면 데이터 새로고침
      if (currentScreen === 'admin') {
        loadAdminData()
      }
      
    } catch (error) {
      console.error('주문 처리 실패:', error)
      setError(handleAPIError(error, '주문 처리 중 오류가 발생했습니다.'))
    } finally {
      setLoading(false)
    }
  }

  // 관리자 화면 함수들
  const updateInventory = async (itemId, newQuantity) => {
    try {
      setLoading(true)
      setError(null)
      
      await menuAPI.updateInventory(itemId, newQuantity)
      
      // 로컬 상태 업데이트
      setInventory(prevInventory =>
        prevInventory.map(item =>
          item.id === itemId ? { ...item, stock_quantity: newQuantity } : item
        )
      )
      
      // 메뉴 아이템도 업데이트
      setMenuItems(prevMenuItems =>
        prevMenuItems.map(menuItem =>
          menuItem.id === itemId ? { ...menuItem, stock_quantity: newQuantity } : menuItem
        )
      )
      
    } catch (error) {
      console.error('재고 업데이트 실패:', error)
      setError(handleAPIError(error, '재고 업데이트 중 오류가 발생했습니다.'))
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true)
      setError(null)
      
      await orderAPI.updateOrderStatus(orderId, newStatus)
      
      // 로컬 상태 업데이트
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      )
      
      // 통계 업데이트
      loadAdminData()
      
    } catch (error) {
      console.error('주문 상태 업데이트 실패:', error)
      setError(handleAPIError(error, '주문 상태 업데이트 중 오류가 발생했습니다.'))
    } finally {
      setLoading(false)
    }
  }

  const getOrderStats = () => {
    return orderStats
  }

  // 에러 표시 컴포넌트
  const ErrorMessage = () => {
    if (!error) return null
    
    return (
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: '#fee2e2',
        color: '#991b1b',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #fecaca',
        zIndex: 1000,
        maxWidth: '400px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>오류 발생</div>
        <div>{error}</div>
        <button 
          onClick={() => setError(null)}
          style={{
            marginTop: '8px',
            background: '#991b1b',
            color: 'white',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          닫기
        </button>
      </div>
    )
  }

  // 로딩 표시 컴포넌트
  const LoadingOverlay = () => {
    if (!loading) return null
    
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999
      }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div>로딩 중...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header 
        currentScreen={currentScreen} 
        onScreenChange={handleScreenChange}
      />
      
      <ErrorMessage />
      <LoadingOverlay />
      
      {currentScreen === 'order' && (
        <div className="order-screen">
          <div className="product-section">
            <h2>메뉴</h2>
            <div className="product-grid">
              {menuItems.map(item => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onAddToCart={addToCart}
                  inventory={inventory}
                />
              ))}
            </div>
          </div>
          
          <ShoppingCart
            cart={cart}
            onRemoveItem={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onOrder={handleOrder}
            totalPrice={getTotalPrice()}
          />
        </div>
      )}
      
      {currentScreen === 'admin' && (
        <div className="admin-screen">
          <AdminDashboard orderStats={getOrderStats()} />
          <InventoryManagement
            inventory={inventory}
            onUpdateInventory={updateInventory}
          />
          <OrderManagement
            orders={orders}
            onUpdateOrderStatus={updateOrderStatus}
          />
        </div>
      )}
    </div>
  )
}

export default App