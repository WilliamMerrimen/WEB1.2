const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Устанавливаем кодировку для ответов
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'database',
    user: process.env.DB_USER || 'portfolio_user',
    password: process.env.DB_PASSWORD || 'portfolio_password',
    database: process.env.DB_NAME || 'portfolio_db',
    charset: 'utf8mb4',
    timezone: '+00:00',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool;

// Initialize database connection
async function initDatabase() {
    try {
        pool = mysql.createPool(dbConfig);
        console.log('✅ Database connected successfully');
        
        // Test connection
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        
        console.log('✅ Database connection tested successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        // Retry connection after 5 seconds
        setTimeout(initDatabase, 5000);
    }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Portfolio Backend API is running',
        timestamp: new Date().toISOString()
    });
});

// Get all comments
app.get('/api/comments', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, name, email, comment, created_at FROM comments ORDER BY created_at DESC'
        );
        res.json({
            success: true,
            comments: rows
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении комментариев'
        });
    }
});

// Add new comment
app.post('/api/comments', async (req, res) => {
    try {
        const { name, email, comment } = req.body;
        
        // Validation
        if (!name || !email || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Все поля обязательны для заполнения'
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Неверный формат email'
            });
        }
        
        // Insert comment
        const [result] = await pool.execute(
            'INSERT INTO comments (name, email, comment) VALUES (?, ?, ?)',
            [name, email, comment]
        );
        
        // Get the newly created comment
        const [newComment] = await pool.execute(
            'SELECT id, name, email, comment, created_at FROM comments WHERE id = ?',
            [result.insertId]
        );
        
        res.status(201).json({
            success: true,
            message: 'Комментарий успешно добавлен',
            comment: newComment[0]
        });
        
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при добавлении комментария'
        });
    }
});

// Delete comment (optional)
app.delete('/api/comments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await pool.execute(
            'DELETE FROM comments WHERE id = ?',
            [id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Комментарий не найден'
            });
        }
        
        res.json({
            success: true,
            message: 'Комментарий удален'
        });
        
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при удалении комментария'
        });
    }
});

// Get comments count
app.get('/api/comments/count', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT COUNT(*) as total FROM comments'
        );
        res.json({
            success: true,
            total: rows[0].total
        });
    } catch (error) {
        console.error('Error getting comments count:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при подсчете комментариев'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Эндпоинт не найден'
    });
});

// Start server
async function startServer() {
    await initDatabase();
    
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Backend server running on port ${PORT}`);
        console.log(`📝 API endpoints:`);
        console.log(`   GET  /api/health - Health check`);
        console.log(`   GET  /api/comments - Get all comments`);
        console.log(`   POST /api/comments - Add new comment`);
        console.log(`   GET  /api/comments/count - Get comments count`);
        console.log(`   DELETE /api/comments/:id - Delete comment`);
    });
}

startServer().catch(console.error);