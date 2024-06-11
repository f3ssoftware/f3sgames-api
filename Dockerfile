# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory
WORKDIR /usr/src/app

# Install app dependencies by copying
# package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Build your app
RUN npm run build

# Expose port 3000 to the outside once the container has launched
EXPOSE 3000

# Define the command to run your app
CMD ["npm", "run", "start:prod"]
