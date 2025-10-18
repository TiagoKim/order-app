import './Header.css'

function Header({ currentScreen, onScreenChange }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="brand">
          <span className="brand-name">COZY</span>
        </div>
        
        <nav className="navigation">
          <button 
            className={`nav-button ${currentScreen === 'order' ? 'active' : ''}`}
            onClick={() => onScreenChange('order')}
          >
            주문하기
          </button>
          <button 
            className={`nav-button ${currentScreen === 'admin' ? 'active' : ''}`}
            onClick={() => onScreenChange('admin')}
          >
            관리자
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
