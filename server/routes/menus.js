const express = require('express');
const router = express.Router();

// 임시 메뉴 데이터 (나중에 데이터베이스로 대체)
const menus = [
  {
    id: 1,
    name: '아메리카노(ICE)',
    description: '시원하고 깔끔한 아이스 아메리카노',
    price: 4000,
    image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop&crop=center',
    stock_quantity: 10,
    category: 'coffee',
    is_available: true,
    options: [
      {
        id: 1,
        name: '샷 추가',
        price: 500
      },
      {
        id: 2,
        name: '시럽 추가',
        price: 0
      }
    ]
  },
  {
    id: 2,
    name: '아메리카노(HOT)',
    description: '따뜻하고 진한 핫 아메리카노',
    price: 4000,
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop&crop=center',
    stock_quantity: 8,
    category: 'coffee',
    is_available: true,
    options: [
      {
        id: 3,
        name: '샷 추가',
        price: 500
      },
      {
        id: 4,
        name: '시럽 추가',
        price: 0
      }
    ]
  },
  {
    id: 3,
    name: '카페라떼',
    description: '부드러운 우유와 에스프레소의 조화',
    price: 5000,
    image_url: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=300&h=200&fit=crop&crop=center',
    stock_quantity: 15,
    category: 'coffee',
    is_available: true,
    options: [
      {
        id: 5,
        name: '샷 추가',
        price: 500
      },
      {
        id: 6,
        name: '시럽 추가',
        price: 0
      }
    ]
  },
  {
    id: 4,
    name: '카라멜 마키아토',
    description: '달콤한 카라멜과 에스프레소',
    price: 5500,
    image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b5650904?w=300&h=200&fit=crop&crop=center',
    stock_quantity: 12,
    category: 'coffee',
    is_available: true,
    options: [
      {
        id: 7,
        name: '샷 추가',
        price: 500
      },
      {
        id: 8,
        name: '시럽 추가',
        price: 0
      }
    ]
  },
  {
    id: 5,
    name: '딸기 스무디',
    description: '상큼한 딸기와 요거트의 만남',
    price: 6000,
    image_url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&h=200&fit=crop&crop=center',
    stock_quantity: 7,
    category: 'smoothie',
    is_available: true,
    options: [
      {
        id: 9,
        name: '시럽 추가',
        price: 0
      }
    ]
  },
  {
    id: 6,
    name: '망고 스무디',
    description: '달콤한 망고의 시원한 스무디',
    price: 6000,
    image_url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop&crop=center',
    stock_quantity: 9,
    category: 'smoothie',
    is_available: true,
    options: [
      {
        id: 10,
        name: '시럽 추가',
        price: 0
      }
    ]
  }
];

// GET /api/menus - 사용 가능한 메뉴 목록 조회
router.get('/', (req, res) => {
  try {
    const availableMenus = menus.filter(menu => menu.is_available);
    
    res.json({
      success: true,
      data: availableMenus,
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
router.get('/inventory', (req, res) => {
  try {
    const inventoryData = menus.map(menu => ({
      id: menu.id,
      name: menu.name,
      stock_quantity: menu.stock_quantity
    }));
    
    res.json({
      success: true,
      data: inventoryData,
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
router.put('/:id/inventory', (req, res) => {
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
    
    // 메뉴 찾기
    const menuIndex = menus.findIndex(menu => menu.id === parseInt(id));
    if (menuIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '해당 메뉴를 찾을 수 없습니다.',
        error_code: 'MENU_NOT_FOUND'
      });
    }
    
    // 재고 수량 업데이트
    menus[menuIndex].stock_quantity = stock_quantity;
    
    res.json({
      success: true,
      data: {
        id: menus[menuIndex].id,
        name: menus[menuIndex].name,
        stock_quantity: menus[menuIndex].stock_quantity
      },
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
