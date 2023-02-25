# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
# https://nodejs.org/en/about/releases/
FROM node:18 as builder

LABEL maintainer="mirsaes"

# install image-magic, etc
RUN apt-get update && \
    apt-get -y install imagemagick \
        libimage-exiftool-perl \
        dcraw && \
    rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /phototime-server

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# build
RUN npm install
#RUN npm install -g tslint typescript

# If you are building your code for production
#RUN npm ci --only=production
# Bundle app source
COPY . .
RUN npm run-script build

### 
FROM node:18 as app
LABEL maintainer="mirsaes"

WORKDIR /phototime-server

# install image-magic, etc
RUN apt-get update && \
    apt-get -y install imagemagick \
        libimage-exiftool-perl \
        dcraw && \
    rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

COPY package*.json ./
#COPY --from=builder /phototime-server/src ./src
#COPY --from=builder /phototime-server/tools ./tools

RUN npm install --production
RUN npm ci --only=production
COPY --from=builder /phototime-server/dist ./dist

EXPOSE 8080

#CMD [ "npm", "start" , "--", "--host=0.0.0.0"]
CMD ["node", ".",  "--host=0.0.0.0"]
