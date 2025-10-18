import { useState } from 'react'
import Header from './components/Header'
import ProductCard from './components/ProductCard'
import ShoppingCart from './components/ShoppingCart'
import AdminDashboard from './components/AdminDashboard'
import InventoryManagement from './components/InventoryManagement'
import OrderManagement from './components/OrderManagement'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('order')
  const [cart, setCart] = useState([])
  
  // 관리자 화면 상태 관리
  const [inventory, setInventory] = useState([
    { id: 1, name: '아메리카노(ICE)', quantity: 10 },
    { id: 2, name: '아메리카노(HOT)', quantity: 8 },
    { id: 3, name: '카페라떼', quantity: 15 }
  ])
  
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderTime: new Date('2024-07-31T13:00:00'),
      status: 'received',
      items: [
        { name: '아메리카노(ICE)', quantity: 1, price: 4000 }
      ],
      totalAmount: 4000
    }
  ])

  // 커피 및 스무디 메뉴 데이터
  const menuItems = [
    {
      id: 1,
      name: '아메리카노(ICE)',
      price: 4000,
      description: '시원하고 깔끔한 아이스 아메리카노',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 2,
      name: '아메리카노(HOT)',
      price: 4000,
      description: '따뜻하고 진한 핫 아메리카노',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 3,
      name: '카페라떼',
      price: 5000,
      description: '부드러운 우유와 에스프레소의 조화',
      image: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 4,
      name: '카라멜 마키아토',
      price: 5500,
      description: '달콤한 카라멜과 에스프레소',
      image: 'https://images.unsplash.com/photo-1517701604599-bb29b5650904?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 5,
      name: '딸기 스무디',
      price: 6000,
      description: '상큼한 딸기와 요거트의 만남',
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 6,
      name: '망고 스무디',
      price: 6000,
      description: '달콤한 망고의 시원한 스무디',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop&crop=center'
    }
  ]

  const addToCart = (item, options) => {
    // 재고 확인
    const inventoryItem = inventory.find(inv => inv.name === item.name)
    if (inventoryItem && inventoryItem.quantity <= 0) {
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
        if (inventoryItem && totalQuantity > inventoryItem.quantity) {
          alert(`재고가 부족합니다. (현재 재고: ${inventoryItem.quantity}개)`)
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

  const handleOrder = () => {
    if (cart.length === 0) {
      alert('장바구니가 비어있습니다.')
      return
    }
    
    // 재고 재확인 및 차감
    const inventoryUpdates = []
    for (const cartItem of cart) {
      const inventoryItem = inventory.find(inv => inv.name === cartItem.name)
      if (!inventoryItem || inventoryItem.quantity < cartItem.quantity) {
        alert(`${cartItem.name}의 재고가 부족합니다. (현재 재고: ${inventoryItem?.quantity || 0}개)`)
        return
      }
      inventoryUpdates.push({
        id: inventoryItem.id,
        newQuantity: inventoryItem.quantity - cartItem.quantity
      })
    }
    
    // 재고 차감
    inventoryUpdates.forEach(update => {
      updateInventory(update.id, update.newQuantity)
    })
    
    // 주문 생성
    const newOrder = {
      id: Date.now(),
      orderTime: new Date(),
      status: 'received',
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.basePrice + (item.options.addShot ? 500 : 0) + (item.options.addSyrup ? 0 : 0)
      })),
      totalAmount: getTotalPrice()
    }
    
    setOrders(prevOrders => [newOrder, ...prevOrders])
    alert(`주문이 완료되었습니다!\n총 금액: ${getTotalPrice().toLocaleString()}원`)
    setCart([])
  }

  // 관리자 화면 함수들
  const updateInventory = (itemId, newQuantity) => {
    setInventory(prevInventory =>
      prevInventory.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    )
  }

  // 주문 통계 계산
  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      received: orders.filter(order => order.status === 'received').length,
      preparing: orders.filter(order => order.status === 'preparing').length,
      completed: orders.filter(order => order.status === 'completed').length,
      cancelled: orders.filter(order => order.status === 'cancelled').length
    }
    return stats
  }

  return (
    <div className="app">
      <Header currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
      
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