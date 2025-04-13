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
npm install --legacy-peer-deps
```

> Important: Use `--legacy-peer-deps` for client installation because react-canvas-draw has peer dependency conflicts with React 19.

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

## Drawing Troubleshooting

If you experience issues with your drawings, such as unwanted additions or disappearing strokes, try these solutions:

1. **Draw at a moderate speed**: Very fast strokes can cause synchronization issues.

2. **Let strokes complete**: Pause briefly between strokes to allow synchronization.

3. **Check network connection**: Ensure stable network connectivity between clients.

4. **Use Clear Canvas when things get out of sync**: The Clear Canvas button can reset everyone's view if drawings get corrupted.

5. **Refresh browsers**: If all else fails, have all users refresh their browsers to re-sync.

## Technical Information

### How CRDT Works in the App

This application uses Yjs, a CRDT (Conflict-free Replicated Data Type) framework that allows synchronization of shared data. Key aspects:

- Each drawing action is captured as a CRDT operation
- Operations are merged consistently across clients, regardless of arrival order
- The canvas state is shared through the Y.Doc structure
- WebSockets transmit the canvas updates between clients

### Synchronization Process

1. User draws on their canvas
2. The drawing is converted to Yjs updates
3. Updates are sent to the server
4. Server broadcasts to other clients
5. Other clients apply updates to their local Yjs documents
6. Canvas is updated to reflect the changes

## License

MIT

## Author

Created by [Your Name]

## Integrated Mode (Server-Side Rendering)

You can now run the application in an integrated mode where the server serves the client application. This simplifies deployment and allows you to run just a single server process.

### Running in Integrated Mode

```bash
# Build both client and server, then start the integrated application
./buildAndStart.sh
```

This script will:
1. Build the client application
2. Copy the client build files to the server directory
3. Build the server application
4. Start the server with the integrated client

### Accessing the Application

After starting in integrated mode, you can access the application at:

```
http://localhost:3000
```

You no longer need to run the client separately, as all the client files are served by the NestJS server.
