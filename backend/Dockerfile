FROM node:lts-alpine
ENV NODE_ENV=development
WORKDIR /backend
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --development --silent && mv node_modules ../
COPY . .
EXPOSE 5050
RUN chown -R node /backend
USER node
CMD ["npm", "dev"]

