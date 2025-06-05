FROM node:18-alpine

# Метаданные
LABEL maintainer="luka117wm@icloud.com"
LABEL version="1.0.0"
LABEL description="Portfolio Backend API"

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S portfolio && \
    adduser -S portfolio -u 1001

# Создаем рабочую директорию
WORKDIR /app

# Копируем package files
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production && \
    npm cache clean --force

# Копируем исходный код
COPY app.js .

# Меняем владельца файлов
RUN chown -R portfolio:portfolio /app

# Переключаемся на непривилегированного пользователя
USER portfolio

# Экспонируем порт
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Запускаем приложение
CMD ["node", "app.js"]