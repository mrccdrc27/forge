# Laravel Project Setup

Welcome to your Laravel application! 🐘✨

## Prerequisites

- **PHP**: v8.2 or higher.
- **Composer**: PHP package manager.

## Getting Started

1. **Install Dependencies**:
   ```bash
   composer install
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Run Server**:
   ```bash
   php artisan serve
   ```

## Structure

- `app/`: Core logic.
- `routes/`: Web and API routes.
- `resources/views/`: Blade templates.
- `public/`: Entry point.
