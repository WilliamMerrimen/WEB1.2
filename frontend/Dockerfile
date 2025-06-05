# Используем официальный образ nginx
FROM nginx:alpine

# Метаданные образа
LABEL maintainer="your.email@example.com"
LABEL version="2.0.0"
LABEL description="Portfolio Frontend with Comments System"

# Удаляем дефолтную страницу nginx
RUN rm -rf /usr/share/nginx/html/*

# Копируем HTML файл в корень
COPY public/index.html /usr/share/nginx/html/

# Копируем папку src со стилями и скриптами
COPY src/ /usr/share/nginx/html/src/

# Копируем кастомную конфигурацию nginx для проксирования API
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Устанавливаем правильные права доступа
RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

# Экспонируем порт
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# nginx запускается автоматически