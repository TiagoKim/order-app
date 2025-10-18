const { Pool } = require('pg');
require('dotenv').config();

// 데이터베이스 연결 설정
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'cozy_coffee_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20, // 최대 연결 수
  idleTimeoutMillis: 30000, // 유휴 연결 타임아웃
  connectionTimeoutMillis: 2000, // 연결 타임아웃
});

// 연결 테스트
pool.on('connect', () => {
  console.log('✅ PostgreSQL 데이터베이스에 연결되었습니다.');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL 연결 오류:', err);
});

// 데이터베이스 초기화 함수
const initializeDatabase = async () => {
  try {
    // 데이터베이스가 존재하는지 확인하고 생성
    const adminPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: 'postgres', // 기본 postgres 데이터베이스에 연결
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
    });

    const dbName = process.env.DB_NAME || 'cozy_coffee_db';
    
    // 데이터베이스 존재 여부 확인
    const dbExists = await adminPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );

    if (dbExists.rows.length === 0) {
      console.log(`📦 데이터베이스 '${dbName}' 생성 중...`);
      await adminPool.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ 데이터베이스 '${dbName}' 생성 완료`);
    } else {
      console.log(`✅ 데이터베이스 '${dbName}' 이미 존재함`);
    }

    await adminPool.end();

    // 테이블 생성
    await createTables();
    
  } catch (error) {
    console.error('❌ 데이터베이스 초기화 오류:', error);
    throw error;
  }
};

// 테이블 생성 함수
const createTables = async () => {
  try {
    console.log('📋 테이블 생성 중...');

    // Menus 테이블
    await pool.query(`
      CREATE TABLE IF NOT EXISTS menus (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price INTEGER NOT NULL,
        image_url VARCHAR(500),
        stock_quantity INTEGER DEFAULT 0,
        category VARCHAR(50),
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Options 테이블
    await pool.query(`
      CREATE TABLE IF NOT EXISTS options (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price INTEGER DEFAULT 0,
        menu_id INTEGER REFERENCES menus(id) ON DELETE CASCADE,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Orders 테이블
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(20) UNIQUE NOT NULL,
        order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'received' CHECK (status IN ('received', 'preparing', 'completed', 'cancelled')),
        total_amount INTEGER NOT NULL,
        customer_name VARCHAR(100),
        customer_phone VARCHAR(20),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Order_Items 테이블
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        menu_id INTEGER REFERENCES menus(id),
        quantity INTEGER NOT NULL,
        unit_price INTEGER NOT NULL,
        total_price INTEGER NOT NULL,
        options JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 인덱스 생성
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_orders_order_time ON orders(order_time);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
    `);

    console.log('✅ 모든 테이블 생성 완료');

    // 초기 데이터 삽입
    await insertInitialData();

  } catch (error) {
    console.error('❌ 테이블 생성 오류:', error);
    throw error;
  }
};

// 초기 데이터 삽입
const insertInitialData = async () => {
  try {
    // 메뉴 데이터가 이미 있는지 확인
    const menuCount = await pool.query('SELECT COUNT(*) FROM menus');
    
    if (menuCount.rows[0].count === '0') {
      console.log('🌱 초기 메뉴 데이터 삽입 중...');

      // 메뉴 데이터 삽입
      const menuQueries = [
        {
          name: '아메리카노(ICE)',
          description: '시원하고 깔끔한 아이스 아메리카노',
          price: 4000,
          image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop&crop=center',
          stock_quantity: 10,
          category: 'coffee'
        },
        {
          name: '아메리카노(HOT)',
          description: '따뜻하고 진한 핫 아메리카노',
          price: 4000,
          image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop&crop=center',
          stock_quantity: 8,
          category: 'coffee'
        },
        {
          name: '카페라떼',
          description: '부드러운 우유와 에스프레소의 조화',
          price: 5000,
          image_url: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=300&h=200&fit=crop&crop=center',
          stock_quantity: 15,
          category: 'coffee'
        },
        {
          name: '카라멜 마키아토',
          description: '달콤한 카라멜과 에스프레소',
          price: 5500,
          image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b5650904?w=300&h=200&fit=crop&crop=center',
          stock_quantity: 12,
          category: 'coffee'
        },
        {
          name: '딸기 스무디',
          description: '상큼한 딸기와 요거트의 만남',
          price: 6000,
          image_url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&h=200&fit=crop&crop=center',
          stock_quantity: 7,
          category: 'smoothie'
        },
        {
          name: '망고 스무디',
          description: '달콤한 망고의 시원한 스무디',
          price: 6000,
          image_url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop&crop=center',
          stock_quantity: 9,
          category: 'smoothie'
        }
      ];

      for (const menu of menuQueries) {
        const result = await pool.query(
          'INSERT INTO menus (name, description, price, image_url, stock_quantity, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
          [menu.name, menu.description, menu.price, menu.image_url, menu.stock_quantity, menu.category]
        );
        
        const menuId = result.rows[0].id;

        // 옵션 데이터 삽입
        const options = [
          { name: '샷 추가', price: 500 },
          { name: '시럽 추가', price: 0 }
        ];

        for (const option of options) {
          await pool.query(
            'INSERT INTO options (name, price, menu_id) VALUES ($1, $2, $3)',
            [option.name, option.price, menuId]
          );
        }
      }

      console.log('✅ 초기 데이터 삽입 완료');
    } else {
      console.log('✅ 초기 데이터가 이미 존재함');
    }

  } catch (error) {
    console.error('❌ 초기 데이터 삽입 오류:', error);
    throw error;
  }
};

module.exports = {
  pool,
  initializeDatabase
};
