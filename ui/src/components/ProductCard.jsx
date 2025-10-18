import { useState } from 'react'
import './ProductCard.css'

function ProductCard({ item, onAddToCart, inventory }) {
  const [options, setOptions] = useState({
    addShot: false,
    addSyrup: false
  })

  const handleOptionChange = (optionName) => {
    setOptions(prev => ({
      ...prev,
      [optionName]: !prev[optionName]
    }))
  }

  const handleAddToCart = () => {
    onAddToCart(item, options)
    // 옵션 초기화
    setOptions({
      addShot: false,
      addSyrup: false
    })
  }

  const getTotalPrice = () => {
    const basePrice = item.price
    const shotPrice = options.addShot ? 500 : 0
    const syrupPrice = options.addSyrup ? 0 : 0
    return basePrice + shotPrice + syrupPrice
  }

  const getInventoryStatus = () => {
    const inventoryItem = inventory?.find(inv => inv.name === item.name)
    if (!inventoryItem) return { status: 'unknown', text: '재고 정보 없음' }
    
    const quantity = inventoryItem.stock_quantity || inventoryItem.quantity || 0
    if (quantity === 0) {
      return { status: 'out', text: '품절' }
    } else if (quantity < 5) {
      return { status: 'low', text: '재고 부족' }
    } else {
      return { status: 'normal', text: '재고 있음' }
    }
  }

  const inventoryStatus = getInventoryStatus()
  const isOutOfStock = inventoryStatus.status === 'out'

  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={item.image_url || item.image} 
          alt={item.name}
          className="product-img"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="image-placeholder" style={{ display: 'none' }}>
          <span>이미지</span>
        </div>
      </div>
      
      <div className="product-info">
        <div className="product-header">
          <h3 className="product-name">{item.name}</h3>
          <span className={`inventory-status ${inventoryStatus.status}`}>
            {inventoryStatus.text}
          </span>
        </div>
        <p className="product-price">{item.price.toLocaleString()}원</p>
        <p className="product-description">{item.description}</p>
        
        <div className="customization-options">
          <label className="option-item">
            <input
              type="checkbox"
              checked={options.addShot}
              onChange={() => handleOptionChange('addShot')}
            />
            <span>샷 추가 (+500원)</span>
          </label>
          
          <label className="option-item">
            <input
              type="checkbox"
              checked={options.addSyrup}
              onChange={() => handleOptionChange('addSyrup')}
            />
            <span>시럽 추가 (+0원)</span>
          </label>
        </div>
        
        <button 
          className={`add-to-cart-button ${isOutOfStock ? 'disabled' : ''}`}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? '품절' : '담기'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
