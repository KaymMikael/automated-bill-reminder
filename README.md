# Remindly: Automated Bill Reminder

Remindly is a NestJS-based application that helps users track bills and receive automated reminders before due dates.  
It solves the common problem of forgetting to pay bills like electricity, rent, or subscriptions.

---

## 🚀 Features
- **User Authentication** (JWT-based)
- **Add Bills** with description, amount, and due date
- **Update Bill Payment Status** (pending → paid)
- **Bills List View** (filterable, sortable, paginated)
- **Automated Reminders** sent via email before due dates
- **Daily Cron Job** to check pending reminders and notify users

---

## 🛠️ Tech Stack
- **NestJS** (framework)
- **Sequelize** (ORM)
- **PostgreSQL** (database)
- **JWT** (authentication)
- **@nestjs-modules/mailer** with **Handlebars** templates (email reminders)
- **Cron Jobs** via `@nestjs/schedule`

---

## 📂 Project Structure
- `src/auth` → Authentication (login, logout, current user)
- `src/users` → User management (create user)
- `src/bills` → Bill management (create, list, update status)
- `src/reminders` → Reminder service (cron job + email notifications)
- `src/templates` → Email templates (`reminder.hbs`)

---

## ⚙️ Configuration
Environment variables (example for `.env`):

```env
APP_DB_HOST=localhost
APP_DB_PORT=5432
APP_DB_USERNAME=postgres
APP_DB_PASSWORD=postgres
APP_DB_NAME=remindly
APP_JWT_SECRET=supersecretkey
```

---

## ▶️ Running the App
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start in development mode:
   ```bash
   npm run start:dev
   ```
3. Build and run:
   ```bash
   npm run build
   npm run start:prod
   ```

---

## 📧 Email Reminders
- Uses **Ethereal Email** (for testing) by default.
- Templates are stored in `src/templates/reminder.hbs`.
- Example reminder email includes bill description, amount, and due date.

---

## 🔒 Authentication Endpoints
- `POST /auth/login` → Login with credentials
- `GET /auth/me` → Get current user (requires JWT)
- `DELETE /auth/logout` → Logout

---

## 💳 Bills Endpoints
- `POST /bills` → Create a new bill
- `GET /bills` → Get user bills (filter/sort/paginate)
- `PATCH /bills/update-status/:billId` → Update bill status

---

## ⏰ Reminders
- Cron job runs **daily at midnight**.
- Finds pending reminders due today.
- Sends email notifications.
- Marks reminders as `sent`.

---

## 📝 Notes
- `synchronize: true` in Sequelize config should **not** be used in production (risk of data loss).
- Replace Ethereal email credentials with a real SMTP provider for production.

---

This gives you a clean, developer‑friendly README that explains what Remindly does, how to run it, and what endpoints exist.  

Do you want me to also add **example API requests (with curl or HTTPie)** so new developers can test login, bill creation, and reminders right away?