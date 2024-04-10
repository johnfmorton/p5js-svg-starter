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

    // loop through the number of points we want to draw
    let numPoints = 300

    // create a random seed
    // seedPRNG(1)

    // create a random path
    const path = Array.from({ length: numPoints }, () => [random(0, width), random(0, height)])

    // create a line by looping over the path
    p.beginShape()

    path.forEach(([x, y]) => {
      p.vertex(x, y)
    })

    p.endShape()

    // console.log(points)
    console.clear()
    console.log('path', path)
  }

  // listen to #save-button click event
  document.getElementById('save-button')?.addEventListener('click', () => {
    // get a timestamp
    const timestamp = new Date().getTime()

    p.save(`sketch-${timestamp}.svg`)
  })

  // listen to #regenerate-button click event
  document.getElementById('regenerate-button')?.addEventListener('click', () => {
    // redraw the canvas
    p.redraw()
  })

}

// Create a new p5 instance and attach the sketch
new p5(sketch, document.getElementById('sketch'))
