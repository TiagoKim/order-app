const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// 주문 번호 생성 함수
const generateOrderNumber = () => {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${dateStr}-${randomNum}`;
};

// GET /api/orders - 주문 목록 조회 (관리자용)
router.get('/', async (req, res) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query;
    
    let whereClause = '';
    let queryParams = [];
    
    if (status) {
      whereClause = 'WHERE o.status = $1';
      queryParams.push(status);
    }
    
    const query = `
      SELECT 
        o.*,
        COALESCE(
          json_agg(
            json_build_object(
              'menu_name', m.name,
              'quantity', oi.quantity,
              'unit_price', oi.unit_price,
              'total_price', oi.total_price,
              'options', oi.options
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menus m ON oi.menu_id = m.id
      ${whereClause}
      GROUP BY o.id
      ORDER BY o.order_time DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;
    
    queryParams.push(parseInt(limit), parseInt(offset));
    
    const result = await pool.query(query, queryParams);
    
    // 총 개수 조회
    const countQuery = status 
      ? 'SELECT COUNT(*) FROM orders WHERE status = $1'
      : 'SELECT COUNT(*) FROM orders';
    const countParams = status ? [status] : [];
    const countResult = await pool.query(countQuery, countParams);
    
    res.json({
      success: true,
      data: {
        orders: result.rows,
        total: parseInt(countResult.rows[0].count),
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
router.get('/stats', async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(*) as total_orders,
        COUNT(*) FILTER (WHERE status = 'received') as received_orders,
        COUNT(*) FILTER (WHERE status = 'preparing') as preparing_orders,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_orders,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_orders
      FROM orders
    `;
    
    const result = await pool.query(query);
    const stats = result.rows[0];
    
    res.json({
      success: true,
      data: {
        total_orders: parseInt(stats.total_orders),
        received_orders: parseInt(stats.received_orders),
        preparing_orders: parseInt(stats.preparing_orders),
        completed_orders: parseInt(stats.completed_orders),
        cancelled_orders: parseInt(stats.cancelled_orders)
      },
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
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        o.*,
        COALESCE(
          json_agg(
            json_build_object(
              'menu_name', m.name,
              'quantity', oi.quantity,
              'unit_price', oi.unit_price,
              'total_price', oi.total_price,
              'options', oi.options
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menus m ON oi.menu_id = m.id
      WHERE o.id = $1
      GROUP BY o.id
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '해당 주문을 찾을 수 없습니다.',
        error_code: 'ORDER_NOT_FOUND'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
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
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
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
    
    await client.query('BEGIN');
    
    // 주문 번호 생성
    const order_number = generateOrderNumber();
    
    // 총 금액 계산
    let total_amount = 0;
    for (const item of items) {
      total_amount += (item.unit_price || 0) * (item.quantity || 0);
    }
    
    // 주문 생성
    const orderResult = await client.query(
      `INSERT INTO orders (order_number, total_amount, customer_name, customer_phone, notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, order_time`,
      [order_number, total_amount, customer_name || null, customer_phone || null, notes || null]
    );
    
    const orderId = orderResult.rows[0].id;
    const orderTime = orderResult.rows[0].order_time;
    
      // 주문 아이템 생성
      for (const item of items) {
        const unit_price = item.unit_price || 0;
        const quantity = item.quantity || 0;
        const total_price = unit_price * quantity;
        
        await client.query(
          `INSERT INTO order_items (order_id, menu_id, quantity, unit_price, total_price, options)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [orderId, item.menu_id, quantity, unit_price, total_price, JSON.stringify(item.options || [])]
        );
        
        // 재고 차감
        if (item.menu_id) {
          const updateResult = await client.query(
            'UPDATE menus SET stock_quantity = stock_quantity - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [quantity, item.menu_id]
          );
          
          if (updateResult.rowCount === 0) {
            throw new Error(`메뉴 ID ${item.menu_id}를 찾을 수 없습니다.`);
          }
        }
      }
    
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      data: {
        order_id: orderId,
        order_number,
        total_amount,
        order_time: orderTime
      },
      message: '주문이 성공적으로 생성되었습니다.'
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('주문 생성 에러:', error);
    console.error('에러 스택:', error.stack);
    res.status(500).json({
      success: false,
      message: '주문 생성 중 오류가 발생했습니다.',
      error_code: 'DATABASE_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    client.release();
  }
});

// PUT /api/orders/:id/status - 주문 상태 변경
router.put('/:id/status', async (req, res) => {
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
    
    // 주문 존재 여부 확인
    const orderCheck = await pool.query(
      'SELECT id, order_number FROM orders WHERE id = $1',
      [id]
    );
    
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '해당 주문을 찾을 수 없습니다.',
        error_code: 'ORDER_NOT_FOUND'
      });
    }
    
    // 상태 업데이트
    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, order_number, status',
      [status, id]
    );
    
    res.json({
      success: true,
      data: result.rows[0],
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