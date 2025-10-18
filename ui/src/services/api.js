// API 서비스 - 백엔드와의 통신을 담당
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// 공통 API 호출 함수
const apiCall = async (endpoint, options = {}) => {
  try {
    console.log(`API 호출: ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log(`API 응답 상태: ${response.status}`);
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // JSON 파싱 실패 시 기본 메시지 사용
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API 호출 오류:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    }
    throw error;
  }
};

// 메뉴 관련 API
export const menuAPI = {
  // 메뉴 목록 조회
  getMenus: () => apiCall('/menus'),
  
  // 재고 정보 조회 (관리자용)
  getInventory: () => apiCall('/menus/inventory'),
  
  // 재고 수량 수정 (관리자용)
  updateInventory: (menuId, stockQuantity) => 
    apiCall(`/menus/${menuId}/inventory`, {
      method: 'PUT',
      body: JSON.stringify({ stock_quantity: stockQuantity }),
    }),
};

// 주문 관련 API
export const orderAPI = {
  // 주문 목록 조회 (관리자용)
  getOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/orders${queryString ? `?${queryString}` : ''}`);
  },
  
  // 특정 주문 조회
  getOrder: (orderId) => apiCall(`/orders/${orderId}`),
  
  // 새 주문 생성
  createOrder: (orderData) => 
    apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
  
  // 주문 상태 변경
  updateOrderStatus: (orderId, status) => 
    apiCall(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  
  // 주문 통계 조회 (관리자용)
  getOrderStats: () => apiCall('/orders/stats'),
};

// 에러 처리 유틸리티
export const handleAPIError = (error, defaultMessage = '오류가 발생했습니다.') => {
  console.error('API 에러:', error);
  
  if (error.message) {
    return error.message;
  }
  
  return defaultMessage;
};

// API 상태 확인
export const checkAPIHealth = async () => {
  try {
    const baseUrl = API_BASE_URL.replace('/api', '');
    const response = await fetch(`${baseUrl}/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('API 상태 확인 실패:', error);
    return false;
  }
};
