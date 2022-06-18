FROM node:16-alpine

# set work directory inside container as /usr/app
WORKDIR /usr/app

# copy only files needed to install dependencies
COPY ./package.json /usr/app/
COPY ./yarn.lock /usr/app/

RUN npm --force install --global yarn
RUN yarn install

# copy application into the container
COPY . /usr/app/
# expose port 3333 to connections
EXPOSE 3334
# set user as generic node user
USER node

CMD yarn dev
