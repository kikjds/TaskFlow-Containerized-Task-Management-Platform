# Task management app that notifies 

This app is managing task, notifies user every 7, 3, 1  days and 5 hours before deadline. User can mark down task as complete, edit and delete.

To run this app you need docker or nodejs with redis and mongodb instance running on your machine

## To run the project copy .env.example to .env file and configure

```env
PORT=3000
DB_URL="mongodb://user:password@localhost:27017/dbname"
SESSION_SECRET="your_session_secret"
DB_NAME="dbname"
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""
EMAIL_SERVICE="gmail"
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_email_password"
```

## How to run without docker:

```bash
npm run build
```
```bash
npm run start
```
Make sure you configure .env file and have running mongodb and Redis instance
## How to run with docker

```bash
docker compose up -d --build
```



## Tech Stack

### Frontend
- EJS
- Vanilla CSS

### Backend
- Node.js
- Express
- TypeScript

### Database
- MongoDB
- Mongoose

### Background Jobs
- BullMQ
- Redis

### Authentication
- Express Session
- bcrypt

