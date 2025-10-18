const express = require('express');
const router = express.Router();

// 임시 주문 데이터 (나중에 데이터베이스로 대체)
let orders = [
  {
    id: 1,
    order_number: 'ORD-20240731-001',
    order_time: new Date('2024-07-31T13:00:00'),
    status: 'received',
    total_amount: 4000,
    customer_name: null,
    customer_phone: null,
    notes: null,
    items: [
      {
        menu_name: '아메리카노(ICE)',
        quantity: 1,
        unit_price: 4000,
        total_price: 4000,
        options: []
      }
    ]
  }
];

// 주문 번호 생성 함수
const generateOrderNumber = () => {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${dateStr}-${randomNum}`;
};

// GET /api/orders - 주문 목록 조회 (관리자용)
router.get('/', (req, res) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query;
    
    let filteredOrders = orders;
    
    // 상태별 필터링
    if (status) {
      filteredOrders = orders.filter(order => order.status === status);
    }
    
    // 페이지네이션
    const total = filteredOrders.length;
    const paginatedOrders = filteredOrders.slice(
      parseInt(offset), 
      parseInt(offset) + parseInt(limit)
    );
    
    res.json({
      success: true,
      data: {
        orders: paginatedOrders,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      },
      message: '주문 목록을 성공적으로 조회했습니다.'
    });
  } catch (error) {
    console.error('주문 목록 조회 에러:', error);
    res.status(500).json({
      success: false,
      message: '주문 목록 조회 중 오류가 발생했습니다.',
      error_code: 'DATABASE_ERROR'
    });
  }
});

// GET /api/orders/stats - 주문 통계 조회 (관리자 대시보드용)
router.get('/stats', (req, res) => {
  try {
    const stats = {
      total_orders: orders.length,
      received_orders: orders.filter(order => order.status === 'received').length,
      preparing_orders: orders.filter(order => order.status === 'preparing').length,
      completed_orders: orders.filter(order => order.status === 'completed').length,
      cancelled_orders: orders.filter(order => order.status === 'cancelled').length
    };
    
    res.json({
      success: true,
      data: stats,
      message: '주문 통계를 성공적으로 조회했습니다.'
    });
  } catch (error) {
    console.error('주문 통계 조회 에러:', error);
    res.status(500).json({
      success: false,
      message: '주문 통계 조회 중 오류가 발생했습니다.',
      error_code: 'DATABASE_ERROR'
    });
  }
});

// GET /api/orders/:id - 특정 주문 상세 정보 조회
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const order = orders.find(order => order.id === parseInt(id));
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: '해당 주문을 찾을 수 없습니다.',
        error_code: 'ORDER_NOT_FOUND'
      });
    }
    
    res.json({
      success: true,
      data: order,
      message: '주문 정보를 성공적으로 조회했습니다.'
    });
  } catch (error) {
    console.error('주문 조회 에러:', error);
    res.status(500).json({
      success: false,
      message: '주문 정보 조회 중 오류가 발생했습니다.',
      error_code: 'DATABASE_ERROR'
    });
  }
});

// POST /api/orders - 새 주문 생성
router.post('/', (req, res) => {
  try {
    const { items, customer_name, customer_phone, notes } = req.body;
    
    // 입력 검증
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: '주문 항목이 필요합니다.',
        error_code: 'INVALID_REQUEST'
      });
    }
    
    // 주문 번호 생성
    const order_number = generateOrderNumber();
    
    // 총 금액 계산
    let total_amount = 0;
    const order_items = items.map(item => {
      const unit_price = item.unit_price || 0;
      const total_price = unit_price * item.quantity;
      total_amount += total_price;
      
      return {
        menu_name: item.menu_name || '알 수 없는 메뉴',
        quantity: item.quantity,
        unit_price,
        total_price,
        options: item.options || []
      };
    });
    
    // 새 주문 생성
    const newOrder = {
      id: orders.length + 1,
      order_number,
      order_time: new Date(),
      status: 'received',
      total_amount,
      customer_name: customer_name || null,
      customer_phone: customer_phone || null,
      notes: notes || null,
      items: order_items
    };
    
    // 주문 추가
    orders.push(newOrder);
    
    res.status(201).json({
      success: true,
      data: {
        order_id: newOrder.id,
        order_number: newOrder.order_number,
        total_amount: newOrder.total_amount,
        order_time: newOrder.order_time
      },
      message: '주문이 성공적으로 생성되었습니다.'
    });
  } catch (error) {
    console.error('주문 생성 에러:', error);
    res.status(500).json({
      success: false,
      message: '주문 생성 중 오류가 발생했습니다.',
      error_code: 'DATABASE_ERROR'
    });
  }
});

// PUT /api/orders/:id/status - 주문 상태 변경
router.put('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // 입력 검증
    const validStatuses = ['received', 'preparing', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: '유효한 주문 상태를 입력해주세요.',
        error_code: 'INVALID_STATUS'
      });
    }
    
    // 주문 찾기
    const orderIndex = orders.findIndex(order => order.id === parseInt(id));
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '해당 주문을 찾을 수 없습니다.',
        error_code: 'ORDER_NOT_FOUND'
      });
    }
    
    // 상태 업데이트
    orders[orderIndex].status = status;
    
    res.json({
      success: true,
      data: {
        id: orders[orderIndex].id,
        order_number: orders[orderIndex].order_number,
        status: orders[orderIndex].status
      },
      message: '주문 상태가 성공적으로 업데이트되었습니다.'
    });
  } catch (error) {
    console.error('주문 상태 변경 에러:', error);
    res.status(500).json({
      success: false,
      message: '주문 상태 변경 중 오류가 발생했습니다.',
      error_code: 'DATABASE_ERROR'
    });
  }
});

module.exports = router;
