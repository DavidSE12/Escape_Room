# Step 1: Base image
FROM node:20-alpine AS base
WORKDIR /escape-room

# Step 2: Install dependencies
COPY package*.json ./
RUN npm install

# Step 3: Copy source
COPY . .

# Step 4: Generate Prisma client
RUN npx prisma generate

# Step 5: Expose port
EXPOSE 3000

# Step 6: Start app when container runs
CMD ["npm", "run", "dev"]

