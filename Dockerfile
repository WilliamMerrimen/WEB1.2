# Используем официальный образ nginx
FROM nginx:alpine

# Метаданные образа
LABEL maintainer="luka117wm@icloud.com"
LABEL version="1.0.0"
LABEL description="Personal portfolio website"

# Удаляем дефолтную страницу nginx
RUN rm -rf /usr/share/nginx/html/*

# Копируем HTML файл в корень
COPY public/index.html /usr/share/nginx/html/

# Копируем папку src со стилями и скриптами
COPY src/ /usr/share/nginx/html/src/

# Устанавливаем правильные права доступа
RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

# Экспонируем порт
EXPOSE 80

# nginx запускается автоматически