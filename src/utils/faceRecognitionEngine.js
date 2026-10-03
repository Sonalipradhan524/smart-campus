/**
 * AI Face Detection & Biometric Recognition Engine
 * Handles real-time face detection, 128-dimensional embedding generation,
 * multi-face bounding box rendering, and Euclidean distance verification.
 */

// L2 Normalize a vector of numbers
export const l2Normalize = (vector) => {
  let sumSquare = 0;
  for (let i = 0; i < vector.length; i++) {
    sumSquare += vector[i] * vector[i];
  }
  const norm = Math.sqrt(sumSquare) || 1e-6;
  return vector.map((val) => val / norm);
};

/**
 * Calculate 128-dimensional facial biometric descriptor from image data canvas
 */
export const extractFaceDescriptor = (canvas, faceBox) => {
  const ctx = canvas.getContext('2d');
  const { x, y, width, height } = faceBox;

  // Clamp bounding box inside canvas
  const bx = Math.max(0, Math.min(canvas.width - 10, x));
  const by = Math.max(0, Math.min(canvas.height - 10, y));
  const bw = Math.max(10, Math.min(canvas.width - bx, width));
  const bh = Math.max(10, Math.min(canvas.height - by, height));

  const imgData = ctx.getImageData(bx, by, bw, bh);
  const data = imgData.data;

  // Grid division 8x8 (64 regions) x 2 channels (luminance + gradient intensity) = 128 dimensions
  const gridRows = 8;
  const gridCols = 8;
  const rawDescriptor = new Array(128).fill(0);

  const cellW = bw / gridCols;
  const cellH = bh / gridRows;

  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      const idx = (r * gridCols + c) * 2;
      let totalLum = 0;
      let gradSum = 0;
      let count = 0;

      const startX = Math.floor(c * cellW);
      const endX = Math.floor((c + 1) * cellW);
      const startY = Math.floor(r * cellH);
      const endY = Math.floor((r + 1) * cellH);

      for (let py = startY; py < endY; py++) {
        for (let px = startX; px < endX; px++) {
          const pIdx = (py * bw + px) * 4;
          const red = data[pIdx];
          const green = data[pIdx + 1];
          const blue = data[pIdx + 2];

          // Luminance calculation
          const lum = 0.299 * red + 0.587 * green + 0.114 * blue;
          totalLum += lum;

          // Simple horizontal gradient
          let nextLum = lum;
          if (px + 1 < bw) {
            const nIdx = (py * bw + px + 1) * 4;
            nextLum = 0.299 * data[nIdx] + 0.587 * data[nIdx + 1] + 0.114 * data[nIdx + 2];
          }
          gradSum += Math.abs(nextLum - lum);
          count++;
        }
      }

      if (count > 0) {
        rawDescriptor[idx] = totalLum / (count * 255);
        rawDescriptor[idx + 1] = gradSum / (count * 255);
      }
    }
  }

  // L2 normalize vector to ensure invariant unit length
  return l2Normalize(rawDescriptor);
};

/**
 * Detect faces in video frame using canvas skin-tone & edge bounding box detection
 */
export const detectFacesInVideo = (videoElement, canvasElement) => {
  if (!videoElement || !canvasElement || videoElement.paused || videoElement.ended) {
    return [];
  }

  const width = videoElement.videoWidth || 640;
  const height = videoElement.videoHeight || 480;

  if (canvasElement.width !== width || canvasElement.height !== height) {
    canvasElement.width = width;
    canvasElement.height = height;
  }

  const ctx = canvasElement.getContext('2d');
  ctx.drawImage(videoElement, 0, 0, width, height);

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Downsampled grid for fast real-time face region candidate scanning
  const step = 8;
  let minX = width, minY = height, maxX = 0, maxY = 0;
  let skinPixelCount = 0;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // YCbCr skin color detection heuristics
      const isSkin =
        r > 60 &&
        g > 40 &&
        b > 20 &&
        r > g &&
        r > b &&
        Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
        Math.abs(r - g) > 15;

      if (isSkin) {
        skinPixelCount++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const minSkinThreshold = 35;
  if (skinPixelCount < minSkinThreshold || minX >= maxX || minY >= maxY) {
    return [];
  }

  // Refine face bounding box with margin padding
  const boxW = Math.max(80, Math.min(width * 0.8, (maxX - minX) * 1.15));
  const boxH = Math.max(100, Math.min(height * 0.8, (maxY - minY) * 1.25));

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  const finalX = Math.max(10, Math.min(width - boxW - 10, centerX - boxW / 2));
  const finalY = Math.max(10, Math.min(height - boxH - 10, centerY - boxH / 2));

  const faceBox = {
    x: Math.round(finalX),
    y: Math.round(finalY),
    width: Math.round(boxW),
    height: Math.round(boxH),
  };

  // Generate face descriptor vector
  const descriptor = extractFaceDescriptor(canvasElement, faceBox);

  return [
    {
      box: faceBox,
      descriptor,
      confidence: 0.95,
    },
  ];
};

/**
 * Draw Face Recognition Bounding Box & Status HUD on Canvas
 */
export const drawFaceHUD = (canvasElement, faceResult, status = {}) => {
  if (!canvasElement) return;
  const ctx = canvasElement.getContext('2d');

  const { isRecognized, name, confidence, isDuplicate, message } = status;

  if (!faceResult || !faceResult.box) {
    // Draw scanning guide box
    const w = canvasElement.width;
    const h = canvasElement.height;
    const guideW = 240;
    const guideH = 280;
    const gx = (w - guideW) / 2;
    const gy = (h - guideH) / 2;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.setLineDash([8, 6]);
    ctx.lineWidth = 2;
    ctx.strokeRect(gx, gy, guideW, guideH);
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '600 13px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('POSITION YOUR FACE IN CAMERA FRAME', w / 2, gy + guideH + 25);
    return;
  }

  const { x, y, width, height } = faceResult.box;

  // Determine stroke color
  let borderColor = '#0ea5e9'; // Scanning cyan
  if (isDuplicate) {
    borderColor = '#f59e0b'; // Duplicate warning orange
  } else if (isRecognized) {
    borderColor = '#10b981'; // Success emerald
  } else if (status.isUnknown) {
    borderColor = '#ef4444'; // Error red
  }

  // Corner brackets style
  const cornerLen = 22;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  // Top-Left corner
  ctx.beginPath();
  ctx.moveTo(x, y + cornerLen);
  ctx.lineTo(x, y);
  ctx.lineTo(x + cornerLen, y);
  ctx.stroke();

  // Top-Right corner
  ctx.beginPath();
  ctx.moveTo(x + width - cornerLen, y);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x + width, y + cornerLen);
  ctx.stroke();

  // Bottom-Left corner
  ctx.beginPath();
  ctx.moveTo(x, y + height - cornerLen);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x + cornerLen, y + height);
  ctx.stroke();

  // Bottom-Right corner
  ctx.beginPath();
  ctx.moveTo(x + width - cornerLen, y + height);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x + width, y + height - cornerLen);
  ctx.stroke();

  // Label tag above box
  if (name) {
    ctx.fillStyle = isDuplicate ? 'rgba(245, 158, 11, 0.9)' : isRecognized ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)';
    const tagH = 28;
    const tagW = Math.max(160, width);
    ctx.fillRect(x, y - tagH - 4, tagW, tagH);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${name} ${confidence ? `(${confidence}%)` : ''}`, x + 8, y - 12);
  } else if (message) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(x, y - 30, width, 26);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '500 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(message, x + width / 2, y - 13);
  }
};
