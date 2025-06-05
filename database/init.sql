-- Установка кодировки для сессии
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Создание базы данных с правильной кодировкой
CREATE DATABASE IF NOT EXISTS portfolio_db 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

-- Использование базы данных
USE portfolio_db;

-- Создание пользователя для приложения
CREATE USER IF NOT EXISTS 'portfolio_user'@'%' IDENTIFIED BY 'portfolio_password';
GRANT ALL PRIVILEGES ON portfolio_db.* TO 'portfolio_user'@'%';
FLUSH PRIVILEGES;

-- Создание таблицы комментариев с правильной кодировкой
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT 'Имя автора комментария',
    email VARCHAR(150) NOT NULL COMMENT 'Email автора',
    comment TEXT NOT NULL COMMENT 'Текст комментария',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата создания',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Дата обновления',
    
    -- Индексы для производительности
    INDEX idx_created_at (created_at),
    INDEX idx_email (email)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Таблица комментариев портфолио';

-- Вставка тестовых данных с русскими комментариями
INSERT INTO comments (name, email, comment) VALUES 
('Алексей Петров', 'alexey@example.com', 'Отличное портфолио! 👍 Впечатляющие навыки веб-разработки и современный подход к созданию сайтов.'),
('Мария Иванова', 'maria@example.com', 'Очень профессиональный подход к созданию сайта! 🚀 Видно, что автор хорошо разбирается в технологиях. Удачи в карьере!'),
('Дмитрий Сидоров', 'dmitry@example.com', 'Красивый дизайн и хорошая функциональность! 🎨 Особенно понравилась адаптивность и плавные анимации.'),
('Анна Козлова', 'anna@example.com', 'Интересный проект! 💡 Видно, что вложено много труда и внимания к деталям. Система комментариев работает отлично!'),
('Сергей Николаев', 'sergey@example.com', 'Современные технологии и качественная реализация! 🔥 Docker Compose, API, база данных - всё на высшем уровне.');

-- Создание представления для статистики
CREATE VIEW comments_stats AS
SELECT 
    COUNT(*) as total_comments,
    COUNT(DISTINCT email) as unique_users,
    DATE(MAX(created_at)) as last_comment_date,
    DATE(MIN(created_at)) as first_comment_date
FROM comments;

-- Процедура для очистки старых комментариев
DELIMITER //
CREATE PROCEDURE CleanOldComments(IN days_old INT)
BEGIN
    DECLARE deleted_count INT DEFAULT 0;
    
    DELETE FROM comments 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL days_old DAY);
    
    SET deleted_count = ROW_COUNT();
    
    SELECT deleted_count as deleted_comments, 
           CONCAT('Удалено комментариев старше ', days_old, ' дней') as message;
END //
DELIMITER ;

-- Создание таблицы для логирования действий
CREATE TABLE IF NOT EXISTS comment_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action_type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    comment_id INT,
    user_email VARCHAR(150),
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_ip VARCHAR(45),
    user_agent TEXT,
    
    INDEX idx_action_time (action_time),
    INDEX idx_action_type (action_type)
) ENGINE=InnoDB 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Лог действий с комментариями';

-- Триггер для логирования добавления комментариев
DELIMITER //
CREATE TRIGGER comment_insert_log 
AFTER INSERT ON comments
FOR EACH ROW
BEGIN
    INSERT INTO comment_log (action_type, comment_id, user_email) 
    VALUES ('INSERT', NEW.id, NEW.email);
END //
DELIMITER ;

-- Триггер для логирования удаления комментариев
DELIMITER //
CREATE TRIGGER comment_delete_log 
BEFORE DELETE ON comments
FOR EACH ROW
BEGIN
    INSERT INTO comment_log (action_type, comment_id, user_email) 
    VALUES ('DELETE', OLD.id, OLD.email);
END //
DELIMITER ;

-- Создание функции для подсчета комментариев пользователя
DELIMITER //
CREATE FUNCTION GetUserCommentsCount(user_email VARCHAR(150))
RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE comment_count INT DEFAULT 0;
    
    SELECT COUNT(*) INTO comment_count
    FROM comments 
    WHERE email = user_email;
    
    RETURN comment_count;
END //
DELIMITER ;

-- Вывод информации о создании таблиц
SELECT 'База данных portfolio_db успешно инициализирована!' as status,
       COUNT(*) as initial_comments_count
FROM comments;