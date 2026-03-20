# Stage 1: Build the React Application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package manager files first to leverage Docker layer caching
COPY package.json package-lock.json ./

# Install dependencies strictly from the lockfile
RUN npm ci

# Copy the rest of the application code
COPY . .

# Accept build arguments for Vite environment variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_KEY
ARG VITE_API_URL

# Set them as environment variables so Vite can embed them into the static build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_KEY=$VITE_SUPABASE_KEY
ENV VITE_API_URL=$VITE_API_URL

# Build the Vite application for production
RUN npm run build

# Stage 2: Serve the application
FROM node:20-alpine

WORKDIR /app

# Install the 'serve' package globally to serve static files
RUN npm install -g serve

# Copy only the built assets from the previous stage
COPY --from=build /app/dist ./dist

# Expose port 5175
EXPOSE 5175

# Start 'serve' in Single Page Application mode (-s) on port 5175
CMD ["serve", "-s", "dist", "-l", "5175"]

