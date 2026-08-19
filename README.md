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

## Native deployment with systemd

This option requires Linux with systemd, Node.js, MongoDB, and Redis installed. Configure `.env` first, then update the placeholders in `app.service`:

```ini
User=YOUR_LINUX_USER
Group=YOUR_LINUX_USER
WorkingDirectory=PATH_TO_PROJECT
ExecStart=/usr/bin/node PATH_TO_DIST_INDEXJS
```

Set `User` and `Group` to the Linux account that owns the project. Set `WorkingDirectory` to the absolute project path and replace `PATH_TO_DIST_INDEXJS` with the absolute path to `dist/index.js`. Use `which node` to find the Node.js path when it is not `/usr/bin/node`.

Run the deployment from the project directory:

```bash
chmod +x deploy.sh
./deploy.sh native
```

The script builds the application, installs `app.service` in `/etc/systemd/system` when the service is inactive or missing, reloads systemd, and restarts the application. It asks for `sudo` permission when it installs or restarts the service.

Enable the service once so it starts automatically after a server restart:

```bash
sudo systemctl enable app.service
```

Check status and logs with:

```bash
sudo systemctl status app.service
sudo journalctl -u app.service -f
```

When changing `app.service` while the service is running, install the changed file manually and reload systemd:

```bash
sudo cp app.service /etc/systemd/system/app.service
sudo systemctl daemon-reload
sudo systemctl restart app.service
```

## How to run with docker

```bash
docker compose up -d --build
```

Or use the deployment script, which verifies Docker before starting the containers:

```bash
chmod +x deploy.sh
./deploy.sh docker
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

