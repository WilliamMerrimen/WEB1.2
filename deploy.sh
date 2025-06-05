#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Конфигурация
DOCKER_USERNAME="luka117wm"
FRONTEND_IMAGE="$DOCKER_USERNAME/portfolio-frontend"
BACKEND_IMAGE="$DOCKER_USERNAME/portfolio-backend"
VERSION="v2.0"

echo -e "${BLUE}🚀 Начинаем деплой портфолио на Docker Hub${NC}"
echo "=============================================="

# Проверка авторизации в Docker Hub
echo -e "\n${YELLOW}🔐 Проверка авторизации в Docker Hub...${NC}"

# Проверяем файл конфигурации Docker
if [ -f ~/.docker/config.json ] && grep -q "https://index.docker.io/v1/" ~/.docker/config.json; then
    echo -e "${GREEN}✅ Авторизация в Docker Hub подтверждена${NC}"
    DOCKER_USERNAME=$(cat ~/.docker/config.json | grep -A 10 "https://index.docker.io/v1/" | grep -o '"username":"[^"]*"' | cut -d'"' -f4 2>/dev/null || echo "luka117wm")
    echo -e "${BLUE}👤 Пользователь: $DOCKER_USERNAME${NC}"
else
    # Альтернативная проверка через docker system info
    if docker system info 2>/dev/null | grep -q "Username:"; then
        echo -e "${GREEN}✅ Авторизация в Docker Hub подтверждена${NC}"
        DOCKER_USERNAME=$(docker system info 2>/dev/null | grep "Username:" | awk '{print $2}' || echo "luka117wm")
    else
        echo -e "${YELLOW}⚠️ Не удается определить статус авторизации, но продолжаем...${NC}"
        # Используем username из скрипта
        if [ "$DOCKER_USERNAME" = "your-dockerhub-username" ]; then
            echo -e "${RED}❌ Необходимо изменить DOCKER_USERNAME в скрипте!${NC}"
            echo -e "${YELLOW}Измените строку: DOCKER_USERNAME=\"luka117wm\"${NC}"
            exit 1
        fi
    fi
fi

# Остановка текущих контейнеров
echo -e "\n${YELLOW}⏹️ Остановка текущих контейнеров...${NC}"
docker-compose down

# Сборка образов
echo -e "\n${BLUE}🔨 Сборка образов...${NC}"

echo -e "${YELLOW}📦 Сборка Frontend...${NC}"
if docker build -t $FRONTEND_IMAGE:latest -t $FRONTEND_IMAGE:$VERSION ./frontend; then
    echo -e "${GREEN}✅ Frontend собран успешно${NC}"
else
    echo -e "${RED}❌ Ошибка сборки Frontend${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Сборка Backend...${NC}"
if docker build -t $BACKEND_IMAGE:latest -t $BACKEND_IMAGE:$VERSION ./backend; then
    echo -e "${GREEN}✅ Backend собран успешно${NC}"
else
    echo -e "${RED}❌ Ошибка сборки Backend${NC}"
    exit 1
fi

# Пуш образов в Docker Hub
echo -e "\n${BLUE}☁️ Загрузка образов в Docker Hub...${NC}"

echo -e "${YELLOW}⬆️ Загрузка Frontend:latest...${NC}"
if docker push $FRONTEND_IMAGE:latest; then
    echo -e "${GREEN}✅ Frontend:latest загружен${NC}"
else
    echo -e "${RED}❌ Ошибка загрузки Frontend:latest${NC}"
    exit 1
fi

echo -e "${YELLOW}⬆️ Загрузка Frontend:$VERSION...${NC}"
if docker push $FRONTEND_IMAGE:$VERSION; then
    echo -e "${GREEN}✅ Frontend:$VERSION загружен${NC}"
else
    echo -e "${RED}❌ Ошибка загрузки Frontend:$VERSION${NC}"
    exit 1
fi

echo -e "${YELLOW}⬆️ Загрузка Backend:latest...${NC}"
if docker push $BACKEND_IMAGE:latest; then
    echo -e "${GREEN}✅ Backend:latest загружен${NC}"
else
    echo -e "${RED}❌ Ошибка загрузки Backend:latest${NC}"
    exit 1
fi

echo -e "${YELLOW}⬆️ Загрузка Backend:$VERSION...${NC}"
if docker push $BACKEND_IMAGE:$VERSION; then
    echo -e "${GREEN}✅ Backend:$VERSION загружен${NC}"
else
    echo -e "${RED}❌ Ошибка загрузки Backend:$VERSION${NC}"
    exit 1
fi

# Создание docker-compose для продакшена
echo -e "\n${BLUE}📄 Создание production docker-compose.yml...${NC}"
cat > docker-compose.production.yml << EOF
version: '3.8'

services:
  frontend:
    image: $FRONTEND_IMAGE:latest
    container_name: portfolio-frontend
    ports:
      - "8080:80"
    depends_on:
      - backend
    networks:
      - portfolio-network
    restart: unless-stopped

  backend:
    image: $BACKEND_IMAGE:latest
    container_name: portfolio-backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DB_HOST=database
      - DB_USER=portfolio_user
      - DB_PASSWORD=portfolio_password
      - DB_NAME=portfolio_db
    depends_on:
      - database
    networks:
      - portfolio-network
    restart: unless-stopped

  database:
    image: mysql:8.0
    container_name: portfolio-database
    environment:
      - MYSQL_ROOT_PASSWORD=root_password
      - MYSQL_DATABASE=portfolio_db
      - MYSQL_USER=portfolio_user
      - MYSQL_PASSWORD=portfolio_password
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - portfolio-network
    restart: unless-stopped
    command: 
      - --default-authentication-plugin=mysql_native_password
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci

  adminer:
    image: adminer:latest
    container_name: portfolio-adminer
    ports:
      - "8081:8080"
    depends_on:
      - database
    networks:
      - portfolio-network
    restart: unless-stopped

volumes:
  db_data:

networks:
  portfolio-network:
    driver: bridge
EOF

echo -e "${GREEN}✅ Production docker-compose.yml создан${NC}"

# Тестовый запуск
echo -e "\n${BLUE}🧪 Тестовый запуск с Docker Hub образами...${NC}"
if docker-compose -f docker-compose.production.yml up -d; then
    echo -e "${GREEN}✅ Тестовый запуск успешен${NC}"
    
    # Ожидание запуска сервисов
    echo -e "${YELLOW}⏳ Ожидание запуска сервисов (30 сек)...${NC}"
    sleep 30
    
    # Проверка здоровья
    echo -e "${YELLOW}🔍 Проверка работоспособности...${NC}"
    if curl -s http://localhost:3000/api/health | grep -q "OK"; then
        echo -e "${GREEN}✅ Backend API работает${NC}"
    else
        echo -e "${RED}❌ Backend API не отвечает${NC}"
    fi
    
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 | grep -q "200"; then
        echo -e "${GREEN}✅ Frontend доступен${NC}"
    else
        echo -e "${RED}❌ Frontend недоступен${NC}"
    fi
    
else
    echo -e "${RED}❌ Ошибка тестового запуска${NC}"
    exit 1
fi

# Информация о деплое
echo -e "\n${GREEN}🎉 Деплой завершен успешно!${NC}"
echo "=============================================="
echo -e "${BLUE}📦 Образы в Docker Hub:${NC}"
echo "  • $FRONTEND_IMAGE:latest"
echo "  • $FRONTEND_IMAGE:$VERSION"
echo "  • $BACKEND_IMAGE:latest" 
echo "  • $BACKEND_IMAGE:$VERSION"

echo -e "\n${BLUE}🔗 Ссылки для проверки:${NC}"
echo "  • Frontend: http://localhost:8080"
echo "  • Backend API: http://localhost:3000/api/health"
echo "  • Adminer: http://localhost:8081"

echo -e "\n${BLUE}📋 Команды для запуска на любом сервере:${NC}"
echo "  docker-compose -f docker-compose.production.yml up -d"

echo -e "\n${YELLOW}📝 Для отчета используйте эти команды:${NC}"
echo "  docker pull $FRONTEND_IMAGE:latest"
echo "  docker pull $BACKEND_IMAGE:latest"
echo "  docker-compose -f docker-compose.production.yml up -d"

echo -e "\n${GREEN}✨ Готово! Ваше портфолио теперь доступно в Docker Hub${NC}"