FROM node:18-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm ci --production || npm install --production
COPY src ./src
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "src/index.js"]
