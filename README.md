# Simple CRDT Chatroom Canvas

A collaborative drawing application that uses CRDT (Conflict-free Replicated Data Type) technology to allow multiple users to draw on the same canvas in real-time. Built with NestJS, TypeScript, Yjs, and React.

## Features

- Create or join drawing rooms with unique IDs
- Collaborate in real-time with other users
- CRDT-based synchronization using Yjs
- Adjustable brush color and size
- User presence awareness

## Technologies

- **Backend**: NestJS, WebSockets, Yjs
- **Frontend**: React, Vite, styled-components
- **CRDT Implementation**: Yjs

## Project Structure

- `client/` - React frontend application
- `server/` - NestJS backend server

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### Running the Application

1. Start the server:

```bash
cd server
npm run start:dev
```

2. Start the client:

```bash
cd client
npm run dev
```

3. Open your browser and navigate to the URL shown in the client terminal (usually http://localhost:5173)

4. Create a new room or join an existing one by entering the room ID

## How to Use

1. From the home page, either create a new room or join an existing one
2. Use the color picker to select your brush color
3. Adjust the brush size using the slider
4. Draw on the canvas
5. Share the room ID with others to collaborate
6. Use the "Clear Canvas" button to erase everything
7. Click "Exit Room" to return to the home page

## License

MIT

## Author

Created by [Your Name]
# simple-crdt-canvas-chatroom
