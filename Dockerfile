FROM node:20-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose Next.js port
EXPOSE 3000

# Run in development mode
CMD ["npm", "run", "dev"]
