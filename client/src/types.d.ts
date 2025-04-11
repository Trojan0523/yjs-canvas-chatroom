declare module 'react-canvas-draw' {
  import React from 'react';

  interface Point {
    x: number;
    y: number;
  }

  interface Line {
    points: Point[];
    brushColor: string;
    brushRadius: number;
  }

  export interface CanvasDrawProps {
    onChange?: (canvas: CanvasDraw) => void;
    loadTimeOffset?: number;
    lazyRadius?: number;
    brushRadius?: number;
    brushColor?: string;
    catenaryColor?: string;
    gridColor?: string;
    backgroundColor?: string;
    hideGrid?: boolean;
    canvasWidth?: number;
    canvasHeight?: number;
    disabled?: boolean;
    imgSrc?: string;
    saveData?: string;
    immediateLoading?: boolean;
    hideInterface?: boolean;
    gridSizeX?: number;
    gridSizeY?: number;
    gridLineWidth?: number;
    hideGridX?: boolean;
    hideGridY?: boolean;
    enablePanAndZoom?: boolean;
    mouseZoomFactor?: number;
    zoomExtents?: {
      min: number;
      max: number;
    };
    clampLinesToDocument?: boolean;
  }

  class CanvasDraw extends React.Component<CanvasDrawProps> {
    clear: () => void;
    undo: () => void;
    getSaveData: () => string;
    loadSaveData: (saveData: string, immediate?: boolean) => void;
    getDataURL: (fileType?: string, useBgImage?: boolean) => string;
    drawLine: (line: Line) => void;
    eraseAll: () => void;
  }

  export default CanvasDraw;
}
