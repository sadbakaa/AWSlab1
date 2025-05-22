# вибираємо легковаговий образ з Node.js
FROM node:18-alpine

# робоча папка
WORKDIR /app

# копіюємо package-файли та ставимо залежності
COPY package.json package-lock.json* ./
RUN npm install --production

# копіюємо решту коду
COPY . .

# порт, на якому слухаємо
EXPOSE 3000

# старт сервера
CMD ["npm", "start"]
