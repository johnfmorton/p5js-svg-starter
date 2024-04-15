import './style.css'

// Import p5 module
import p5 from 'p5'
import init, { p5SVG } from 'p5.js-svg'

import { createQtGrid, randomBias, randomSnap, random } from '@georgedoescode/generative-utils'

init(p5)

let pInstance;

// p5 sketch
const sketch = (p: p5SVG) => {
  // Assign the sketch instance to the global variable
  pInstance = p

  // SVG is sized to be a full 8 1/2 x 11 inch document when opened in InkScape
  const width = 1056
  const height = 816

  // const colors: string[] = ['#7257fa', '#ffd53d', '#1D1934', '#F25C54']
  const colors: string[] = ['#00C5F0', '#96F000', '#BC00F0', '#F07000', '#84349B', '#386670']
  type Color = (typeof colors)[number]

  p.setup = () => {
    // Setup the canvas
    // p.createCanvas(width, height, p.SVG)
    p.createCanvas(width, height)

    // Don't loop the draw function
    p.noLoop()
  }

  p.draw = () => {
    // clear the background
    p.clear();

    // Set background color
    p.background(256)

    // No fill color for all shapes
    p.noFill()

    const focus = {
      x: random(0, width),
      y: random(0, height)
    }

    const points = [...Array(100)].map(() => {
      return {
        x: randomBias(0, width, focus.x, 1),
        y: randomBias(0, height, focus.y, 1),
        width: 2,
        height: 2
      }
    })

    const grid = createQtGrid({ width, height, points, gap: 0, maxQtObjects: 3, maxQtLevels: 100 })

    // loop through the grid.areas

    grid.areas.forEach(area => {
      // set the color for this loop
      const color1 = p.random(colors)
      // set the stroke color
      // p.stroke(color1)
      // p.fill(color1)

      // draw the rect for the background
      p.rectMode(p.CORNER)
      // draw the ellipse
      // p.rect(area.x, area.y, area.width, area.height)

      const centerX = area.x + area.width / 2
      const centerY = area.y + area.height / 2

      // Push matrix to save current transformation state
      p.push()

      p.translate(centerX, centerY)
      // pick a new fill color
      let color2: Color
      do {
        color2 = p.random(colors)
      } while (color2 === color1) // Continue looping until the color is different

      // p.fill(color2)
      p.stroke(color2)

      // the area.height and area.width may not be the same
      // get the smaller of the two
      const minDimension = Math.min(area.width, area.height)

      const dimensionOffset = random(2, 2.5)



      // in the center of the rect, draw a circle
      p.ellipse(0, 0, minDimension / dimensionOffset, minDimension / dimensionOffset)

      // fillCircleRadial(0, 0, minDimension / dimensionOffset, 20, true)
      // fillCircleConcentric(0, 0, minDimension / dimensionOffset, 20, true)

      jankyFillEllipse(0, 0, (minDimension / dimensionOffset)-5, (minDimension / dimensionOffset) -5, 3)


      // pick a new fill color
      let color3: Color
      do {
        color3 = p.random(colors)
      } while (color3 === color1 || color3 === color2) // Continue looping until the color is different

      // p.fill(color1)




      p.stroke(color1)

      p.rectMode(p.CENTER)

      // get a random angle between 0 and 2PI
      const angle = random(0, p.TWO_PI)



      p.rotate(angle)

      // in the center of the rect, draw a circle
      // p.rect(0, 0, minDimension / 3, minDimension / 3)


      // jankyFilledRect(0, 0, minDimension / 3, minDimension / 3, 3, true)

      // Pop matrix to restore previous transformation state
      p.pop()
      // reset the rotation
      // p.resetMatrix()
    })

    console.clear()
    console.log('grid', grid.areas)
  }
}

document.getElementById('save-button')?.addEventListener('click', () => {
  const timestamp = new Date().getTime()
  pInstance.save(`sketch-${timestamp}.svg`)
})

document.getElementById('regenerate-button')?.addEventListener('click', () => {
  pInstance.redraw()
})


// fill rect
function filledRect(x, y, w, h, lineSpacing, centerFill = true) {
  // Draw the boundary of the rectangle
  pInstance.stroke(0) // Set stroke color
  pInstance.noFill() // No fill for the boundary

  // Determine the start point for the fill
  let startY = y

  // Start drawing horizontal lines within the rectangle
  pInstance.push() // Save the current drawing settings

  for (let i = startY; i < y + h; i += lineSpacing) {

    if (centerFill) {
        pInstance.line(x - w / 2, i - w / 2, x + w - w / 2, i - w / 2)
      } else {
        pInstance.line(x, i, x + w, i)
      }
  }
  pInstance.pop() // Restore the drawing settings
}


// fill rect
function jankyFilledRect(x, y, w, h, lineSpacing, centerFill = true) {
  // Draw the boundary of the rectangle
  pInstance.stroke(0) // Set stroke color
  pInstance.noFill() // No fill for the boundary

  // Determine the start point for the fill
  let startY = y

  // Start drawing horizontal lines within the rectangle
  pInstance.push() // Save the current drawing settings

  for (let i = startY; i < y + h; i += lineSpacing) {

    let jankyI = i + randomSnap(-1, 1, 0.5)
    let jankyEnd = i + randomSnap(-1, 1, 0.5)

    if (centerFill) {
        pInstance.line(x - w / 2, jankyI - w / 2, x + w - w / 2, jankyEnd - w / 2)
      } else {
        pInstance.line(x, jankyI, x + w, jankyI)
      }
  }
  pInstance.pop() // Restore the drawing settings
}


function fillCircleConcentric(cx, cy, radius, lineSpacing, centerFill = true) {
  // Draw the boundary of the circle
  pInstance.stroke(0) // Set stroke color
  pInstance.noFill() // No fill for the boundary
  pInstance.ellipse(cx, cy, 2 * radius, 2 * radius) // Draw the outer circle

  // Start drawing concentric circles within the main circle
  pInstance.push() // Save the current drawing settings

  // Draw concentric circles from the center to the radius
  for (let r = radius - lineSpacing; r > 0; r -= lineSpacing) {
    pInstance.ellipse(cx, cy, 2 * r, 2 * r)
  }

  pInstance.pop() // Restore the drawing settings
}

// fillCircle function using radial lines
function fillCircleRadial(cx, cy, radius, lineSpacing, centerFill = true) {
  // Draw the boundary of the circle
  pInstance.stroke(0); // Set stroke color
  pInstance.noFill(); // No fill for the boundary
  pInstance.ellipse(cx, cy, 2 * radius, 2 * radius); // Draw the outer circle

  // Start drawing radial lines within the circle
  pInstance.push(); // Save the current drawing settings

  // Calculate the number of lines based on the circumference and line spacing
  const numLines = Math.floor(2 * Math.PI * radius / lineSpacing);
  const angleStep = 2 * Math.PI / numLines; // Angle between each line

  for (let i = 0; i < numLines; i++) {
    let angle = i * angleStep;
    let x = cx + radius * Math.cos(angle);
    let y = cy + radius * Math.sin(angle);
    pInstance.line(cx, cy, x, y); // Draw line from center to the edge
  }

  pInstance.pop(); // Restore the drawing settings
}

// fillEllipse function using horizontal lines
function fillEllipse(cx, cy, width, height, lineSpacing) {
  // Draw the boundary of the ellipse
  pInstance.stroke(0); // Set stroke color
  pInstance.noFill(); // No fill for the boundary
  // pInstance.ellipse(cx, cy, width, height); // Draw the outer ellipse

  // Start drawing horizontal lines within the ellipse
  pInstance.push(); // Save the current drawing settings

  // Calculate y coordinates where lines will be drawn
  let startY = cy - height / 2;
  let endY = cy + height / 2;

  for (let y = startY; y <= endY; y += lineSpacing) {
    // Calculate the x coordinates of the intersection of the line with the ellipse
    let deltaY = cy - y; // Vertical distance from the center
    let part = deltaY / (height / 2); // Normalized vertical distance
    let xLength = (width / 2) * Math.sqrt(1 - part * part); // Horizontal distance from the center

    let startX = cx - xLength;
    let endX = cx + xLength;

    if (xLength > 0) { // Check if the calculated width is positive
      pInstance.line(startX, y, endX, y); // Draw the horizontal line within the ellipse
    }
  }

  pInstance.pop(); // Restore the drawing settings
}

// fillEllipse function using horizontal lines
function jankyFillEllipse(cx, cy, width, height, lineSpacing) {
  // Draw the boundary of the ellipse
  pInstance.stroke(0) // Set stroke color
  pInstance.noFill() // No fill for the boundary
  // pInstance.ellipse(cx, cy, width, height); // Draw the outer ellipse

  // Start drawing horizontal lines within the ellipse
  pInstance.push() // Save the current drawing settings

  // Calculate y coordinates where lines will be drawn
  let startY = cy - height / 2
  let endY = cy + height / 2

  for (let y = startY; y <= endY; y += lineSpacing) {

    // Calculate the x coordinates of the intersection of the line with the ellipse
    let deltaY = cy - y // Vertical distance from the center
    let part = deltaY / (height / 2) // Normalized vertical distance
    let xLength = (width / 2) * Math.sqrt(1 - part * part) // Horizontal distance from the center

    let startX = cx - xLength
    let endX = cx + xLength

    let jankyStartX = startX + randomSnap(-1, 1, 0.5)
    let jankyEnd = endX + randomSnap(-1, 1, 0.5)
    let jankyY = y + random(-1, 1, 0.5)
    let jankyY2 = y + random(-1, 1, 0.5)

    if (xLength > 0) {
      // Check if the calculated width is positive
      pInstance.line(jankyStartX, jankyY, jankyEnd, jankyY2) // Draw the horizontal line within the ellipse
    }
  }

  pInstance.pop() // Restore the drawing settings
}

// Create a new p5 instance and attach the sketch
new p5(sketch, document.getElementById('sketch'))
