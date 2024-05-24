FROM node:19-slim

WORKDIR /app

COPY . .

RUN chown -R app /app

RUN npm install --force

RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*

EXPOSE 3333

CMD ["npm", "run", "start:dev"]