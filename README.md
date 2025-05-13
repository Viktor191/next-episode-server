# NextEpisode Server

📡 **NextEpisode Server** — это бэкенд-платформа для проекта NextEpisode, который позволяет пользователям отслеживать
выход новых сезонов сериалов и фильмов, получать уведомления и управлять избранным.

---

## 🚀 Стек технологий

- **Node.js** + **Express.js**
- **MongoDB** (через Mongoose)
- **TypeScript**
- **JWT** (аутентификация)
- **Zod** (валидация входных данных)
- **Nodemailer** + **Resend API** (рассылка email-уведомлений)
- **Google OAuth2** (авторизация через Google)
- **Cron** (периодическая проверка новых сезонов и фильмов)
- **Axios** (интеграция с TMDB API)
- **Helmet** (защита HTTP-заголовков)

---

## 📁 Структура проекта

```
src/
├── config/           # Конфигурации окружения
├── controllers/      # Контроллеры Express
├── cron/             # Планировщик задач (проверка новых сезонов и фильмов)
├── helpers/          # Утилиты (например, отправка почты)
├── models/           # Mongoose-схемы (User, Show)
├── routes/           # Роутинг Express
├── services/         # Бизнес-логика (уведомления и пр.)
├── types/            # Типы TypeScript
└── server.ts         # Точка входа
```

---

## ⚙️ Установка и запуск

### 1. Установка зависимостей

```bash
npm install
```

### 2. Переменные окружения

Создайте файл `.env` на основе примера и укажите:

```
PORT=3000
MONGO_URI=ваша_строка_подключения
JWT_SECRET=секрет_токена
GOOGLE_CLIENT_ID=ваш_google_client_id
EMAIL_FROM=no-reply@nextepisode.top
EMAIL_PASSWORD=пароль_или_API_ключ
RESEND_API_KEY=ваш_resend_api_key
CLIENT_URL=http://localhost:5173
```

### 3. Запуск в dev-режиме

```bash
npm run start
```

### 4. Сборка и запуск в production

```bash
npm run build
npm run serve
```

---

## 🔐 Аутентификация

- JWT-авторизация (middleware `authenticateToken`)
- Google OAuth вход
- Сброс пароля через email

---

## 📬 Уведомления

- Уведомления о выходе новых сезонов сериалов
- Уведомления о релизе добавленных фильмов
- Отправка через Resend или Nodemailer
- Возможность отключить уведомления в профиле (`notify: false`)

---

## 📡 Интеграции

- Получение данных о шоу и фильмах через TMDB API
- Поддержка локализации (язык `ru-RU`)

---

## 📌 Возможности API

- Регистрация / вход / сброс пароля
- Добавление/удаление избранного (сериалы и фильмы)
- Получение списка избранного и предстоящих релизов
- Обновление email и telegram
- Настройка уведомлений

---

## Проект можно посмотреть по адресу [https://nextepisode.top](https://nextepisode.top).