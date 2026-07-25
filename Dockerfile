FROM node:22-alpine3.18 as development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine3.18 as production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=development /app/dist ./dist
COPY --from=development /app/public ./public
COPY --from=development /app/views ./views
EXPOSE 3000
CMD ["npm", "run", "start"]