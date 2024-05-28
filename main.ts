import './src/css/input.css'

// Import p5 module
import p5 from 'p5'
import init, { p5SVG } from 'p5.js-svg'

import GUI from 'lil-gui'
import { createQtGrid, randomBias, randomSnap, random, seedPRNG } from '@georgedoescode/generative-utils'

import { dialogController } from './src/dialog'
import { sanitizeFilename } from './src/utils'

// Initialize dialog controller
dialogController.init({
  dialogId: 'about-dialog',
  closeBtId: 'close-dialog'
})

init(p5)

let pInstance: p5SVG



const gui = new GUI().title('Sketch controls')
const obj = {
  title: 'Pen Plotter Experiment', // string
  drawRectLines: false, // checkbox
  redraw: () => {
    setPageTitle(obj.title)
    pInstance.redraw()
  },
  saveSvg: () => {
    const timestamp = new Date().getTime()
    pInstance.save(`${sanitizeFilename(obj.title)}_${timestamp}.svg`)
  },
  resize: () => {
    pInstance.resizeCanvas(obj.width, obj.height)
  },
  about: () => dialogController.open(),
  width: 1056,
  height: 816,
  lineSpacingForCircles: 3,
  lineSpacingForSquares: 3,
  centerTheRect: true,
  chanceOfJanky: 0.5,
  drawOvals: false,
  seedWord: 'helloWorld'
}

// check URL params
const urlParams = new URLSearchParams(window.location.search)

// for each URL param, set the value in the obj
// to restore the state of the sketch
urlParams.forEach((value, key) => {
  if (obj.hasOwnProperty(key)) {
    // if the key is a function defined in the obj, exit
    if (typeof obj[key] === 'function') {
      console.error(`Key ${key} is a function in the obj`)
      return
    }
    // if key is a number, set the value as a number
    if (!isNaN(Number(value))) {
      // debugger;

      obj[key] = Number(value)
    } else if (value === 'true' || value === 'false') {
      obj[key] = value === 'true'
    } else {
      obj[key] = value
    }
  }
})

function addUrlParam(key: string, value: string | number | boolean) {
  // store existing params
  const params = new URLSearchParams(window.location.search)
  // don't store functions
  if (typeof obj[key] === 'function') {
    console.error(`Key ${key} is a function in the obj`)
    return
  }
  // set the new value
  params.set(key, value as string)
  console.log('addUrlParam', params.toString())

  window.history.pushState({}, '', `?${params}`) // set the new URL
}

// save all the obj params to the URL except functions
for (const key in obj) {
  addUrlParam(key, obj[key])
}

gui.add(obj, 'about').name('About this sketch')
gui
  .add(obj, 'chanceOfJanky', 0, 1)
  .name('Chance of janky')
  .step(0.01)
  .onFinishChange(() => {
    //addUrlParam('chanceOfJanky', obj.chanceOfJanky)
  })
gui
  .add(obj, 'lineSpacingForCircles', 1, 10)
  .name('Circles line spacing')
  .step(1)
  .onFinishChange(() => {
    //addUrlParam('lineSpacingForCircles', obj.lineSpacingForCircles)
  })
gui
  .add(obj, 'lineSpacingForSquares', 1, 10)
  .name('Squares line spacing')
  .step(1)
  .onFinishChange(() => {
    //addUrlParam('lineSpacingForSquares', obj.lineSpacingForSquares)
  })
gui
  .add(obj, 'drawRectLines')
  .name('Draw the grid?')
  .onFinishChange(() => {
    //addUrlParam('drawRectLines', obj.drawRectLines)
  })
gui
  .add(obj, 'centerTheRect')
  .name('Center the rectabgles?')
  .onFinishChange(() => {
    //addUrlParam('centerTheRect', obj.centerTheRect)
  })
gui.add(obj, 'drawOvals').name('Draw ovals').onFinishChange(() => {
  addUrlParam('drawOvals', obj.drawOvals)
})

gui.add(obj, 'redraw').name('Redraw')
function randomSeed() {
  let randomSeed = Math.random().toString(36).substring(7)
  obj.seedWord = randomSeed
  seedWordInGui.setValue(randomSeed)
  seedWordInGui.updateDisplay()
  seedPRNG(obj.seedWord)
  addUrlParam('seedWord', obj.seedWord)
  pInstance.redraw()
}

// gui.add(obj, 'redrawWithNewSeed').name('New seed')
gui.add({ randomSeed }, 'randomSeed').name('New seed')
const seedWordInGui = gui
  .add(obj, 'seedWord')
  .name('Seed word')
  .onFinishChange(() => {
    seedPRNG(obj.seedWord)
    addUrlParam('seedWord', obj.seedWord)
  })
gui.add(obj, 'saveSvg').name('Save SVG')

const canvasOption = gui.addFolder('Canvas options')
canvasOption.close()
canvasOption.add(obj, 'title').onFinishChange(() => {
  setPageTitle(obj.title)
  addUrlParam('title', obj.title)
})
canvasOption.add(obj, 'width')
canvasOption.add(obj, 'height')
canvasOption.add(obj, 'resize').name('Reset Canvas')

// p5 sketch
const sketch = (p: p5SVG) => {
  // Assign the sketch instance to the global variable
  pInstance = p

  // SVG is sized to be a full 8 1/2 x 11 inch document when opened in InkScape

  const getWidth = () => obj.width
  const getHeight = () => obj.height

  // const colors: string[] = ['#7257fa', '#ffd53d', '#1D1934', '#F25C54']
  const colors: string[] = ['#00C5F0', '#96F000', '#BC00F0', '#F07000', '#84349B', '#386670']
  type Color = (typeof colors)[number]

  setPageTitle(obj.title)

  p.setup = () => {
    // Setup the canvas
    p.createCanvas(getWidth(), getHeight(), p.SVG)
    // Don't loop the draw function
    p.noLoop()
  }

  p.draw = () => {
    seedPRNG(obj.seedWord)

    // clear the background
    p.clear()

    // Set background color
    // p.background(256)

    // No fill color for all shapes
    p.noFill()

    const focus = {
      x: random(0, getWidth()),
      y: random(0, getHeight())
    }

    const points = [...Array(100)].map(() => {
      return {
        x: randomBias(0, getWidth(), focus.x, 1),
        y: randomBias(0, getHeight(), focus.y, 1),
        width: 2,
        height: 2
      }
    })

    const width = obj.width
    const height = obj.height

    let grid = createQtGrid({ width, height, points, gap: 0, maxQtObjects: 3, maxQtLevels: 100 })

    // loop through the grid.areas

    grid.areas.forEach((area: { x: number; y: number; width: number; height: number }) => {
      // set the color for this loop
      const color1 = p.random(colors)
      // set the stroke color
      // p.stroke(color1)
      // p.fill(color1)

      // draw the rect for the background
      p.rectMode(p.CORNER)
      // draw a rectabgle for the area. You may want to turn this off
      if (obj.drawRectLines) {
        p.rect(area.x, area.y, area.width, area.height)
      }

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
      // p.stroke(color2)

      // the area.height and area.width may not be the same
      // get the smaller of the two
      const minDimension = Math.min(area.width, area.height)

      const dimensionOffset = random(0.5, 2.75)

      // get a random angle between 0 and 2PI
      const angle1 = random(0, p.TWO_PI)

      // get a randon number between 0 and 1
      const randomNum = random(0, 1)
      // console.log('randomNum', randomNum)

      // if (randomNum > 0.95) {
      // in the center of the rect, draw a circle
      if (obj.drawOvals) {
        if (randomNum > obj.chanceOfJanky) {
          p.ellipse(0, 0, minDimension / dimensionOffset, minDimension / dimensionOffset)
        } else {
          p.ellipse(
            random(1, 3),
            random(1, 3),
            minDimension / dimensionOffset - random(0, 20),
            minDimension / dimensionOffset - random(0, 20)
          )
        }
      }

      // }

      // fillCircleRadial(0, 0, minDimension / dimensionOffset, 20, true)
      // fillCircleConcentric(0, 0, minDimension / dimensionOffset, 20, true)
      p.rotate(angle1)
      if (randomNum < obj.chanceOfJanky) {
        jankyFillEllipse(
          0,
          0,
          minDimension / dimensionOffset - 5,
          minDimension / dimensionOffset - 5,
          obj.lineSpacingForCircles
        )
      } else {
        // non janky
        fillEllipse(
          0,
          0,
          minDimension / dimensionOffset - 5,
          minDimension / dimensionOffset - 5,
          obj.lineSpacingForCircles
        )
      }
      // pick a new fill color
      let color3: Color
      do {
        color3 = p.random(colors)
      } while (color3 === color1 || color3 === color2) // Continue looping until the color is different

      // p.fill(color1)

      p.stroke(color1)

      p.rectMode(p.CENTER)

      // get a random angle between 0 and 2PI
      const angle2 = random(0, p.TWO_PI)

      p.rotate(angle2)

      if (randomNum > obj.chanceOfJanky) {
        // in the center of the rect, draw a circle
        // p.rect(0, 0, minDimension / 3, minDimension / 3)
        filledRect(0, 0, minDimension / 3, minDimension / 3, obj.lineSpacingForSquares, obj.centerTheRect)
      } else {
        jankyFilledRect(0, 0, minDimension / 3, minDimension / 3, obj.lineSpacingForSquares, obj.centerTheRect)
      }
      // Pop matrix to restore previous transformation state
      p.pop()
      // reset the rotation
      // p.resetMatrix()
    })

    // console.clear()
    // console.log('grid', grid.areas)
  }
}

// fill rect
function filledRect(x: number, y: number, w: number, h: number, lineSpacing: number, centerFill = true) {
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
function jankyFilledRect(x: number, y: number, w: number, h: number, lineSpacing: number, centerFill = true) {
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

function fillCircleConcentric(cx: any, cy: any, radius: number, lineSpacing: number, centerFill = true) {
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
function fillCircleRadial(cx: number, cy: number, radius: number, lineSpacing: number, centerFill = true) {
  // Draw the boundary of the circle
  pInstance.stroke(0) // Set stroke color
  pInstance.noFill() // No fill for the boundary
  pInstance.ellipse(cx, cy, 2 * radius, 2 * radius) // Draw the outer circle

  // Start drawing radial lines within the circle
  pInstance.push() // Save the current drawing settings

  // Calculate the number of lines based on the circumference and line spacing
  const numLines = Math.floor((2 * Math.PI * radius) / lineSpacing)
  const angleStep = (2 * Math.PI) / numLines // Angle between each line

  for (let i = 0; i < numLines; i++) {
    let angle = i * angleStep
    let x = cx + radius * Math.cos(angle)
    let y = cy + radius * Math.sin(angle)
    pInstance.line(cx, cy, x, y) // Draw line from center to the edge
  }

  pInstance.pop() // Restore the drawing settings
}

// fillEllipse function using horizontal lines
function fillEllipse(cx: number, cy: number, width: number, height: number, lineSpacing: number) {
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

    if (xLength > 0) {
      // Check if the calculated width is positive
      pInstance.line(startX, y, endX, y) // Draw the horizontal line within the ellipse
    }
  }

  pInstance.pop() // Restore the drawing settings
}

// fillEllipse function using horizontal lines
function jankyFillEllipse(cx: number, cy: number, width: number, height: number, lineSpacing: number) {
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

function setPageTitle(title: string) {
  document.title = title
  // find the h1 element and set the text
  const h1 = document.querySelector('h1')
  if (h1) {
    h1.textContent = title
  }
}

// Create a new p5 instance and attach the sketch
new p5(sketch, document.getElementById('sketch'))
