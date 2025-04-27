# Pizza Order Management System

A full-stack application built to help pizza restaurants efficiently manage their orders. This system provides real-time updates, order tracking, and status management to streamline restaurant operations.

## 📋 Features

- **Order Management**: View, sort, filter, and update orders in real-time
- **Status Tracking**: Monitor orders through their entire lifecycle (Received → Preparing → Ready → En Route → Delivered)
- **Responsive Dashboard**: Clean interface with order statistics and detailed information
- **Real-time Updates**: Changes reflect immediately across all connected devices

## 🔧 Tech Stack

### Backend
- **NestJS**: Modern, TypeScript-based Node.js framework
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **WebSockets**: Real-time bi-directional communication
- **In-Memory MongoDB**: Efficient development and testing

### Frontend
- **React**: UI library for building the interface
- **Ant Design**: UI component library for a polished look and feel
- **React Query**: Data fetching and state management
- **TypeScript**: Type safety and improved developer experience

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/kuzventures/orders-app.git
   cd orders-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up your environment variables

   For the API (.env file in apps/api directory):
   ```
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/pizza-orders
   USE_IN_MEMORY_DB=true  # Set to false to use real MongoDB

   # Server Configuration
   PORT=3000
   HOST=localhost

   # Enable database seeding with sample data
   SEED_DB=true
   ```

   For the client (.env file in apps/client directory):
   ```
   # API Configuration
   NX_API_URL=http://localhost:3000/api
   NX_WEBSOCKET_URL=http://localhost:3000
   NX_POLLING_INTERVAL=10000
   ```

4. Start the development servers
   ```bash
   # Start API
   nx serve api
   
   # Start client (in a new terminal)
   nx serve client
   ```

5. Open your browser to http://localhost:4200

## 🧑‍💻 Development

This project uses Nx as a build system and for managing the monorepo. 

Some useful commands:
```bash
# Build the types library
nx build types

# Build the API
nx build api

# Build the client
nx build client

# Lint a project
nx lint [project]

# Run tests
nx test [project]
```

## 🧪 Testing

The project includes a built-in memory database for testing, which can be enabled by setting `USE_IN_MEMORY_DB=true` in your .env file. This will automatically seed the database with 300 sample orders.

## 📝 Project Structure

```
apps/
├── api/          # NestJS backend application
├── client/       # React frontend application
libs/
├── types/        # Shared TypeScript interfaces and types
```

## 📚 API Documentation

The API exposes the following endpoints:

- `GET /api/orders` - Get all orders (with pagination and filtering)
- `GET /api/orders/active` - Get all active orders (not delivered)
- `PATCH /api/orders/:id/status` - Update an order's status
- `POST /api/orders` - Create a new order

WebSocket events:
- `orderCreated` - Emitted when a new order is created
- `orderUpdated` - Emitted when an order is updated

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.