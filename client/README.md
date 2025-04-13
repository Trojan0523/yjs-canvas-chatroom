<!--
 * @Author: BuXiongYu
 * @Date: 2025-04-11 18:44:43
 * @LastEditors: BuXiongYu
 * @LastEditTime: 2025-04-11 19:14:47
 * @Description: 请填写简介
-->
# Simple CRDT Canvas Client

This is the frontend client for the collaborative canvas application. It uses React with Vite, Yjs for CRDT, and Socket.io for real-time communication.

## Setup Instructions

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

Note: We need `--legacy-peer-deps` because react-canvas-draw has older peer dependencies that are not compatible with React 19.

## Running the App

1. Make sure the server is running first (in the `server` directory).
2. Start the client:
```bash
npm run dev
```
3. Open your browser to the URL shown in the terminal (typically http://localhost:5173).

## Troubleshooting Drawing Issues

If you experience issues with the canvas, such as unwanted additions to your drawings or synchronization problems, you can try these solutions:

1. **Decrease drawing speed**: Sometimes making rapid strokes can cause synchronization issues.

2. **Refresh all connected clients**: If drawings get out of sync, having all users refresh their browser can help.

3. **Adjust network settings**: If you're running locally and still have issues, try:
   ```bash
   # In client/src/components/Canvas.tsx
   # Increase the debounce time from 50 to a higher value, e.g. 100ms:
   setTimeout(() => {
     isLocalUpdate.current = false;
   }, 100); // Increase from 50ms to 100ms
   ```

4. **Clear and restart**: When all else fails, use the "Clear Canvas" button to reset the canvas state for all connected users.

## Additional Notes

- Each client needs a modern browser that supports WebSockets and Canvas.
- Multiple people can draw simultaneously without conflicts thanks to the CRDT technology.
- Each room has a unique ID that can be shared with others to join the same canvas.
