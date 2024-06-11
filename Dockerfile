# Use the official Node.js 14 image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Rebuild bcrypt for the correct environment
RUN npm rebuild bcrypt --build-from-source

# Ensure nodemon is globally installed and has correct permissions
RUN npm install -g nodemon && chmod +x /usr/local/bin/nodemon

# Expose the port on which your application runs
EXPOSE 5005

# Set environment variables
ENV NODE_ENV=production

# Command to run the application
CMD ["npm", "start"]
