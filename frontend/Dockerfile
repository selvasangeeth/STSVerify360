FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and lock file for reproducible installs
COPY ["package.json", "package-lock.json*", "./"]

# Install dependencies with npm ci for a clean slate
RUN npm ci --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Copy environment variables
COPY .env ./

# Add timezone support
RUN apk add --no-cache tzdata
ENV TZ="Etc/UTC"

# Print current date (debugging step)
RUN date

# Ensure correct file permissions
RUN chown -R node /usr/src/app

# Run build before switching users
RUN npm run build

# Switch to non-root user
USER node

# Start the application
ENTRYPOINT ["npm", "run", "start"]