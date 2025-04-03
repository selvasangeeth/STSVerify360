FROM node:20-alpine
WORKDIR /usr/src/app
COPY ["package.json", "./"]
RUN npm install --legacy-peer-deps
COPY . .
COPY .env ./
RUN apk add --no-cache tzdata
ENV TZ="America/New_York"
RUN date
RUN chown -R node /usr/src/app
USER node
RUN npm run build
RUN npm install serve
# EXPOSE 4000
ENTRYPOINT ["npm", "run", "serve"]
