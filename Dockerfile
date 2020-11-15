# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
# https://nodejs.org/en/about/releases/
FROM node:14

LABEL maintainer="mirsaes"
ENV NODE_ENV=production

# install image-magic, etc
RUN apt-get update && \
    apt-get -y install imagemagick \
        libimage-exiftool-perl \
        dcraw && \
    rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/phototime-server

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install --production

# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080

#CMD [ "npm", "start" , "--", "--host=0.0.0.0"]
CMD ["node", ".",  "--host=0.0.0.0"]
