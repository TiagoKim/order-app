import './InventoryManagement.css'

function InventoryManagement({ inventory, onUpdateInventory }) {
  const getStatusInfo = (quantity) => {
    if (quantity === 0) {
      return { status: '품절', className: 'status-out' }
    } else if (quantity < 5) {
      return { status: '주의', className: 'status-warning' }
    } else {
      return { status: '정상', className: 'status-normal' }
    }
  }

  const handleQuantityChange = (itemId, change) => {
    const currentQuantity = inventory.find(item => item.id === itemId)?.stock_quantity || 
                           inventory.find(item => item.id === itemId)?.quantity || 0
    const newQuantity = Math.max(0, currentQuantity + change)
    onUpdateInventory(itemId, newQuantity)
  }

  return (
    <div className="inventory-management">
      <h2>재고 현황</h2>
      <div className="inventory-grid">
        {inventory.map(item => {
          const quantity = item.stock_quantity || item.quantity || 0
          const statusInfo = getStatusInfo(quantity)
          return (
            <div key={item.id} className="inventory-item">
              <div className="item-header">
                <h3 className="item-name">{item.name}</h3>
                <span className={`status-badge ${statusInfo.className}`}>
                  {statusInfo.status}
                </span>
              </div>
              
              <div className="item-content">
                <div className="quantity-display">
                  <span className="quantity-label">현재 재고</span>
                  <span className="quantity-value">{quantity}개</span>
                </div>
                
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn decrease"
                    onClick={() => handleQuantityChange(item.id, -1)}
                    disabled={quantity <= 0}
                  >
                    -
                  </button>
                  <span className="quantity-number">{quantity}</span>
                  <button 
                    className="quantity-btn increase"
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default InventoryManagement
