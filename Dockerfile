# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
# Install dependencies
RUN npm install

COPY . .

# Build the NestJS application
RUN npm run build

# Stage 2: Create the final production image
FROM node:20-alpine AS production

# Set the working directory
WORKDIR /usr/src/app

# Only copy necessary files from the build stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY package.json .

# Set environment variables
ENV NODE_ENV production

# Expose port (must match the service port 3000)
EXPOSE 3000

# Start the application
CMD [ "node", "dist/main" ]
