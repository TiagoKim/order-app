import './AdminDashboard.css'

function AdminDashboard({ orderStats }) {
  // orderStats가 없거나 undefined인 경우 기본값 설정
  const stats = orderStats || {
    total_orders: 0,
    received_orders: 0,
    preparing_orders: 0,
    completed_orders: 0,
    cancelled_orders: 0
  }

  return (
    <div className="admin-dashboard">
      <h2>관리자 대시보드</h2>
      <div className="dashboard-stats">
        <div className="stat-item">
          <span className="stat-label">총 주문</span>
          <span className="stat-value">{stats.total_orders || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">주문 접수</span>
          <span className="stat-value">{stats.received_orders || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">제조 중</span>
          <span className="stat-value">{stats.preparing_orders || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">제조 완료</span>
          <span className="stat-value">{stats.completed_orders || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">취소됨</span>
          <span className="stat-value">{stats.cancelled_orders || 0}</span>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
