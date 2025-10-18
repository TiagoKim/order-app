import { useState } from 'react'
import Header from './components/Header'
import ProductCard from './components/ProductCard'
import ShoppingCart from './components/ShoppingCart'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('order')
  const [cart, setCart] = useState([])

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
    
    alert(`주문이 완료되었습니다!\n총 금액: ${getTotalPrice().toLocaleString()}원`)
    setCart([])
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
          <h2>관리자 화면 (구현 예정)</h2>
        </div>
      )}
    </div>
  )
}

export default App