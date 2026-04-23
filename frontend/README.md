# Recruitment System - Frontend (CustomTkinter)

Desktop приложение для управления кандидатами, вакансиями и мэтчами.

## Установка

### 1. Активировать виртуальное окружение

**Windows:**
```bash
.venv\Scripts\activate
```

**Mac/Linux:**
```bash
source .venv/bin/activate
```

### 2. Установить зависимости (если не установлены)

```bash
pip install -r requirements.txt
```

## Запуск

```bash
python main.py
```

## Структура проекта

```
frontend/
├── main.py                 # Точка входа
├── config.py               # Конфигурация приложения
├── requirements.txt        # Зависимости Python
│
├── api/                    # HTTP клиент и endpoints
│   ├── client.py          # Wrapper над requests
│   ├── candidates.py      # API для кандидатов
│   ├── vacancies.py       # API для вакансий
│   └── matches.py         # API для мэтчей
│
├── models/                 # Dataclasses для типизации
│   ├── candidate.py
│   ├── vacancy.py
│   └── match.py
│
├── services/              # Бизнес-логика (CRUD)
│   ├── candidate_service.py
│   ├── vacancy_service.py
│   └── match_service.py
│
├── ui/                    # UI компоненты (CustomTkinter)
│   ├── app.py            # Главное окно
│   ├── base_frame.py     # Базовый фрейм
│   ├── styles.py         # Стили и цвета
│   │
│   ├── pages/            # Страницы приложения
│   │   ├── candidates_page.py
│   │   ├── vacancies_page.py
│   │   ├── matches_page.py
│   │   └── create_match_page.py
│   │
│   └── components/        # Переиспользуемые компоненты
│       ├── table.py
│       ├── form_builder.py
│       ├── modal.py
│       └── status_bar.py
│
└── utils/                 # Утилиты
    ├── validators.py      # Валидация данных
    ├── formatters.py      # Форматирование данных
    └── exceptions.py      # Кастомные исключения
```

## Требования

- Python 3.8+
- Backend должен быть запущен на http://localhost:8000

## Зависимости

- **customtkinter** - Современный UI для desktop приложений
- **requests** - HTTP клиент для работы с API
- **python-dotenv** - Загрузка переменных окружения
- **Pillow** - Работа с изображениями

## Документация

Каждый модуль содержит TODO комментарии для указания, что нужно реализовать.
