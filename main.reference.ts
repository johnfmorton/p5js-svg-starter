import './style.css'

// Import p5 module
import p5 from 'p5'
import init, { p5SVG } from 'p5.js-svg'

import { random, seedPRNG, spline, pointsInPath } from '@georgedoescode/generative-utils'

init(p5)

// p5 sketch
const sketch = (p: p5SVG) => {

  // SVG is sized to be a full 8 1/2 x 11 inch document when opened in InkScape
  const width = 1056
  const height = 816

  p.setup = () => {
    // Setup the canvas
    p.createCanvas(width, height, p.SVG)

    // Don't loop the draw function
    p.noLoop()
  }

  p.draw = () => {
    // Set background color
    p.background(256)

    // No fill color for all shapes
    p.noFill()

    // Draw a circle
    p.circle(p.width / 4, p.height / 4, 50)

    // Draw a rectangle
    p.rect(p.width * 0.75 - 25, p.height * 0.75 - 25, 50, 50)

    // Draw a line

    p.line(p.width / 2 - 25, p.height / 2 - 25, p.width / 2 + 25, p.height / 2 + 25)
  }

  // listen to #save-button click event
  document.getElementById('save-button')?.addEventListener('click', () => {
    // get a timestamp
    const timestamp = new Date().getTime()

    p.save(`sketch-${timestamp}.svg`)
  })
}

// Create a new p5 instance and attach the sketch
new p5(sketch, document.getElementById('sketch'))
