FROM node:22-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the port the app runs on (default is 3000)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
