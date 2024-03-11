# Build stage
FROM node:16-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./
# If you're using yarn instead of npm, copy the yarn.lock file
# COPY yarn.lock ./

# Install dependencies
# Install dependencies
RUN npm install --legacy-peer-deps

# For yarn, use:
# RUN yarn install

# Copy the rest of your app's source code
COPY . .

# Build your app
RUN npm run build

# Serve stage
FROM nginx:alpine

# Copy built assets from the build stage to the serve stage
COPY --from=build /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
