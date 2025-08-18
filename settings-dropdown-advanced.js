(function() {
  // --- Settings Dropdown Tab/Subtab Logic ---
  document.addEventListener('DOMContentLoaded', function () {
    const settingsTabs = document.querySelectorAll('#settingsDropdown .tab');
    const settingsTabContents = document.querySelectorAll('#settingsDropdown .tab-content');
    settingsTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        settingsTabs.forEach(t => t.classList.remove('active'));
        settingsTabContents.forEach(tc => tc.style.display = 'none');
        this.classList.add('active');
        const tabId = 'tab-' + this.dataset.tab;
        const tabContent = document.getElementById(tabId);
        if (tabContent) tabContent.style.display = 'block';
        // If Size tab is activated, update size inputs to show real dimensions
        if (this.dataset.tab === 'size' && window.canvas && window.canvas.getActiveObject) {
          const obj = window.canvas.getActiveObject();
          if (obj) {
            // updateSizeInputs is defined in onFabricReady scope, so call via window
            if (typeof window.updateSizeInputs === 'function') {
              window.updateSizeInputs(obj);
            }
          }
        }
      });
    });
    // Subtab logic for Home tab
    const subtabs = document.querySelectorAll('#settingsDropdown .subtab');
    const subtabContents = document.querySelectorAll('#settingsDropdown .subtab-content');
    subtabs.forEach(subtab => {
      subtab.addEventListener('click', function() {
        subtabs.forEach(st => st.classList.remove('active'));
        subtabContents.forEach(sc => sc.style.display = 'none');
        this.classList.add('active');
        const subtabId = 'subtab-' + this.dataset.subtab;
        const subtabContent = document.getElementById(subtabId);
        if (subtabContent) subtabContent.style.display = 'block';
      });
    });
    // --- Style Tab Interactivity ---
    // Style subtabs
    const styleSubtabs = document.querySelectorAll('.style-subtab');
    const styleContents = [
      document.getElementById('style-color-content'),
      document.getElementById('style-geometry-content')
    ];
    styleSubtabs.forEach((btn, idx) => {
      btn.addEventListener('click', function() {
        styleSubtabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        styleContents.forEach((c, i) => c.style.display = (i === idx ? 'block' : 'none'));
      });
    });
    // Palette tabs
    const paletteTabs = document.querySelectorAll('.palette-tab');
    const paletteContents = [
      document.getElementById('palette-colors'),
      document.getElementById('palette-gradients')
    ];
    paletteTabs.forEach((btn, idx) => {
      btn.addEventListener('click', function() {
        paletteTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        paletteContents.forEach((c, i) => c.style.display = (i === idx ? 'block' : 'none'));
        setTimeout(attachSwatchHandlers, 0); // Ensure handlers are attached after DOM update
      });
    });

    // --- Add named gradients to the gradients palette ---
    const gradients = {
  "Sunset": ["#ff7e5f", "#feb47b"],
  "Ocean Blue": ["#2193b0", "#6dd5ed"],
  "Purple Bliss": ["#360033", "#0b8793"],
  "Emerald Water": ["#348f50", "#56b4d3"],
  "Bloody Mary": ["#ff512f", "#dd2476"],
  "Deep Sea": ["#2c3e50", "#4ca1af"],
  "Mango": ["#ffe259", "#ffa751"],
  "Cosmic Fusion": ["#ff00cc", "#333399"],
  "Aqua Marine": ["#1a2980", "#26d0ce"],
  "Fire": ["#f12711", "#f5af19"],
  "Lush Green": ["#56ab2f", "#a8e063"],
  "Steel Gray": ["#232526", "#414345"],
  "Pink Dream": ["#ff9a9e", "#fecfef"],
  "Skyline": ["#1488cc", "#2b32b2"],
  "Golden Hour": ["#f7971e", "#ffd200"],
  "Royal Purple": ["#654ea3", "#eaafc8"],
  "Citrus Pop": ["#f9d423", "#ff4e50"],
  "Arctic Ocean": ["#00c6ff", "#0072ff"],
  "Lemon Twist": ["#3ca55c", "#b5ac49"],
  "Candy": ["#d3959b", "#bfe6ba"],
  "Galaxy": ["#0f2027", "#203a43", "#2c5364"],
  "Strawberry": ["#ee9ca7", "#ffdde1"],
  "Copper": ["#b79891", "#94716b"],
  "Nightfall": ["#232526", "#414345"],
  "Neon Glow": ["#12c2e9", "#c471ed"],
  "Dreamy": ["#fbc2eb", "#a6c1ee"],
  "Warm Flame": ["#ff9a9e", "#fad0c4"],
  "Cool Breeze": ["#a1c4fd", "#c2e9fb"],
  "Hot Pink": ["#f857a6", "#ff5858"],
  "Coffee": ["#e6dada", "#274046"],
  "Teal Love": ["#43cea2", "#185a9d"],
  "Horizon": ["#003973", "#e5e5be"],
  "Coral Reef": ["#ff9966", "#ff5e62"],
  "Watermelon": ["#00c9ff", "#92fe9d"],
  "Amber": ["#f3904f", "#3b4371"],
  "Misty Meadow": ["#215f00", "#e4e4d9"],
  "Sand": ["#c79081", "#dfa579"],
  "Frost": ["#000428", "#004e92"],
  "Twilight": ["#2c3e50", "#fd746c"],
  "Raspberry": ["#bc4e9c", "#f80759"],
  "Vintage": ["#708090", "#c0c0aa"],
  "Fresh Mint": ["#76b852", "#8dc26f"],
  "Ruby": ["#dd3e54", "#6be585"],
  "Sahara": ["#eacda3", "#d6ae7b"],
  "Cool Sky": ["#2980b9", "#6dd5fa"],
  "Pastel Dreams": ["#ffecd2", "#fcb69f"],
  "Lava": ["#ff416c", "#ff4b2b"],
  "Plum": ["#cc2b5e", "#753a88"],
  "Foggy": ["#d7d2cc", "#304352"],
  "Ice": ["#83a4d4", "#b6fbff"],
  "Evergreen": ["#134e5e", "#71b280"],
  "Red Sunset": ["#355c7d", "#6c5b7b", "#c06c84"],
  "Mocha": ["#eacda3", "#d6ae7b"],
  "Sapphire": ["#1f4037", "#99f2c8"],
  "Sunrise": ["#f7971e", "#ffd200"],
  "Ultramarine": ["#00c6ff", "#0072ff"],
  "Peach": ["#ffecd2", "#fcb69f"],
  "Forest": ["#5a3f37", "#2c7744"],
  "Shadow": ["#4b6cb7", "#182848"],
  "Pearl": ["#fdfcfb", "#e2d1c3"],
  "Ink": ["#283048", "#859398"],
  "Flame": ["#ff512f", "#f09819"],
  "Lagoon": ["#2bc0e4", "#eaecc6"],
  "Skyfall": ["#005c97", "#363795"],
  "Desert": ["#c79081", "#dfa579"],
  "Ice Mint": ["#83a4d4", "#b6fbff"],
  "Cotton Candy": ["#ffafbd", "#ffc3a0"],
  "Tropical": ["#1a2980", "#26d0ce"],
  "Wine": ["#614385", "#516395"],
  "Aurora": ["#00c6ff", "#0072ff"],
  "Orchid": ["#da22ff", "#9733ee"],
  "Bronze": ["#abbaab", "#ffffff"],
  "Rose": ["#e96443", "#904e95"],
  "Lemonade": ["#f9d423", "#ff4e50"],
  "Chill": ["#2193b0", "#6dd5ed"],
  "Minty": ["#56ab2f", "#a8e063"],
  "Deep Purple": ["#673ab7", "#512da8"],
  "Crimson": ["#ed213a", "#93291e"],
  "Arctic": ["#2980b9", "#2c3e50"],
  "Marine": ["#1a2a6c", "#b21f1f", "#fdbb2d"],
  "Pine": ["#11998e", "#38ef7d"],
  "Royal Blue": ["#141e30", "#243b55"],
  "Dusty Rose": ["#b79891", "#94716b"],
  "Flamingo": ["#ff9a9e", "#fecfef"],
  "Indigo": ["#3f2b96", "#a8c0ff"],
  "Midnight": ["#232526", "#414345"],
  "Cloud": ["#e0eafc", "#cfdef3"],
  "Honey": ["#f7971e", "#ffd200"],
  "Lava Flow": ["#e96443", "#904e95"],
  "Graphite": ["#485563", "#29323c"],
  "Ocean Drive": ["#43cea2", "#185a9d"],
  "Volcano": ["#ff512f", "#dd2476"],
  "Lagoon Blue": ["#005aa7", "#fffde4"],
  "Arctic Dawn": ["#6a11cb", "#2575fc"],
  "Sweet Morning": ["#ff5f6d", "#ffc371"],
  "Fresh Air": ["#a1c4fd", "#c2e9fb"],
  "Moonlight": ["#2c3e50", "#4ca1af"],
  "Sunshine": ["#ffe259", "#ffa751"],
  "Electric": ["#4776e6", "#8e54e9"],
  "Rose Gold": ["#e6bcf1", "#b76e79"]
    };
    const paletteGradients = document.getElementById('palette-gradients');
    if (paletteGradients) {
      paletteGradients.innerHTML = '';
      Object.entries(gradients).forEach(([name, colors]) => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch gradient-swatch';
        swatch.title = name + ' (' + colors.join(' → ') + ')';
        swatch.setAttribute('data-gradient-name', name);
        // Support 2 or 3 color gradients visually
        if (colors.length === 2) {
          swatch.style.background = `linear-gradient(135deg,${colors[0]},${colors[1]})`;
        } else if (colors.length === 3) {
          swatch.style.background = `linear-gradient(135deg,${colors[0]},${colors[1]},${colors[2]})`;
        }
        // Add label below swatch
        const label = document.createElement('div');
        label.className = 'swatch-label';
        label.textContent = name;
        label.style.fontSize = '10px';
        label.style.textAlign = 'center';
        label.style.marginTop = '2px';
        label.style.color = '#444';
        const wrapper = document.createElement('div');
        wrapper.style.display = 'inline-block';
        wrapper.style.margin = '4px';
        wrapper.style.verticalAlign = 'top';
        wrapper.appendChild(swatch);
        wrapper.appendChild(label);
        paletteGradients.appendChild(wrapper);
      });
      setTimeout(attachSwatchHandlers, 0);
    }
    // Color/Stroke swatch click (solid and gradient)
    function parseGradient(bg) {
      // Only supports linear-gradient(135deg,#color1,#color2)
      const match = bg.match(/linear-gradient\(135deg,([^,]+),([^\)]+)\)/);
      if (match) {
        return [match[1].trim(), match[2].trim()];
      }
      return null;
    }
    function applySwatchToObject(swatch, obj) {
      // Check if this is a gradient swatch
      const gradientName = swatch.getAttribute('data-gradient-name');
      if (gradientName && gradients[gradientName]) {
        // Apply gradient using fabric.Gradient
        function applyGradient(target) {
          const colors = gradients[gradientName];
          if (!colors) return;
          // Support 2 or 3 color gradients
          let colorStops = [];
          if (colors.length === 2) {
            colorStops = [
              { offset: 0, color: colors[0] },
              { offset: 1, color: colors[1] }
            ];
          } else if (colors.length === 3) {
            colorStops = [
              { offset: 0, color: colors[0] },
              { offset: 0.5, color: colors[1] },
              { offset: 1, color: colors[2] }
            ];
          }
          target.set('fill', new fabric.Gradient({
            type: 'linear',
            gradientUnits: 'percentage',
            coords: { x1: 0, y1: 0, x2: 0, y2: 1 },
            colorStops: colorStops
          }));
        }
        if (obj.type === 'group' && obj._objects) {
          obj._objects.forEach(child => applyGradient(child));
        } else {
          applyGradient(obj);
        }
      } else {
        // Solid color swatch
        const color = swatch.getAttribute('data-color') || swatch.style.background;
        if (obj.type === 'group' && obj._objects) {
          obj._objects.forEach(child => {
            child.set('fill', color);
          });
        } else {
          obj.set('fill', color);
        }
      }
    }
    function attachSwatchHandlers() {
      document.querySelectorAll('#palette-colors .color-swatch, #palette-gradients .color-swatch').forEach(swatch => {
        if (!swatch._colorHandlerAttached) {
          swatch.addEventListener('click', function() {
            document.querySelectorAll('.color-swatch.selected').forEach(s => s.classList.remove('selected'));
            swatch.classList.add('selected');
            // Get active Fabric.js object
            const obj = window.settingsDropdownSelectedObject || (window.canvas && window.canvas.getActiveObject ? window.canvas.getActiveObject() : null);
            if (obj) {
              applySwatchToObject(swatch, obj);
              if (window.canvas) window.canvas.requestRenderAll();
            }
          });
          swatch._colorHandlerAttached = true;
        }
      });
    }
    attachSwatchHandlers();
  // Also re-attach handlers after DOMContentLoaded in case swatches are replaced dynamically
  document.addEventListener('DOMContentLoaded', attachSwatchHandlers);
    // If swatches are ever updated dynamically, call attachSwatchHandlers() again.
    // Opacity slider
    const opacitySlider = document.getElementById('opacitySlider');
    const opacityValue = document.getElementById('opacityValue');
    if (opacitySlider && opacityValue) {
      opacitySlider.addEventListener('input', function() {
        opacityValue.textContent = opacitySlider.value + '%';
        const obj = (window.canvas && window.canvas.getActiveObject ? window.canvas.getActiveObject() : null);
        if (obj && obj.set) {
          obj.set('opacity', parseInt(opacitySlider.value, 10) / 100);
          if (obj.canvas && obj.canvas.requestRenderAll) obj.canvas.requestRenderAll();
        }
      });
      // When selection changes, update slider to match selected object's opacity
      function updateOpacitySlider() {
        const obj = (window.canvas && window.canvas.getActiveObject ? window.canvas.getActiveObject() : null);
        if (obj && typeof obj.opacity === 'number') {
          opacitySlider.value = Math.round(obj.opacity * 100);
          opacityValue.textContent = opacitySlider.value + '%';
        } else {
          opacitySlider.value = 100;
          opacityValue.textContent = '100%';
        }
      }
      if (window.canvas) {
        window.canvas.on('selection:created', updateOpacitySlider);
        window.canvas.on('selection:updated', updateOpacitySlider);
        window.canvas.on('object:modified', updateOpacitySlider);
      }
      // Also update on DOM ready
      updateOpacitySlider();
    }
  });

  // --- Clipboard, Group, Ungroup, Arrange, and Text Style Handlers ---
  document.addEventListener('DOMContentLoaded', function () {
    function getCanvas() { return window.canvas; }
    let clipboardObject = null;
    let cutObject = null;
    // Copy
    function handleCopy() {
      const canvas = getCanvas();
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        activeObject.clone(function(cloned) {
          clipboardObject = cloned;
          cutObject = null;
        });
      } else {
        alert('Please select an object to copy.');
      }
    }
    // Cut
    function handleCut() {
      const canvas = getCanvas();
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        activeObject.clone(function(cloned) {
          clipboardObject = cloned;
          cutObject = cloned;
        });
        canvas.remove(activeObject);
        canvas.discardActiveObject();
        canvas.renderAll();
      } else {
        alert('Please select an object to cut.');
      }
    }
    // Paste
    function handlePaste() {
      const canvas = getCanvas();
      if (clipboardObject) {
        clipboardObject.clone(function(clonedObj) {
          clonedObj.set({
            left: (clonedObj.left || 0) + 20,
            top: (clonedObj.top || 0) + 20
          });
          canvas.add(clonedObj);
          canvas.setActiveObject(clonedObj);
          canvas.renderAll();
          if (cutObject) {
            clipboardObject = null;
            cutObject = null;
          }
        });
      } else {
        alert('Nothing to paste.');
      }
    }
    // Delete
    function handleDeleteAndCloseDropdown() {
      const canvas = getCanvas();
      const settingsDropdown = document.getElementById('settingsDropdown');
      const objToDelete = canvas.getActiveObject();
      if (objToDelete) {
        if (objToDelete.type === 'activeSelection') {
          objToDelete.forEachObject(function(obj) {
            canvas.remove(obj);
          });
        } else {
          canvas.remove(objToDelete);
        }
        canvas.discardActiveObject();
        canvas.renderAll();
      } else {
        alert('Please select an object to delete.');
      }
      if (settingsDropdown) {
        settingsDropdown.classList.add('hidden');
      }
    }
    // Group
    function handleGroup() {
      const canvas = getCanvas();
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === 'activeSelection') {
        // Use Fabric.js built-in grouping
        const group = activeObject.toGroup();
        canvas.setActiveObject(group);
        group.setCoords();
        canvas.renderAll();
      } else {
        alert('Select two or more objects to group.');
      }
    }
    // Ungroup
    function handleUngroup() {
      const canvas = getCanvas();
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === 'group') {
        activeObject.ungroupOnCanvas(canvas);
      } else {
        alert('Please select a group to ungroup.');
      }
    }
    // Arrange (example: send to back/front)
    function handleArrange(action) {
      const canvas = getCanvas();
      const activeObject = canvas.getActiveObject();
      if (!activeObject) return;
      // If multiple objects selected (activeSelection), align relative to selection bounds
      if (activeObject.type === 'activeSelection' && activeObject._objects.length > 1) {
        const objects = activeObject._objects;
        // Calculate selection bounding box
        let minLeft = Infinity, minTop = Infinity, maxLeft = -Infinity, maxTop = -Infinity;
        objects.forEach(obj => {
          const left = obj.left;
          const top = obj.top;
          const right = left + obj.width * obj.scaleX;
          const bottom = top + obj.height * obj.scaleY;
          if (left < minLeft) minLeft = left;
          if (top < minTop) minTop = top;
          if (right > maxLeft) maxLeft = right;
          if (bottom > maxTop) maxTop = bottom;
        });
        const selectionWidth = maxLeft - minLeft;
        const selectionHeight = maxTop - minTop;
        objects.forEach(obj => {
          switch(action) {
            case 'left':
              obj.set({ left: minLeft });
              break;
            case 'center':
              obj.set({ left: minLeft + (selectionWidth - obj.width * obj.scaleX) / 2 });
              break;
            case 'right':
              obj.set({ left: maxLeft - obj.width * obj.scaleX });
              break;
            case 'top':
              obj.set({ top: minTop });
              break;
            case 'middle':
              obj.set({ top: minTop + (selectionHeight - obj.height * obj.scaleY) / 2 });
              break;
            case 'bottom':
              obj.set({ top: maxTop - obj.height * obj.scaleY });
              break;
            case 'back': canvas.sendToBack(obj); break;
            case 'backward': canvas.sendBackwards(obj); break;
            case 'forward': canvas.bringForward(obj); break;
            case 'front': canvas.bringToFront(obj); break;
          }
        });
        activeObject.setCoords();
      } else {
        // Single object: align to canvas as before
        switch(action) {
          case 'back': canvas.sendToBack(activeObject); break;
          case 'backward': canvas.sendBackwards(activeObject); break;
          case 'forward': canvas.bringForward(activeObject); break;
          case 'front': canvas.bringToFront(activeObject); break;
          case 'right': activeObject.set({ left: canvas.width - activeObject.width * activeObject.scaleX }); break;
          case 'center': activeObject.set({ left: (canvas.width - activeObject.width * activeObject.scaleX) / 2 }); break;
          case 'left': activeObject.set({ left: 0 }); break;
          case 'top': activeObject.set({ top: 0 }); break;
          case 'middle': activeObject.set({ top: (canvas.height - activeObject.height * activeObject.scaleY) / 2 }); break;
          case 'bottom': activeObject.set({ top: canvas.height - activeObject.height * activeObject.scaleY }); break;
        }
      }
      canvas.requestRenderAll();
    }
    // Attach event listeners to dropdown buttons
    document.getElementById('dropdownCopyBtn')?.addEventListener('click', handleCopy);
    document.getElementById('dropdownCutBtn')?.addEventListener('click', handleCut);
    document.getElementById('dropdownPasteBtn')?.addEventListener('click', handlePaste);
    document.getElementById('dropdownDeleteBtn')?.addEventListener('click', handleDeleteAndCloseDropdown);
    document.getElementById('dropdownGroupBtn')?.addEventListener('click', handleGroup);
    document.getElementById('dropdownUngroupBtn')?.addEventListener('click', handleUngroup);
    // Arrange buttons
    document.getElementById('arrangeBackBtn')?.addEventListener('click', () => handleArrange('back'));
    document.getElementById('arrangeBackwardBtn')?.addEventListener('click', () => handleArrange('backward'));
    document.getElementById('arrangeForwardBtn')?.addEventListener('click', () => handleArrange('forward'));
    document.getElementById('arrangeFrontBtn')?.addEventListener('click', () => handleArrange('front'));
    document.getElementById('arrangeRightBtn')?.addEventListener('click', () => handleArrange('right'));
    document.getElementById('arrangeCenterBtn')?.addEventListener('click', () => handleArrange('center'));
    document.getElementById('arrangeLeftBtn')?.addEventListener('click', () => handleArrange('left'));
    document.getElementById('arrangeTopBtn')?.addEventListener('click', () => handleArrange('top'));
    document.getElementById('arrangeMiddleBtn')?.addEventListener('click', () => handleArrange('middle'));
    document.getElementById('arrangeBottomBtn')?.addEventListener('click', () => handleArrange('bottom'));
    // Text style tab
    document.getElementById('fontColorInput')?.addEventListener('input', function(e) {
      const obj = getActiveObj();
      if (obj && obj.set) { obj.set('fill', e.target.value); obj.canvas.requestRenderAll(); }
    });
    document.getElementById('fontSizeInput')?.addEventListener('input', function(e) {
      const obj = getActiveObj();
      if (obj && obj.set) { obj.set('fontSize', parseInt(e.target.value)); obj.canvas.requestRenderAll(); }
    });
    document.getElementById('textContentInput')?.addEventListener('input', function(e) {
      const obj = getActiveObj();
      if (obj && obj.set) { obj.set('text', e.target.value); obj.canvas.requestRenderAll(); }
    });
  });
})();

// ...existing code...
// settings-dropdown-advanced.js
// Advanced dropdown logic for settings panel in Canva-like editor

(function() {

  // Wait for Fabric.js and canvas to be ready before running dropdown logic
  function onFabricReady() {
    // Update Size tab inputs to show real bounding box (real estate) dimensions
    function updateSizeInputs(obj) {
      if (!obj) return;
      const bounds = obj.getBoundingRect(true, true);
      document.getElementById('widthInput').value = Math.round(bounds.width * 10) / 10;
      document.getElementById('heightInput').value = Math.round(bounds.height * 10) / 10;
      document.getElementById('xInput').value = Math.round(obj.left * 10) / 10;
      document.getElementById('yInput').value = Math.round(obj.top * 10) / 10;
      document.getElementById('rotateInput').value = (typeof obj.angle === 'number' ? Math.round(obj.angle * 10) / 10 : 0);
    }
    // Expose for global use
    window.updateSizeInputs = updateSizeInputs;

    // Apply input changes to object, adjusting scale so bounding box matches input
    function applySizeInput(obj, prop, value) {
      if (!obj) return;
      value = parseFloat(value);
      if ((prop === 'width' || prop === 'height') && value > 0) {
        // Iteratively adjust scale (and width for text) so bounding box matches input
        let maxTries = 10;
        let epsilon = 0.5; // px tolerance
        let lastDiff = 9999;
        for (let i = 0; i < maxTries; i++) {
          const bounds = obj.getBoundingRect(true, true);
          let current = prop === 'width' ? bounds.width : bounds.height;
          let diff = value - current;
          if (Math.abs(diff) < epsilon || Math.abs(diff) >= Math.abs(lastDiff)) break;
          lastDiff = diff;
          if ((obj.type === 'textbox' || obj.type === 'text' || obj.type === 'i-text') && prop === 'width') {
            obj.set({ width: value });
          } else {
            if (prop === 'width' && bounds.width > 0) {
              obj.set({ scaleX: obj.scaleX * (value / bounds.width) });
            }
            if (prop === 'height' && bounds.height > 0) {
              obj.set({ scaleY: obj.scaleY * (value / bounds.height) });
            }
          }
          obj.setCoords();
        }
      } else if (prop === 'left') {
        obj.set({ left: value });
      } else if (prop === 'top') {
        obj.set({ top: value });
      } else if (prop === 'angle') {
        obj.set({ angle: value });
      }
      obj.canvas && obj.canvas.requestRenderAll();
    }

    // Setup Size tab event listeners
    function setupSizeTab() {
      const w = document.getElementById('widthInput');
      const h = document.getElementById('heightInput');
      const x = document.getElementById('xInput');
      const y = document.getElementById('yInput');
      const r = document.getElementById('rotateInput');
      [w, h, x, y, r].forEach((el) => {
        el.addEventListener('input', function() {
          const obj = getActiveObj();
          if (!obj) return;
          if (el === w) applySizeInput(obj, 'width', el.value);
          if (el === h) applySizeInput(obj, 'height', el.value);
          if (el === x) applySizeInput(obj, 'left', el.value);
          if (el === y) applySizeInput(obj, 'top', el.value);
          if (el === r) applySizeInput(obj, 'angle', el.value);
          // After changing, update the size inputs to reflect the new real bounding box
          setTimeout(() => updateSizeInputs(obj), 0);
        });
        // Also update on 'change' event for up/down arrows
        el.addEventListener('change', function() {
          const obj = getActiveObj();
          if (!obj) return;
          if (el === w) applySizeInput(obj, 'width', el.value);
          if (el === h) applySizeInput(obj, 'height', el.value);
          if (el === x) applySizeInput(obj, 'left', el.value);
          if (el === y) applySizeInput(obj, 'top', el.value);
          if (el === r) applySizeInput(obj, 'angle', el.value);
          setTimeout(() => updateSizeInputs(obj), 0);
        });
      });
      // Up/down arrow buttons
      document.querySelectorAll('.size-row').forEach(row => {
        const input = row.querySelector('.size-input');
        const up = row.querySelector('.size-up');
        const down = row.querySelector('.size-down');
        if (up && input) up.addEventListener('click', () => { input.stepUp(); input.dispatchEvent(new Event('change')); });
        if (down && input) down.addEventListener('click', () => { input.stepDown(); input.dispatchEvent(new Event('change')); });
      });
    }

    // Listen for selection changes
    function setupCanvasListeners() {
      if (!window.canvas) return;
      window.canvas.on('selection:created', function(e) { updateSizeInputs(e.target); });
      window.canvas.on('selection:updated', function(e) { updateSizeInputs(e.target); });
      window.canvas.on('object:modified', function(e) { updateSizeInputs(e.target); });
      window.canvas.on('after:render', function() {
        const obj = getActiveObj();
        if (obj) updateSizeInputs(obj);
      });
    }
    // Helper to get active object (now in correct scope)
    function getActiveObj() {
      return window.canvas && window.canvas.getActiveObject ? window.canvas.getActiveObject() : null;
    }

    // Actually use setupSizeTab and setupCanvasListeners
    document.addEventListener('DOMContentLoaded', function () {
      setupSizeTab();
      setupCanvasListeners();
    });
  } // <-- Close onFabricReady

  // Poll for Fabric.js and window.canvas
  function waitForFabricAndCanvas(retries = 30) {
    if (window.fabric && window.canvas && typeof window.canvas.on === 'function') {
      onFabricReady();
    } else if (retries > 0) {
      setTimeout(() => waitForFabricAndCanvas(retries - 1), 100);
    } else {
      console.error('Fabric.js canvas not initialized in time for settings dropdown.');
    }
  }

  waitForFabricAndCanvas();
  // --- DEBUGGING: Print canvas and event listener state ---
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function() {
      console.log('[DEBUG] window.fabric:', typeof window.fabric !== 'undefined');
      console.log('[DEBUG] window.canvas:', window.canvas);
      const w = document.getElementById('widthInput');
      if (w) {
        const listeners = getEventListeners ? getEventListeners(w) : 'n/a';
        console.log('[DEBUG] widthInput listeners:', listeners);
      } else {
        console.log('[DEBUG] widthInput not found');
      }
    }, 1000);
  });

})(); // <-- Close IIFE

// (removed unreachable code after refactor)
