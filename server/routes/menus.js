const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// GET /api/menus - 사용 가능한 메뉴 목록 조회
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        m.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', o.id,
              'name', o.name,
              'price', o.price
            )
          ) FILTER (WHERE o.id IS NOT NULL),
          '[]'
        ) as options
      FROM menus m
      LEFT JOIN options o ON m.id = o.menu_id AND o.is_available = true
      WHERE m.is_available = true
      GROUP BY m.id
      ORDER BY m.category, m.name
    `;
    
    const result = await pool.query(query);
    
    res.json({
      success: true,
      data: result.rows,
      message: '메뉴 목록을 성공적으로 조회했습니다.'
    });
  } catch (error) {
    console.error('메뉴 조회 에러:', error);
    res.status(500).json({
      success: false,
      message: '메뉴 목록 조회 중 오류가 발생했습니다.',
      error_code: 'DATABASE_ERROR'
    });
  }
});

// GET /api/menus/inventory - 관리자용 재고 정보 조회
router.get('/inventory', async (req, res) => {
  try {
    const query = `
      SELECT id, name, stock_quantity
      FROM menus
      WHERE is_available = true
      ORDER BY category, name
    `;
    
    const result = await pool.query(query);
    
    res.json({
      success: true,
      data: result.rows,
      message: '재고 정보를 성공적으로 조회했습니다.'
    });
  } catch (error) {
    console.error('재고 조회 에러:', error);
    res.status(500).json({
      success: false,
      message: '재고 정보 조회 중 오류가 발생했습니다.',
      error_code: 'DATABASE_ERROR'
    });
  }
});

// PUT /api/menus/:id/inventory - 재고 수량 수정
router.put('/:id/inventory', async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_quantity } = req.body;
    
    // 입력 검증
    if (stock_quantity === undefined || stock_quantity < 0) {
      return res.status(400).json({
        success: false,
        message: '유효한 재고 수량을 입력해주세요.',
        error_code: 'INVALID_REQUEST'
      });
    }
    
    // 메뉴 존재 여부 확인
    const menuCheck = await pool.query(
      'SELECT id, name FROM menus WHERE id = $1',
      [id]
    );
    
    if (menuCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '해당 메뉴를 찾을 수 없습니다.',
        error_code: 'MENU_NOT_FOUND'
      });
    }
    
    // 재고 수량 업데이트
    const result = await pool.query(
      'UPDATE menus SET stock_quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, stock_quantity',
      [stock_quantity, id]
    );
    
    res.json({
      success: true,
      data: result.rows[0],
      message: '재고 수량이 성공적으로 업데이트되었습니다.'
    });
  } catch (error) {
    console.error('재고 수정 에러:', error);
    res.status(500).json({
      success: false,
      message: '재고 수량 수정 중 오류가 발생했습니다.',
      error_code: 'DATABASE_ERROR'
    });
  }
});

module.exports = router;