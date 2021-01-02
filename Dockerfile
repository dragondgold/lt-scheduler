ARG ENVIRONMENT=production

###################################################
###              Node.js build image            ###
###################################################
FROM node:14.15.3-alpine3.12 as node-builder
ARG ENVIRONMENT
ENV NODE_ENV=${ENVIRONMENT}
WORKDIR /usr/app/main

COPY package.json ./
COPY .eslint* ./
COPY .prettier* ./
COPY tsconfig.json ./
RUN npm install

COPY src ./src
RUN npm run build:${ENVIRONMENT}

###################################################
###                 Runtime Image               ###
###################################################
FROM node:14.15.3-alpine3.12 as app
WORKDIR /usr/app/main

# Copy the Node.js app
COPY --from=node-builder /usr/app/main/dist dist/
COPY --from=node-builder /usr/app/main/node_modules node_modules/

EXPOSE 3000
CMD ["node", "dist/app.js"]