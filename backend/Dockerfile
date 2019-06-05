FROM node:8.12.0-jessie

WORKDIR /app

COPY . /app

RUN yarn install

# Only used for local testing - Heroku will ignore this and randomly
# assign a port
EXPOSE 3000

CMD ["yarn", "start"]