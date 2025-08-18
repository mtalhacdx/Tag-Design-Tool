// React + Fabric.js Canvas Starter Component
// Save this as CanvasApp.jsx or similar if using a build system, or include in script.js for CDN setup

const { useEffect, useRef } = React;

function CanvasApp() {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  useEffect(() => {
    // Initialize Fabric.js canvas
    fabricRef.current = new fabric.Canvas(canvasRef.current, {
      backgroundColor: '#fff',
      selection: true,
    });
    // Example: Add a rectangle on mount
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'lightblue',
      width: 100,
      height: 60,
    });
    fabricRef.current.add(rect);
    // Cleanup on unmount
    return () => {
      fabricRef.current.dispose();
    };
  }, []);

  return (
    React.createElement('div', { style: { border: '1px solid #ccc', width: 800, height: 600 } },
      React.createElement('canvas', {
        ref: canvasRef,
        width: 800,
        height: 600,
        style: { display: 'block' }
      })
    )
  );
}

// Mount the app (for CDN setup)
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(CanvasApp));
