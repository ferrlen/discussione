FROM node:14
WORKDIR /usr/app/client


COPY package.json ./
RUN npm install --quiet

COPY . .

EXPOSE 8090
