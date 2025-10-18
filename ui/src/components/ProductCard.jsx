import { useState } from 'react'
import './ProductCard.css'

function ProductCard({ item, onAddToCart }) {
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

  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={item.image} 
          alt={item.name}
          className="product-img"
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
        <h3 className="product-name">{item.name}</h3>
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
          className="add-to-cart-button"
          onClick={handleAddToCart}
        >
          담기
        </button>
      </div>
    </div>
  )
}

export default ProductCard
