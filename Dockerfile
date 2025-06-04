# Multi-stage build для оптимизации размера
FROM nginx:alpine as production

# Метаданные образа
LABEL maintainer="your.email@example.com"
LABEL version="1.0.0"
LABEL description="Personal portfolio website"

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S portfolio && \
    adduser -S portfolio -u 1001

# Копируем файлы проекта
COPY public/ /usr/share/nginx/html/
COPY src/ /usr/share/nginx/html/src/

# Копируем кастомную конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Устанавливаем правильные права доступа
RUN chown -R portfolio:portfolio /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Добавляем security headers и оптимизацию
RUN echo 'server_tokens off;' >> /etc/nginx/nginx.conf

# Экспонируем порт
EXPOSE 80

# Проверка здоровья контейнера
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]