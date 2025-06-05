#!/bin/bash

echo "🔍 Проверка статуса Docker Compose сервисов"
echo "=============================================="

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "\n${BLUE}📊 Статус контейнеров:${NC}"
docker-compose ps

echo -e "\n${BLUE}🌐 Проверка Frontend (порт 8080):${NC}"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 | grep -q "200"; then
    echo -e "${GREEN}✅ Frontend доступен: http://localhost:8080${NC}"
else
    echo -e "${RED}❌ Frontend недоступен${NC}"
fi

echo -e "\n${BLUE}🚀 Проверка Backend API (порт 3000):${NC}"
if curl -s http://localhost:3000/api/health | grep -q "OK"; then
    echo -e "${GREEN}✅ Backend API работает: http://localhost:3000/api/health${NC}"
    
    # Проверка количества комментариев
    COMMENTS_COUNT=$(curl -s http://localhost:3000/api/comments/count | grep -o '"total":[0-9]*' | cut -d':' -f2)
    echo -e "${GREEN}💬 Комментариев в базе: $COMMENTS_COUNT${NC}"
else
    echo -e "${RED}❌ Backend API недоступен${NC}"
fi

echo -e "\n${BLUE}🗄️ Проверка базы данных MySQL (порт 3306):${NC}"
if docker-compose exec -T database mysqladmin ping -h localhost -u portfolio_user -pportfolio_password --silent; then
    echo -e "${GREEN}✅ MySQL база данных работает${NC}"
    
    # Проверка таблиц
    TABLES=$(docker-compose exec -T database mysql -u portfolio_user -pportfolio_password -D portfolio_db -e "SHOW TABLES;" --silent | wc -l)
    echo -e "${GREEN}📋 Таблиц в базе: $TABLES${NC}"
    
    # Проверка кодировки
    CHARSET=$(docker-compose exec -T database mysql -u portfolio_user -pportfolio_password -D portfolio_db -e "SHOW VARIABLES LIKE 'character_set_database';" --silent | awk '{print $2}')
    echo -e "${GREEN}🔤 Кодировка базы: $CHARSET${NC}"
else
    echo -e "${RED}❌ MySQL база данных недоступна${NC}"
fi

echo -e "\n${BLUE}🖥️ Проверка Adminer (порт 8081):${NC}"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8081 | grep -q "200"; then
    echo -e "${GREEN}✅ Adminer доступен: http://localhost:8081${NC}"
    echo -e "${YELLOW}   Логин: portfolio_user | Пароль: portfolio_password${NC}"
else
    echo -e "${RED}❌ Adminer недоступен${NC}"
fi

echo -e "\n${BLUE}📡 Проверка сетевого взаимодействия:${NC}"
if docker-compose exec -T backend curl -s http://database:3306 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend может подключиться к базе данных${NC}"
else
    echo -e "${RED}❌ Проблемы с подключением backend к базе${NC}"
fi

echo -e "\n${BLUE}💾 Использование ресурсов:${NC}"
echo "Контейнер          CPU %    Память"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" | grep portfolio

echo -e "\n${BLUE}📦 Информация о томах:${NC}"
docker volume ls | grep portfolio

echo -e "\n${BLUE}🔗 Полезные ссылки:${NC}"
echo -e "${GREEN}Frontend:${NC} http://localhost:8080"
echo -e "${GREEN}Backend API:${NC} http://localhost:3000/api/health"
echo -e "${GREEN}Adminer:${NC} http://localhost:8081"
echo -e "${GREEN}API Комментарии:${NC} http://localhost:3000/api/comments"

echo -e "\n${YELLOW}📝 Команды для отладки:${NC}"
echo "docker-compose logs -f [service_name]"
echo "docker-compose exec [service_name] sh"
echo "docker-compose restart [service_name]"

echo -e "\n${GREEN}🎉 Проверка завершена!${NC}"