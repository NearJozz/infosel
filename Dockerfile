FROM node:14.16.1
WORKDIR /njTestApp
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
RUN npm run setup
CMD ["npm","run","dev"]
