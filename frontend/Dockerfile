FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Install packages needed for building
RUN apk add --no-cache tzdata

# Set timezone
ENV TZ="Etc/UTC"

# Copy package.json and lock file
COPY package.json package-lock.json ./

# Install dependencies cleanly
RUN npm ci --legacy-peer-deps

# Copy only the required application code
COPY . .

# Fix permissions (user and group)
RUN chown -R node:node /usr/src/app

# Switch to non-root user
USER node

# Build app
RUN npm run build

# Start the application
ENTRYPOINT ["npm", "run", "start"]
