FROM node:14.9

# set working directory
WORKDIR /app

# add `/physim/node_modules/.bin` to $PATH
ENV PATH /physim/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent --force
RUN npm install react-scripts@3.4.1 -g --silent

# add app
COPY . ./

EXPOSE 3000

# start app
CMD ["npm", "start"]
