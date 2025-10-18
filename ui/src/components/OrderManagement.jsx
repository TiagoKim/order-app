import './OrderManagement.css'

function OrderManagement({ orders, onUpdateOrderStatus }) {
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${month}월 ${day}일 ${hours}:${minutes}`
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'received':
        return { label: '주문 접수', className: 'status-received', buttonText: '제조 시작' }
      case 'preparing':
        return { label: '제조 중', className: 'status-preparing', buttonText: '제조 완료' }
      case 'completed':
        return { label: '제조 완료', className: 'status-completed', buttonText: null }
      case 'cancelled':
        return { label: '취소됨', className: 'status-cancelled', buttonText: null }
      default:
        return { label: '알 수 없음', className: 'status-unknown', buttonText: null }
    }
  }

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'received':
        return 'preparing'
      case 'preparing':
        return 'completed'
      default:
        return currentStatus
    }
  }

  const handleStatusUpdate = (orderId, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus)
    onUpdateOrderStatus(orderId, nextStatus)
  }

  if (orders.length === 0) {
    return (
      <div className="order-management">
        <h2>주문 현황</h2>
        <div className="empty-orders">
          <p>현재 주문이 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="order-management">
      <h2>주문 현황</h2>
      <div className="orders-list">
        {orders.map(order => {
          const statusInfo = getStatusInfo(order.status)
          return (
            <div key={order.id} className="order-item">
              <div className="order-header">
                <div className="order-time">
                  {formatDateTime(order.orderTime)}
                </div>
                <span className={`status-badge ${statusInfo.className}`}>
                  {statusInfo.label}
                </span>
              </div>
              
              <div className="order-content">
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item-detail">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">x {item.quantity}</span>
                      <span className="item-price">{item.price.toLocaleString()}원</span>
                    </div>
                  ))}
                </div>
                
                <div className="order-footer">
                  <div className="total-amount">
                    총 금액: <strong>{order.totalAmount.toLocaleString()}원</strong>
                  </div>
                  
                  {statusInfo.buttonText && (
                    <button 
                      className="status-button"
                      onClick={() => handleStatusUpdate(order.id, order.status)}
                    >
                      {statusInfo.buttonText}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OrderManagement
