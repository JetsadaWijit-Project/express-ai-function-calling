# Use an official Node.js image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the app files
COPY . .

# Expose port 3000
EXPOSE 3000

# Run the app
CMD ["npm", "start"]