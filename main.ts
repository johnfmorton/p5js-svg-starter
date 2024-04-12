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
        width: 15,
        height: 15
      }
    })

    const grid = createQtGrid({ width, height, points, gap: 0, maxQtObjects: 3, maxQtLevels: 100 })

    // loop through the grid.areas

    grid.areas.forEach(area => {
      // set the color for this loop
      const color1 = p.random(colors)
      // set the stroke color
      p.stroke(color1)
      p.fill(color1)

      // draw the rect for the background
      p.rectMode(p.CORNER)
      // draw the ellipse
      p.rect(area.x, area.y, area.width, area.height)

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

      p.fill(color2)
      p.stroke(color2)

      // the area.height and area.width may not be the same
      // get the smaller of the two
      const minDimension = Math.min(area.width, area.height)

      // in the center of the rect, draw a circle
      p.ellipse(0, 0, minDimension / 1.1, minDimension / 1.1)

      // pick a new fill color
      let color3: Color
      do {
        color3 = p.random(colors)
      } while (color3 === color1 || color3 === color2) // Continue looping until the color is different

      p.fill(color3)
      p.stroke(color3)

      p.rectMode(p.CENTER)

      // we will rotate the rect by a random amount
      // get a random angle between 0 and 2PI
      const angle = random(0, p.TWO_PI)

      p.rotate(angle)

      // in the center of the rect, draw a circle
      p.rect(0, 0, minDimension / 3, minDimension / 3)

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


// Create a new p5 instance and attach the sketch
new p5(sketch, document.getElementById('sketch'))
