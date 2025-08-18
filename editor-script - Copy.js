// Editor App with Toolbar and Fabric.js Canvas
function EditorApp() {
    // Get URL parameters to check if editor should be shown
    const urlParams = new URLSearchParams(window.location.search);
    const selectedTemplate = urlParams.get('template') || 'Default Template';
    const selectedOrientation = urlParams.get('orientation') || 'Portrait';

    // Set editor as active when component loads
    React.useEffect(() => {
        sessionStorage.setItem('editorActive', 'true');
    }, []);

    // State for selected tool
    const [selectedTool, setSelectedTool] = React.useState('selection');
    const [strokeThickness, setStrokeThickness] = React.useState(2);
    const [selectedColor, setSelectedColor] = React.useState('#000000');
    const [fillColor, setFillColor] = React.useState('#ffffff');
    const [canvas, setCanvas] = React.useState(null);
    const [currentTemplate, setCurrentTemplate] = React.useState(selectedTemplate);

    // Template dimensions (at 96 PPI)
    const templateDimensions = {
        '1UP': { width: 816, height: 1056, name: 'US Letter (8.5" x 11")' },
        '1UP (LEGAL)': { width: 816, height: 1344, name: 'Legal (8.5" x 14")' },
        '2UP': { width: 816, height: 528, name: 'Half Letter (8.5" x 5.5")' },
        '4UP': { width: 408, height: 528, name: 'Quarter (4.25" x 5.5")' },
        '4UP(4.25 X 5.1)': { width: 408, height: 490, name: 'Custom (4.25" x 5.1")' },
        '8UP': { width: 204, height: 264, name: '8-up (2.125" x 2.75")' },
        '16UP': { width: 204, height: 132, name: '16-up (2.125" x 1.375")' },
        'Avery 5160': { width: 252, height: 96, name: 'Avery 5160 (2.625" x 1")' },
        'Avery 5163': { width: 384, height: 192, name: 'Avery 5163 (4" x 2")' },
        'Two Page': { width: 1632, height: 1056, name: 'Two Page (17" x 11")' },
        'Full Page': { width: 1200, height: 900, name: 'Full Page (Responsive)' }
    };

    // Template options for New dropdown
    const templateOptions = [
        '1UP',
        '1UP (LEGAL)',
        '2UP',
        '4UP',
        '4UP(4.25 X 5.1)',
        '8UP',
        '16UP',
        'Avery 5160',
        'Avery 5163',
        'Two Page',
        'Full Page'
    ];

    // State for dropdown visibility and popup
    const [showNewDropdown, setShowNewDropdown] = React.useState(false);
    const [showOrientationPopup, setShowOrientationPopup] = React.useState(false);
    const [selectedNewTemplate, setSelectedNewTemplate] = React.useState('');
    const [selectedNewOrientation, setSelectedNewOrientation] = React.useState('Portrait');
    const [isPopupMinimized, setIsPopupMinimized] = React.useState(false);
    const [isPopupMaximized, setIsPopupMaximized] = React.useState(false);
    const [showTemplateSelector, setShowTemplateSelector] = React.useState(false);

    // Initialize Fabric.js canvas
    React.useEffect(() => {
        // Always dispose previous canvas before creating a new one
        if (canvas) {
            canvas.dispose();
            setCanvas(null);
        }
        const fabricCanvas = new fabric.Canvas('designCanvas', {
            selection: true,
            preserveObjectStacking: true,
            imageSmoothingEnabled: false,
            allowTouchScrolling: false,
            fireRightClick: true,
            stopContextMenu: true,
            controlsAboveOverlay: true,
            includeDefaultValues: false
        });

        // Set initial canvas size
        const dimensions = templateDimensions[currentTemplate] || templateDimensions['1UP'];
        fabricCanvas.setDimensions({
            width: dimensions.width,
            height: dimensions.height
        });

        // Ensure no background
        fabricCanvas.setBackgroundColor('rgba(0,0,0,0)', fabricCanvas.renderAll.bind(fabricCanvas));
        fabricCanvas.backgroundImage = null;

        // Configure canvas settings
        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.cornerColor = '#4285f4';
        fabric.Object.prototype.cornerStyle = 'circle';
        fabric.Object.prototype.cornerSize = 8;
        fabric.Object.prototype.borderColor = '#4285f4';
        fabric.Object.prototype.borderScaleFactor = 2;

        setCanvas(fabricCanvas);

        // Cleanup function
        return () => {
            fabricCanvas.dispose();
        };
        // Re-run when template changes (to fully reset canvas)
    }, [currentTemplate]);

    // Update canvas size when template changes
    React.useEffect(() => {
        if (canvas && currentTemplate) {
            const dimensions = templateDimensions[currentTemplate] || templateDimensions['1UP'];
            canvas.setDimensions({
                width: dimensions.width,
                height: dimensions.height
            });
            // Ensure no background
            canvas.setBackgroundColor('rgba(0,0,0,0)', canvas.renderAll.bind(canvas));
            canvas.backgroundImage = null;
            canvas.renderAll();
        }
    }, [canvas, currentTemplate]);

    // Add grid background to canvas
    const addGridBackground = (fabricCanvas, dimensions) => {
        // No-op: background removed
    };

    // Fabric.js tool functions
    const fabricTools = {
        // Text tool
        addText: (text = 'Sample Text') => {
            if (!canvas) return;

            const textObj = new fabric.IText(text, {
                left: 100,
                top: 100,
                fontFamily: 'Arial',
                fontSize: 20,
                fill: selectedColor,
                editable: true
            });

            canvas.add(textObj);
            canvas.setActiveObject(textObj);
            canvas.renderAll();
        },

        // Rectangle tool
        addRectangle: () => {
            if (!canvas) return;

            const rect = new fabric.Rect({
                left: 100,
                top: 100,
                width: 100,
                height: 80,
                fill: fillColor,
                stroke: selectedColor,
                strokeWidth: strokeThickness
            });

            canvas.add(rect);
            canvas.setActiveObject(rect);
            canvas.renderAll();
        },

        // Circle tool
        addCircle: () => {
            if (!canvas) return;

            const circle = new fabric.Circle({
                left: 100,
                top: 100,
                radius: 50,
                fill: fillColor,
                stroke: selectedColor,
                strokeWidth: strokeThickness
            });

            canvas.add(circle);
            canvas.setActiveObject(circle);
            canvas.renderAll();
        },

        // Line tool
        addLine: () => {
            if (!canvas) return;

            const line = new fabric.Line([50, 100, 200, 100], {
                stroke: selectedColor,
                strokeWidth: strokeThickness
            });

            canvas.add(line);
            canvas.setActiveObject(line);
            canvas.renderAll();
        },

        // Triangle tool
        addTriangle: () => {
            if (!canvas) return;

            const triangle = new fabric.Triangle({
                left: 100,
                top: 100,
                width: 80,
                height: 80,
                fill: fillColor,
                stroke: selectedColor,
                strokeWidth: strokeThickness
            });

            canvas.add(triangle);
            canvas.setActiveObject(triangle);
            canvas.renderAll();
        },

        // Free drawing mode
        enableDrawing: () => {
            if (!canvas) return;

            canvas.isDrawingMode = !canvas.isDrawingMode;
            canvas.freeDrawingBrush.color = selectedColor;
            canvas.freeDrawingBrush.width = strokeThickness;
        },

        // Image upload
        addImage: () => {
            if (!canvas) return;

            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        fabric.Image.fromURL(event.target.result, (img) => {
                            img.scaleToWidth(200);
                            img.set({
                                left: 100,
                                top: 100
                            });
                            canvas.add(img);
                            canvas.setActiveObject(img);
                            canvas.renderAll();
                        });
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        },

        // Delete selected object
        deleteSelected: () => {
            if (!canvas) return;

            const activeObjects = canvas.getActiveObjects();
            canvas.discardActiveObject();
            canvas.remove(...activeObjects);
            canvas.renderAll();
        },

        // Copy selected object
        copySelected: () => {
            if (!canvas) return;

            const activeObject = canvas.getActiveObject();
            if (activeObject) {
                activeObject.clone((cloned) => {
                    canvas.clipboard = cloned;
                });
            }
        },

        // Paste object
        paste: () => {
            if (!canvas || !canvas.clipboard) return;

            canvas.clipboard.clone((clonedObj) => {
                clonedObj.set({
                    left: clonedObj.left + 10,
                    top: clonedObj.top + 10,
                    evented: true,
                });

                if (clonedObj.type === 'activeSelection') {
                    clonedObj.canvas = canvas;
                    clonedObj.forEachObject((obj) => {
                        canvas.add(obj);
                    });
                    clonedObj.setCoords();
                } else {
                    canvas.add(clonedObj);
                }

                canvas.setActiveObject(clonedObj);
                canvas.renderAll();
            });
        },

        // Clear canvas
        clearCanvas: () => {
            if (!canvas) return;

            canvas.clear();
            // Ensure no background
            canvas.setBackgroundColor('rgba(0,0,0,0)', canvas.renderAll.bind(canvas));
            canvas.backgroundImage = null;
            canvas.renderAll();
        },

        // Save canvas as JSON
        saveCanvas: () => {
            if (!canvas) return null;
            return JSON.stringify(canvas.toJSON());
        },

        // Load canvas from JSON
        loadCanvas: (jsonData) => {
            if (!canvas) return;

            canvas.loadFromJSON(jsonData, () => {
                canvas.renderAll();
            });
        },

        // Export canvas as image
        exportImage: (format = 'png') => {
            if (!canvas) return null;

            return canvas.toDataURL({
                format: format,
                quality: 1,
                multiplier: 2
            });
        },

        // Zoom functions
        zoomIn: () => {
            if (!canvas) return;

            const zoom = canvas.getZoom();
            canvas.setZoom(Math.min(zoom * 1.2, 3));
        },

        zoomOut: () => {
            if (!canvas) return;

            const zoom = canvas.getZoom();
            canvas.setZoom(Math.max(zoom / 1.2, 0.1));
        },

        resetZoom: () => {
            if (!canvas) return;
            canvas.setZoom(1);
            canvas.absolutePan(new fabric.Point(0, 0));
        },

        // Alignment functions
        alignLeft: () => {
            if (!canvas) return;

            const activeObjects = canvas.getActiveObjects();
            if (activeObjects.length > 1) {
                const leftmost = Math.min(...activeObjects.map(obj => obj.left));
                activeObjects.forEach(obj => obj.set('left', leftmost));
                canvas.renderAll();
            }
        },

        alignCenter: () => {
            if (!canvas) return;

            const activeObjects = canvas.getActiveObjects();
            if (activeObjects.length > 1) {
                const centerX = activeObjects.reduce((sum, obj) => sum + (obj.left + obj.width / 2), 0) / activeObjects.length;
                activeObjects.forEach(obj => obj.set('left', centerX - obj.width / 2));
                canvas.renderAll();
            }
        },

        alignRight: () => {
            if (!canvas) return;

            const activeObjects = canvas.getActiveObjects();
            if (activeObjects.length > 1) {
                const rightmost = Math.max(...activeObjects.map(obj => obj.left + obj.width));
                activeObjects.forEach(obj => obj.set('left', rightmost - obj.width));
                canvas.renderAll();
            }
        },

        // Layer functions
        bringToFront: () => {
            if (!canvas) return;

            const activeObject = canvas.getActiveObject();
            if (activeObject) {
                canvas.bringToFront(activeObject);
                canvas.renderAll();
            }
        },

        sendToBack: () => {
            if (!canvas) return;

            const activeObject = canvas.getActiveObject();
            if (activeObject) {
                canvas.sendToBack(activeObject);
                canvas.renderAll();
            }
        }
    };

    // Handle template change
    const handleTemplateChange = (template) => {
        setCurrentTemplate(template);
        setShowTemplateSelector(false);
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => {
            setShowNewDropdown(false);
        };

        if (showNewDropdown) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showNewDropdown]);

    // Keyboard shortcuts
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (!canvas) return;

            // Prevent default for our shortcuts
            if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'z', 'y', 'a', 's'].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }

            if (e.key === 'Delete' || e.key === 'Backspace') {
                fabricTools.deleteSelected();
            } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
                fabricTools.copySelected();
            } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
                fabricTools.paste();
            } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'x') {
                fabricTools.copySelected();
                fabricTools.deleteSelected();
            } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                // Undo functionality could be added here
                console.log('Undo requested');
            } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
                // Redo functionality could be added here
                console.log('Redo requested');
            } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
                canvas.discardActiveObject();
                const selection = new fabric.ActiveSelection(canvas.getObjects(), {
                    canvas: canvas,
                });
                canvas.setActiveObject(selection);
                canvas.requestRenderAll();
            } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                const jsonData = fabricTools.saveCanvas();
                localStorage.setItem('canvasData', jsonData);
                console.log('Canvas saved to localStorage');
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [canvas]);

    // Load saved canvas data on mount
    React.useEffect(() => {
        if (canvas) {
            const savedData = localStorage.getItem('canvasData');
            if (savedData) {
                try {
                    fabricTools.loadCanvas(savedData);
                } catch (error) {
                    console.log('Could not load saved canvas data:', error);
                }
            }
        }
    }, [canvas]);

    // Canvas container and ruler management
    React.useEffect(() => {
        if (canvas) {
            const canvasScrollContainer = document.getElementById('canvasScrollContainer');
            const topRuler = document.getElementById('topRuler');
            const leftRuler = document.getElementById('leftRuler');
            const canvasElement = document.getElementById('designCanvas');

            if (canvasScrollContainer && topRuler && leftRuler && canvasElement) {
                // Update container size based on canvas dimensions
                const updateContainerSize = () => {
                    const containerRect = canvasScrollContainer.getBoundingClientRect();
                    const canvasWidth = canvas.width;
                    const canvasHeight = canvas.height;

                    // Set container content size
                    const canvasWrapper = canvasScrollContainer.querySelector('.bg-white');
                    if (canvasWrapper) {
                        // If canvas is larger than container, set wrapper to canvas size
                        // If canvas is smaller, set wrapper to container size (centered canvas)
                        canvasWrapper.style.width = `${Math.max(canvasWidth, containerRect.width)}px`;
                        canvasWrapper.style.height = `${Math.max(canvasHeight, containerRect.height)}px`;

                        // Center canvas within wrapper if smaller than container
                        if (canvasWidth < containerRect.width && canvasHeight < containerRect.height) {
                            canvasWrapper.style.display = 'flex';
                            canvasWrapper.style.alignItems = 'center';
                            canvasWrapper.style.justifyContent = 'center';
                        } else {
                            canvasWrapper.style.display = 'block';
                            canvasWrapper.style.alignItems = '';
                            canvasWrapper.style.justifyContent = '';
                        }
                    }
                };

                // Update rulers based on canvas size
                const updateRulers = () => {
                    const INCH_PX = 48; // 1 inch = 48px (matches reference)
                    const TICK_PX = 6;  // 1/8 inch = 6px
                    const canvasWidthInches = Math.ceil(canvas.width / INCH_PX);
                    const canvasHeightInches = Math.ceil(canvas.height / INCH_PX);

                    // --- Top Ruler ---
                    const topRulerMarks = topRuler.querySelector('.ruler-marks');
                    if (topRulerMarks) {
                        topRulerMarks.style.width = `${canvasWidthInches * INCH_PX}px`;
                        topRulerMarks.innerHTML = '';
                        for (let i = 0; i <= canvasWidthInches * 8; i++) {
                            const x = i * TICK_PX;
                            let height = 8, color = '#bbb';
                            if (i % 8 === 0) { height = 40; color = '#222'; } // inch
                            else if (i % 4 === 0) { height = 13; color = '#666'; } // half
                            else if (i % 2 === 0) { height = 10; color = '#aaa'; } // quarter
                            // else eighth
                            const tick = document.createElement('div');
                            tick.className = 'absolute';
                            tick.style.left = `${x}px`;
                            tick.style.bottom = '0px';
                            tick.style.width = '1px';
                            tick.style.height = `${height}px`;
                            tick.style.background = color;
                            topRulerMarks.appendChild(tick);

                            // Inch label
                            if (i % 8 === 0) {
                                const mark = document.createElement('div');
                                mark.className = 'absolute text-xs font-bold text-gray-700';
                                mark.style.left = `${x + 2}px`;
                                mark.style.bottom = '2px';
                                mark.style.fontSize = '10px';
                                mark.style.userSelect = 'none';
                                mark.textContent = (i / 8).toString();
                                topRulerMarks.appendChild(mark);
                            }
                        }
                    }

                    // --- Left Ruler ---
                    const leftRulerMarks = leftRuler.querySelector('.ruler-marks');
                    if (leftRulerMarks) {
                        leftRulerMarks.style.height = `${canvasHeightInches * INCH_PX}px`;
                        leftRulerMarks.innerHTML = '';
                        for (let i = 0; i <= canvasHeightInches * 8; i++) {
                            const y = i * TICK_PX;
                            let width = 8, color = '#bbb';
                            if (i % 8 === 0) { width = 40; color = '#222'; } // inch
                            else if (i % 4 === 0) { width = 13; color = '#666'; } // half
                            else if (i % 2 === 0) { width = 10; color = '#aaa'; } // quarter
                            // else eighth
                            const tick = document.createElement('div');
                            tick.className = 'absolute';
                            tick.style.top = `${y}px`;
                            tick.style.right = '0px';
                            tick.style.height = '1px';
                            tick.style.width = `${width}px`;
                            tick.style.background = color;
                            leftRulerMarks.appendChild(tick);

                            // Inch label
                            if (i % 8 === 0) {
                                const mark = document.createElement('div');
                                mark.className = 'absolute text-xs font-bold text-gray-700';
                                mark.style.top = `${y + 2}px`;
                                mark.style.right = '2px';
                                mark.style.fontSize = '10px';
                                mark.style.transform = 'rotate(-90deg)';
                                mark.style.transformOrigin = 'center';
                                mark.style.userSelect = 'none';
                                mark.textContent = (i / 8).toString();
                                leftRulerMarks.appendChild(mark);
                            }
                        }
                    }
                };

                // Handle scroll synchronization
                const handleScroll = () => {
                    const scrollLeft = canvasScrollContainer.scrollLeft;
                    const scrollTop = canvasScrollContainer.scrollTop;

                    // Sync horizontal ruler
                    const topRulerMarks = topRuler.querySelector('.ruler-marks');
                    if (topRulerMarks) {
                        topRulerMarks.style.transform = `translateX(-${scrollLeft}px)`;
                    }

                    // Sync vertical ruler
                    const leftRulerMarks = leftRuler.querySelector('.ruler-marks');
                    if (leftRulerMarks) {
                        leftRulerMarks.style.transform = `translateY(-${scrollTop}px)`;
                    }
                };

                // Handle mouse move for ruler guides
                const handleMouseMove = (e) => {
                    const canvasRect = canvasElement.getBoundingClientRect();
                    const containerRect = canvasScrollContainer.getBoundingClientRect();

                    // Calculate mouse position relative to canvas
                    const mouseX = e.clientX - canvasRect.left + canvasScrollContainer.scrollLeft;
                    const mouseY = e.clientY - canvasRect.top + canvasScrollContainer.scrollTop;

                    // Update ruler guides
                    let topGuide = topRuler.querySelector('.ruler-guide');
                    let leftGuide = leftRuler.querySelector('.ruler-guide');

                    if (!topGuide) {
                        topGuide = document.createElement('div');
                        topGuide.className = 'ruler-guide absolute bg-red-500 opacity-50';
                        topGuide.style.width = '1px';
                        topGuide.style.height = '100%';
                        topGuide.style.top = '0';
                        topGuide.style.pointerEvents = 'none';
                        topRuler.appendChild(topGuide);
                    }

                    if (!leftGuide) {
                        leftGuide = document.createElement('div');
                        leftGuide.className = 'ruler-guide absolute bg-red-500 opacity-50';
                        leftGuide.style.height = '1px';
                        leftGuide.style.width = '100%';
                        leftGuide.style.left = '0';
                        leftGuide.style.pointerEvents = 'none';
                        leftRuler.appendChild(leftGuide);
                    }

                    // Show guides only when mouse is over canvas
                    if (mouseX >= 0 && mouseX <= canvas.width && mouseY >= 0 && mouseY <= canvas.height) {
                        topGuide.style.left = `${mouseX}px`;
                        topGuide.style.display = 'block';
                        leftGuide.style.top = `${mouseY}px`;
                        leftGuide.style.display = 'block';
                    } else {
                        topGuide.style.display = 'none';
                        leftGuide.style.display = 'none';
                    }
                };

                // Hide ruler guides when mouse leaves canvas
                const handleMouseLeave = () => {
                    const topGuide = topRuler.querySelector('.ruler-guide');
                    const leftGuide = leftRuler.querySelector('.ruler-guide');
                    if (topGuide) topGuide.style.display = 'none';
                    if (leftGuide) leftGuide.style.display = 'none';
                };

                // Initial setup
                updateContainerSize();
                updateRulers();

                // Event listeners
                canvasScrollContainer.addEventListener('scroll', handleScroll);
                canvasElement.addEventListener('mousemove', handleMouseMove);
                canvasElement.addEventListener('mouseleave', handleMouseLeave);
                window.addEventListener('resize', updateContainerSize);

                return () => {
                    canvasScrollContainer.removeEventListener('scroll', handleScroll);
                    canvasElement.removeEventListener('mousemove', handleMouseMove);
                    canvasElement.removeEventListener('mouseleave', handleMouseLeave);
                    window.removeEventListener('resize', updateContainerSize);
                };
            }
        }
    }, [canvas, currentTemplate]);

    const handleToolSelect = (toolId) => {
        setSelectedTool(toolId);

        // Handle specific tool actions (only tools shown in image)
        switch (toolId) {
            case 'selection':
                if (canvas) {
                    canvas.isDrawingMode = false;
                    canvas.selection = true;
                }
                break;
            case 'text':
                fabricTools.addText();
                break;
            case 'field':
                // Field tool - for future implementation
                console.log('Field tool selected');
                break;
            case 'image':
                fabricTools.addImage();
                break;
            case 'pencil':
                fabricTools.enableDrawing();
                break;
            case 'line':
                fabricTools.addLine();
                break;
            default:
                break;
        }
    };

    const handleCloseEditor = () => {
        // Remove editor from session storage and redirect to templates
        sessionStorage.removeItem('editorActive');
        window.location.href = 'index.html';
    };

    return React.createElement('div', { className: 'h-screen flex flex-col font-system' },
        // Header navbar
        React.createElement(SharedNavbar, { title: 'Tag Designer: New' }),

        // Main layout with sidebar and content
        React.createElement('div', { className: 'flex h-[calc(100vh-70px)]' },
            // Left Sidebar with Editor button active
            React.createElement(SharedSidebar, {
                activePage: 'editor',
                showNewDropdown,
                setShowNewDropdown,
                setShowOrientationPopup,
                setSelectedTemplate: setSelectedNewTemplate,
                setSelectedOrientation: setSelectedNewOrientation,
                setIsPopupMinimized,
                setIsPopupMaximized,
                templateOptions
            }),

            // Main Content Area with Toolbars and Canvas
            React.createElement('div', { className: 'flex flex-col flex-1', style: { background: '#f5f5f5' } },
                // Top Horizontal Toolbar (grouped like app)
                React.createElement('div', { className: 'flex items-center justify-center px-4 py-2', style: { background: '#fff', marginLeft: '0px', marginTop: '0px', marginRight: '0px' } },
                    // Left group
                    React.createElement('div', { className: 'flex items-center' },
                        // Copy button
                        React.createElement('div', {
                            className: 'flex flex-col items-center justify-center px-2 py- cursor-pointer group mx-2',
                            onClick: () => fabricTools.copySelected(),
                            title: 'Copy'
                        },
                            React.createElement('div', {
                                className: 'w-10 h-10 flex items-center justify-center rounded-full bg-white shadow group-hover:bg-gray-200 transition-all duration-200 mb-1',
                                style: { border: '1.5px solid #e5e7eb' }
                            },
                                React.createElement('i', { className: 'far fa-copy text-2xl text-gray-600' })
                            ),
                            React.createElement('span', { className: 'text-xs text-gray-600 mt-1' }, 'copy')
                        ),
                        // Cut button
                        React.createElement('div', {
                            className: 'flex flex-col items-center justify-center px-3 py-2 cursor-pointer group mx-2',
                            onClick: () => {
                                fabricTools.copySelected();
                                fabricTools.deleteSelected();
                            },
                            title: 'Cut'
                        },
                            React.createElement('div', {
                                className: 'w-10 h-10 flex items-center justify-center rounded-full bg-white shadow group-hover:bg-gray-200 transition-all duration-200 mb-1',
                                style: { border: '1.5px solid #e5e7eb' }
                            },
                                React.createElement('i', { className: 'fas fa-cut text-2xl text-gray-600' })
                            ),
                            React.createElement('span', { className: 'text-xs text-gray-600 mt-1' }, 'cut')
                        ),
                        // Paste button
                        React.createElement('div', {
                            className: 'flex flex-col items-center justify-center px-3 py-2 cursor-pointer group mx-2',
                            onClick: () => fabricTools.paste(),
                            title: 'Paste'
                        },
                            React.createElement('div', {
                                className: 'w-10 h-10 flex items-center justify-center rounded-full bg-white shadow group-hover:bg-gray-200 transition-all duration-200 mb-1',
                                style: { border: '1.5px solid #e5e7eb' }
                            },
                                React.createElement('i', { className: 'far fa-clipboard text-2xl text-gray-600' })
                            ),
                            React.createElement('span', { className: 'text-xs text-gray-600 mt-1' }, 'paste')
                        ),
                        // Delete button
                        React.createElement('div', {
                            className: 'flex flex-col items-center justify-center px-3 py-2 cursor-pointer group mx-2',
                            onClick: () => fabricTools.deleteSelected(),
                            title: 'Delete'
                        },
                            React.createElement('div', {
                                className: 'w-10 h-10 flex items-center justify-center rounded-full bg-white shadow group-hover:bg-gray-200 transition-all duration-200 mb-1',
                                style: { border: '1.5px solid #e5e7eb' }
                            },
                                React.createElement('i', { className: 'far fa-trash-alt text-2xl text-gray-600' })
                            ),
                            React.createElement('span', { className: 'text-xs text-gray-600 mt-1' }, 'delete')
                        )
                    ),
                    // Spacer
                    React.createElement('div', { style: { width: '120px' } }),
                    // Right group
                    React.createElement('div', { className: 'flex items-center' },
                        // Save button
                        React.createElement('div', {
                            className: 'flex flex-col items-center justify-center px-3 py-2 cursor-pointer group mx-2',
                            onClick: () => {
                                const jsonData = fabricTools.saveCanvas();
                                localStorage.setItem('canvasData', jsonData);
                            },
                            title: 'Save'
                        },
                            React.createElement('div', {
                                className: 'w-10 h-10 flex items-center justify-center rounded-full bg-black shadow group-hover:bg-gray-800 transition-all duration-200 mb-1',
                            },
                                React.createElement('i', { className: 'far fa-save text-2xl text-white' })
                            ),
                            React.createElement('span', { className: 'text-xs text-black mt-1' }, 'Save')
                        ),
                        // Print button
                        React.createElement('div', {
                            className: 'flex flex-col items-center justify-center px-3 py-2 cursor-pointer group mx-2',
                            onClick: () => {
                                const dataURL = fabricTools.exportImage('png');
                                const printWindow = window.open('');
                                printWindow.document.write(`<img src="${dataURL}" style="width:100%;" onload="window.print();window.close();">`);
                            },
                            title: 'Print'
                        },
                            React.createElement('div', {
                                className: 'w-10 h-10 flex items-center justify-center rounded-full bg-white shadow group-hover:bg-gray-200 transition-all duration-200 mb-1',
                                style: { border: '1.5px solid #e5e7eb' }
                            },
                                React.createElement('i', { className: 'fas fa-print text-2xl text-gray-600' })
                            ),
                            React.createElement('span', { className: 'text-xs text-gray-600 mt-1' }, 'Print')
                        ),
                        // Calculations button
                        React.createElement('div', {
                            className: 'flex flex-col items-center justify-center px-3 py-2 cursor-pointer group mx-2',
                            onClick: () => console.log('Calculations clicked'),
                            title: 'Calculations'
                        },
                            React.createElement('div', {
                                className: 'w-10 h-10 flex items-center justify-center rounded-full bg-white shadow group-hover:bg-gray-200 transition-all duration-200 mb-1',
                                style: { border: '1.5px solid #e5e7eb' }
                            },
                                React.createElement('i', { className: 'fas fa-calculator text-2xl text-gray-600' })
                            ),
                            React.createElement('span', { className: 'text-xs text-gray-600 mt-1' }, 'Calculations')
                        ),
                        // Close button
                        React.createElement('div', {
                            className: 'flex flex-col items-center justify-center px-3 py-2 cursor-pointer group mx-2',
                            onClick: handleCloseEditor,
                            title: 'Close'
                        },
                            React.createElement('div', {
                                className: 'w-10 h-10 flex items-center justify-center rounded-full bg-white shadow group-hover:bg-gray-200 transition-all duration-200 mb-1',
                                style: { border: '1.5px solid #e5e7eb' }
                            },
                                React.createElement('i', { className: 'fas fa-times text-2xl text-gray-600' })
                            ),
                            React.createElement('span', { className: 'text-xs text-gray-600 mt-1' }, 'Close')
                        )
                    )
                ),

                // Content area with left toolbar, canvas with rulers (left-aligned), and right shape gallery
                React.createElement('div', {
                    className: 'flex flex-1 overflow-hidden',
                    style: { height: 'calc(100vh - 120px)', background: '#f5f5f5' }
                },
                    // Left Vertical Toolbar
                    React.createElement('div', { className: 'flex flex-col items-center py-2 px-2 w-16', style: { background: '#fff' } },
                        // Selection Tool (cursor icon - cyan when active)
                        React.createElement('div', {
                            className: `w-10 h-10 mb-1 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 ${selectedTool === 'selection'
                                    ? 'bg-cyan-400 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`,
                            onClick: () => handleToolSelect('selection'),
                            title: 'Selection Tool'
                        },
                            React.createElement('i', { className: 'fas fa-mouse-pointer text-sm' })
                        ),

                        // Text Tool (T icon)
                        React.createElement('div', {
                            className: `w-10 h-10 mb-1 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 ${selectedTool === 'text'
                                    ? 'bg-cyan-400 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`,
                            onClick: () => handleToolSelect('text'),
                            title: 'Text Tool'
                        },
                            React.createElement('span', { className: 'text-lg font-bold' }, 'T')
                        ),

                        // Field Tool (edit icon)
                        React.createElement('div', {
                            className: `w-10 h-10 mb-1 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 ${selectedTool === 'field'
                                    ? 'bg-cyan-400 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`,
                            onClick: () => handleToolSelect('field'),
                            title: 'Field Tool'
                        },
                            React.createElement('i', { className: 'fas fa-edit text-sm' })
                        ),

                        // Image Tool
                        React.createElement('div', {
                            className: `w-10 h-10 mb-1 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 ${selectedTool === 'image'
                                    ? 'bg-cyan-400 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`,
                            onClick: () => handleToolSelect('image'),
                            title: 'Image Tool'
                        },
                            React.createElement('i', { className: 'far fa-image text-sm' })
                        ),

                        // Drawing Tool (pencil)
                        React.createElement('div', {
                            className: `w-10 h-10 mb-1 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 ${selectedTool === 'pencil'
                                    ? 'bg-cyan-400 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`,
                            onClick: () => handleToolSelect('pencil'),
                            title: 'Drawing Tool'
                        },
                            React.createElement('i', { className: 'fas fa-pencil-alt text-sm' })
                        ),

                        // Line Tool
                        React.createElement('div', {
                            className: `w-10 h-10 mb-1 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 ${selectedTool === 'line'
                                    ? 'bg-cyan-400 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`,
                            onClick: () => handleToolSelect('line'),
                            title: 'Line Tool'
                        },
                            React.createElement('i', { className: 'fas fa-minus text-sm' })
                        ),

                        // Stroke Color (red circle)
                        React.createElement('div', {
                            className: 'w-10 h-10 mb-1 flex items-center justify-center cursor-pointer hover:bg-gray-200 rounded transition-all duration-200',
                            onClick: () => {
                                const input = document.createElement('input');
                                input.type = 'color';
                                input.value = selectedColor;
                                input.onchange = (e) => setSelectedColor(e.target.value);
                                input.click();
                            },
                            title: 'Stroke Color'
                        },
                            React.createElement('div', {
                                className: 'w-6 h-6 rounded-full border-2 border-gray-400',
                                style: { backgroundColor: selectedColor }
                            }),
                            React.createElement('div', {
                                className: 'absolute text-xs text-gray-700 mt-8',
                                style: { fontSize: '8px' }
                            }, 'stroke')
                        ),

                        // Fill Color (white with red diagonal line)
                        React.createElement('div', {
                            className: 'w-10 h-10 mb-1 flex items-center justify-center cursor-pointer hover:bg-gray-200 rounded transition-all duration-200 relative',
                            onClick: () => {
                                const input = document.createElement('input');
                                input.type = 'color';
                                input.value = fillColor;
                                input.onchange = (e) => setFillColor(e.target.value);
                                input.click();
                            },
                            title: 'Fill Color'
                        },
                            React.createElement('div', {
                                className: 'w-6 h-6 rounded-full border-2 border-gray-400 relative',
                                style: { backgroundColor: fillColor }
                            },
                                React.createElement('div', {
                                    className: 'absolute inset-0',
                                    style: {
                                        background: 'linear-gradient(45deg, transparent 46%, red 46%, red 54%, transparent 54%)',
                                        borderRadius: '50%'
                                    }
                                })
                            ),
                            React.createElement('div', {
                                className: 'absolute text-xs text-gray-700 mt-8',
                                style: { fontSize: '8px' }
                            }, 'fill')
                        ),

                        // Thickness indicator (black circle with white dot)
                        React.createElement('div', {
                            className: 'w-10 h-10 mb-1 flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200 rounded cursor-pointer transition-all duration-200',
                            onClick: () => {
                                const thickness = prompt('Enter stroke thickness (1-20):', strokeThickness);
                                if (thickness && !isNaN(thickness)) {
                                    setStrokeThickness(Math.max(1, Math.min(20, parseInt(thickness))));
                                }
                            },
                            title: 'Stroke Thickness'
                        },
                            React.createElement('div', {
                                className: 'w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center'
                            },
                                React.createElement('div', { className: 'w-1 h-1 bg-white rounded-full' })
                            )
                        )
                    ),


                    // Main canvas/ruler area (left-aligned, not centered)
                    React.createElement('div', {
                        className: 'flex flex-col flex-1',
                        style: { minWidth: 0, minHeight: 0, background: 'transparent', alignItems: 'flex-start', justifyContent: 'flex-start', display: 'flex' }
                    },
                        React.createElement('div', {
                            style: { display: 'flex', flexDirection: 'row', background: 'transparent', alignItems: 'flex-start' }
                        },
                            // Left column: top-left corner and left ruler
                            React.createElement('div', { style: { display: 'flex', flexDirection: 'column' } },
                                // Top-left corner blank
                                React.createElement('div', { style: { width: 24, height: 24, background: 'transparent', flexShrink: 0 } }),
                                // Left Ruler (vertical), starts below top ruler
                                React.createElement('div', {
                                    id: 'leftRuler',
                                    className: 'bg-white border-r border-gray-300 w-6 relative flex-shrink-0 overflow-hidden',
                                    style: { width: 24, height: 'calc(100% - 24px)' }
                                },
                                    React.createElement('div', {
                                        className: 'ruler-marks relative',
                                        style: { height: '100%', width: '100%' }
                                    })
                                )
                            ),
                            // Main column: top ruler and canvas
                            React.createElement('div', { style: { display: 'flex', flexDirection: 'column', background: 'transparent' } },
                                // Top Ruler (horizontal)
                                React.createElement('div', {
                                    id: 'topRuler',
                                    className: 'bg-white border-b border-gray-300 h-6 flex items-end relative flex-shrink-0 overflow-hidden',
                                    style: { height: 24, marginLeft: 0 }
                                },
                                    React.createElement('div', {
                                        className: 'ruler-marks relative',
                                        style: { width: '100%', height: '100%' }
                                    })
                                ),
                                // Canvas container (attached to top-left corner of rulers)
                                React.createElement('div', {
                                    id: 'canvasScrollContainer',
                                    style: {
                                        scrollBehavior: 'smooth',
                                        overflowY: 'auto',
                                        overflowX: 'auto',
                                        background: 'transparent',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: 'flex-start',
                                        width: '820px',
                                        height: '520px',
                                        position: 'relative',
                                        padding: 0,
                                        margin: 0
                                    }
                                },
                                    React.createElement('canvas', {
                                        id: 'designCanvas',
                                        style: {
                                            border: 'none',
                                            display: 'block',
                                            background: 'transparent',
                                            boxShadow: 'none',
                                            outline: 'none',
                                            margin: 0,
                                            padding: 0
                                        }
                                    })
                                )
                            )
                        )
                    ),

                    // Right Shape Gallery (fixed width, aligned with canvas area)
                    React.createElement('div', { className: 'w-80 flex flex-col', style: { background: '#fff', minWidth: '320px', maxWidth: '320px', height: 'calc(100% - 32px)', borderLeft: '1.5px solid #e5e7eb', boxShadow: 'none', marginTop: '16px', marginBottom: '16px', borderRadius: '8px' } },
                        // Gallery Main Area: two vertical containers side by side
                        React.createElement('div', { className: 'flex flex-1 flex-row', style: { minHeight: 0 } },
                            // Left: Tabs Sidebar with heading
                            React.createElement('div', {
                                className: 'flex flex-col py-2',
                                style: { width: '90px', background: '#f5f5f5', borderRight: '1.5px solid #e5e7eb', height: '100%' }
                            },
                                React.createElement('div', { className: 'text-base font-bold text-gray-800 px-3 mb-2 mt-1' }, 'Gallery'),
                                React.createElement('button', {
                                    className: 'w-full text-left px-3 py-2 text-sm font-bold text-white',
                                    style: { background: '#0099cc', borderRadius: '4px', marginBottom: 4 }
                                }, 'Basic'),
                                React.createElement('button', {
                                    className: 'w-full text-left px-3 py-2 text-sm font-normal text-gray-700 hover:bg-gray-100',
                                    style: { background: 'transparent', borderRadius: '4px' }
                                }, 'Arrow')
                            ),
                            // Right: Main Content Area (empty for now) with footer
                            React.createElement('div', {
                                className: 'flex flex-col flex-1 h-full',
                                style: { background: '#fff', minHeight: 0 }
                            },
                                React.createElement('div', {
                                    className: 'w-full h-full flex-1',
                                    id: 'shapeGallery'
                                }),
                                React.createElement('div', { className: 'px-4 py-2 border-t border-gray-200 flex items-center' },
                                    React.createElement('button', {
                                        className: 'text-xs text-gray-700 hover:text-black font-medium px-2 py-1',
                                        style: { background: 'transparent' }
                                    }, '< View Galleries')
                                )
                            )
                        ),
                    )
                )
            ),

            // Shared Orientation Popup Component (for New dropdown)
            React.createElement(OrientationPopup, {
                showOrientationPopup,
                isPopupMinimized,
                isPopupMaximized,
                setIsPopupMinimized,
                setIsPopupMaximized,
                setShowOrientationPopup,
                selectedOrientation: selectedNewOrientation,
                setSelectedOrientation: setSelectedNewOrientation,
                selectedTemplate: selectedNewTemplate
            })
        )
    );
}

// Render the component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(EditorApp));
