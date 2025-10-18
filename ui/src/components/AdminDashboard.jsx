import './AdminDashboard.css'

function AdminDashboard({ orderStats }) {
  return (
    <div className="admin-dashboard">
      <h2>관리자 대시보드</h2>
      <div className="dashboard-stats">
        <div className="stat-item">
          <span className="stat-label">총 주문</span>
          <span className="stat-value">{orderStats.total}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">주문 접수</span>
          <span className="stat-value">{orderStats.received}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">제조 중</span>
          <span className="stat-value">{orderStats.preparing}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">제조 완료</span>
          <span className="stat-value">{orderStats.completed}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">취소됨</span>
          <span className="stat-value">{orderStats.cancelled}</span>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
