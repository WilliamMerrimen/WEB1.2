# 🚀 Portfolio Multi-Container Application

Современное портфолио веб-разработчика с системой комментариев, созданное с использованием Docker Compose.

## 📋 Состав проекта

- **Frontend**: Nginx + HTML/CSS/JavaScript (адаптивный дизайн)
- **Backend**: Node.js + Express API (система комментариев)
- **Database**: MySQL 8.0 (хранение комментариев)
- **Admin Panel**: Adminer (веб-интерфейс для управления БД)

## 🏗️ Архитектура

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │   Backend   │    │  Database   │
│  (Nginx)    │◄──►│ (Node.js)   │◄──►│  (MySQL)    │
│   Port 80   │    │  Port 3000  │    │  Port 3306  │
└─────────────┘    └─────────────┘    └─────────────┘
       ▲                                      ▲
       │                                      │
   Users Access                          ┌─────────────┐
                                        │   Adminer   │
                                        │  (Web UI)   │
                                        │  Port 8080  │
                                        └─────────────┘
```

## 🚀 Быстрый старт

### Вариант 1: Готовые образы из Docker Hub

```bash
# Скачать docker-compose файл
curl -O https://raw.githubusercontent.com/your-username/portfolio/main/docker-compose.production.yml

# Запустить все сервисы
docker-compose -f docker-compose.production.yml up -d
```

### Вариант 2: Полная сборка из исходников

```bash
# Клонировать репозиторий
git clone https://github.com/your-username/portfolio.git
cd portfolio

# Запустить сборку и деплой
docker-compose up -d --build
```

## 🔗 Доступные сервисы

После запуска будут доступны:

| Сервис | URL | Описание |
|--------|-----|----------|
| **Frontend** | http://localhost:8080 | Основной сайт портфолио |
| **Backend API** | http://localhost:3000/api | REST API для комментариев |
| **Database** | localhost:3306 | MySQL база данных |
| **Adminer** | http://localhost:8081 | Веб-интерфейс для управления БД |

## 📊 API Endpoints

### Комментарии
- `GET /api/health` - Проверка работоспособности
- `GET /api/comments` - Получить все комментарии
- `POST /api/comments` - Добавить новый комментарий
- `GET /api/comments/count` - Количество комментариев
- `DELETE /api/comments/:id` - Удалить комментарий

### Пример добавления комментария
```bash
curl -X POST http://localhost:3000/api/comments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Иван Петров",
    "email": "ivan@example.com", 
    "comment": "Отличное портфолио!"
  }'
```

## 🗄️ Подключение к базе данных

### Через Adminer (рекомендуется)
1. Откройте http://localhost:8081
2. Введите данные:
   - **Server**: `database`
   - **Username**: `portfolio_user`
   - **Password**: `portfolio_password`
   - **Database**: `portfolio_db`

### Через MySQL клиент
```bash
mysql -h localhost -P 3306 -u portfolio_user -pportfolio_password -D portfolio_db
```

## ⚙️ Переменные окружения

| Переменная | Значение по умолчанию | Описание |
|------------|----------------------|----------|
| `NODE_ENV` | `production` | Режим работы Node.js |
| `DB_HOST` | `database` | Хост базы данных |
| `DB_USER` | `portfolio_user` | Пользователь БД |
| `DB_PASSWORD` | `portfolio_password` | Пароль БД |
| `DB_NAME` | `portfolio_db` | Имя базы данных |

## 🛠️ Команды управления

```bash
# Запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка сервисов
docker-compose down

# Обновление образов
docker-compose pull
docker-compose up -d

# Перезапуск конкретного сервиса
docker-compose restart backend

# Масштабирование (несколько экземпляров backend)
docker-compose up -d --scale backend=2
```

## 🔧 Диагностика

### Проверка состояния сервисов
```bash
# Статус контейнеров
docker-compose ps

# Проверка здоровья API
curl http://localhost:3000/api/health

# Проверка подключения к БД
docker-compose exec database mysqladmin ping -u portfolio_user -pportfolio_password
```

### Просмотр логов
```bash
# Все сервисы
docker-compose logs

# Конкретный сервис
docker-compose logs backend
docker-compose logs database

# В реальном времени
docker-compose logs -f backend
```

## 📁 Структура проекта

```
portfolio/
├── frontend/
│   ├── public/index.html
│   ├── src/
│   │   ├── styles/
│   │   └── js/
│   ├── Dockerfile
│   └── nginx.conf
├── backend/
│   ├── app.js
│   ├── package.json
│   └── Dockerfile
├── database/
│   └── init.sql
├── docker-compose.yml
└── README.md
```

## 🚨 Требования

- **Docker**: версия 20.10+
- **Docker Compose**: версия 2.0+
- **Свободные порты**: 8080, 3000, 3306, 8081
- **ОС**: Linux, macOS, Windows (с WSL2)

## 🔒 Безопасность

⚠️ **Важно для продакшена:**
- Измените пароли баз данных
- Настройте SSL сертификаты
- Ограничьте доступ к портам
- Регулярно обновляйте образы

## 📚 Технологический стек

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Node.js, Express.js
- **Database**: MySQL 8.0
- **Контейнеризация**: Docker, Docker Compose
- **Веб-сервер**: Nginx
- **Управление БД**: Adminer

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature ветку
3. Внесите изменения
4. Отправьте Pull Request

## 📄 Лицензия

MIT License - см. файл [LICENSE](LICENSE)

## 👨‍💻 Автор

**Khon**
- GitHub: [@Khon](https://github.com/WilliamMerrimen/)
- Email: luka117wm@icloud.com

---

⭐ **Поставьте звездочку, если проект был полезен!**