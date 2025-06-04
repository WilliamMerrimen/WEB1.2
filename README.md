# 🚀 Personal Portfolio Website

Современное портфолио веб-разработчика, созданное с использованием лучших практик frontend-разработки и контейнеризации Docker.

## 🛠️ Технологии

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Контейнеризация**: Docker, Nginx
- **Стили**: CSS Custom Properties, Flexbox, CSS Grid
- **Доступность**: ARIA attributes, keyboard navigation
- **Производительность**: Optimized images, gzip compression

## 🏗️ Архитектура проекта

```
my-portfolio/
├── src/
│   ├── styles/
│   │   ├── main.css              # Основные стили и переменные
│   │   └── components/           # Модульные стили компонентов
│   │       ├── header.css
│   │       ├── about.css
│   │       └── footer.css
│   ├── js/
│   │   └── main.js              # JavaScript модули и функциональность
│   └── assets/
│       └── images/              # Изображения и иконки
├── public/
│   └── index.html              # Главная HTML страница
├── Dockerfile                  # Конфигурация Docker образа
├── nginx.conf                 # Настройки веб-сервера
├── .dockerignore             # Файлы, исключаемые из Docker контекста
├── package.json              # Метаданные проекта
└── README.md                # Документация
```

## 🚀 Быстрый старт

### Локальная разработка

1. **Клонирование репозитория**
   ```bash
   git clone https://github.com/yourusername/my-portfolio.git
   cd my-portfolio
   ```

2. **Открытие в браузере**
   ```bash
   # Простой способ
   open public/index.html
   
   # Или через локальный сервер
   npx http-server public -p 3000
   ```

### Docker контейнеризация

1. **Сборка образа**
   ```bash
   docker build -t your-dockerhub-username/my-portfolio .
   ```

2. **Локальный запуск**
   ```bash
   docker run -d -p 8080:80 your-dockerhub-username/my-portfolio
   ```

3. **Публикация в DockerHub**
   ```bash
   docker login
   docker push your-dockerhub-username/my-portfolio
   ```

## 🎯 Особенности

### 🎨 Дизайн
- Современный, адаптивный дизайн
- CSS Grid и Flexbox для лейаута
- Плавные анимации и переходы
- Темная/светлая схема через CSS переменные

### ⚡ Производительность
- Оптимизированные изображения
- Gzip сжатие
- Кэширование статических ресурсов
- Минимальный JavaScript footprint

### 🔒 Безопасность
- Security headers в nginx
- CSP (Content Security Policy)
- Скрытие версии сервера
- Запуск от непривилегированного пользователя

### ♿ Доступность
- Семантичный HTML
- ARIA атрибуты
- Keyboard navigation
- Skip links
- Высокий контраст

## 📱 Адаптивность

Сайт оптимизирован для всех устройств:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1200px+)

## 🧪 Тестирование

```bash
# Проверка синтаксиса HTML
npx htmlhint public/index.html

# Проверка CSS
npx stylelint "src/styles/**/*.css"

# Аудит производительности
npx lighthouse http://localhost:8080 --output=html --output-path=./report.html
```

## 🔧 Настройка

### Персонализация

1. **Обновите информацию о себе** в `public/index.html`
2. **Измените цветовую схему** в `src/styles/main.css` (CSS переменные)
3. **Добавьте свои проекты** в секцию portfolio
4. **Обновите контактную информацию**

### Переменные CSS

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #64748b;
    --text-color: #1e293b;
    /* ... */
}
```

## 📈 Метрики производительности

Целевые показатели:
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🌐 Деплой

### Docker Hub
```bash
# Строка для запуска вашего контейнера
docker run -d -p 80:80 your-dockerhub-username/my-portfolio
```

### Другие платформы
- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop папки `public`
- **GitHub Pages**: Push в `gh-pages` ветку

## 🤝 Контрибьюции

1. Fork проекта
2. Создайте feature ветку (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 👨‍💻 Автор

**Your Name**
- GitHub: [@Khon](https://github.com/WilliamMerrimen)
- Email: luka117wm@icloud.com

## 🙏 Благодарности

- [Nginx](https://nginx.org/) за отличный веб-сервер
- [Docker](https://docker.com/) за контейнеризацию
- [Inter Font](https://rsms.me/inter/) за красивый шрифт

---

⭐ **Не забудьте поставить звездочку, если проект оказался полезным!**