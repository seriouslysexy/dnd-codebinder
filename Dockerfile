FROM node:12 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./

#Expose does nothing and we want this to happen at docker run anyway
#EXPOSE ${PORT}
CMD ["node", "index.js"]