FROM node:19-slim
USER root
WORKDIR /app
COPY package.json .
RUN npm install --force
RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*
COPY . .
EXPOSE 3333
CMD ["npm", "run", "start:dev"]