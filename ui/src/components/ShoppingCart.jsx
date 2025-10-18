import './ShoppingCart.css'

function ShoppingCart({ cart, onRemoveItem, onUpdateQuantity, onOrder, totalPrice }) {
  const getItemPrice = (item) => {
    const optionsPrice = (item.options.addShot ? 500 : 0) + (item.options.addSyrup ? 0 : 0)
    return (item.basePrice + optionsPrice) * item.quantity
  }

  const getItemDescription = (item) => {
    const options = []
    if (item.options.addShot) options.push('샷 추가')
    if (item.options.addSyrup) options.push('시럽 추가')
    
    if (options.length > 0) {
      return `${item.name} (${options.join(', ')}) X ${item.quantity}`
    }
    return `${item.name} X ${item.quantity}`
  }

  return (
    <div className="shopping-cart">
      <div className="cart-header">
        <h3>장바구니</h3>
      </div>
      
      <div className="cart-content">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>장바구니가 비어있습니다.</p>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items-section">
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-info">
                      <span className="item-description">
                        {getItemDescription(item)}
                      </span>
                    </div>
                    
                    <div className="item-controls">
                      <div className="price-quantity">
                        <span className="item-price">
                          {getItemPrice(item).toLocaleString()}원
                        </span>
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button 
                            className="quantity-btn"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="cart-summary-section">
              <div className="total-section">
                <span className="total-label">총 금액</span>
                <span className="total-price">{totalPrice.toLocaleString()}원</span>
              </div>
              
              <button 
                className="order-button"
                onClick={onOrder}
              >
                주문하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShoppingCart
