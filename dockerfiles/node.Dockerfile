FROM node:14
WORKDIR /usr/app/server


COPY package.json ./ 
RUN npm install --quiet


COPY . .

EXPOSE 3000 

