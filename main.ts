import './style.css'

// Import p5 module
import p5 from 'p5'
import init, { p5SVG } from 'p5.js-svg'

import { createQtGrid, randomBias, randomSnap, random } from '@georgedoescode/generative-utils'

init(p5)



// p5 sketch
const sketch = (p: p5SVG) => {

  // SVG is sized to be a full 8 1/2 x 11 inch document when opened in InkScape
  const width = 1056
  const height = 816

  // const colors: string[] = ['#7257fa', '#ffd53d', '#1D1934', '#F25C54']
  const colors: string[] = ['#00C5F0', '#96F000', '#BC00F0', '#F07000', '#84349B', '#386670']
  type Color = (typeof colors)[number]

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

    const focus = {
      x: random(0, width),
      y: random(0, height)
    }

    const points = [...Array(100)].map(() => {
      return {
        x: randomBias(0, width, focus.x, 1),
        y: randomBias(0, height, focus.y, 1),
        width: 5,
        height: 5
      }
    })

    const grid = createQtGrid({ width, height, points, gap: 0, maxQty: 6 });

    // loop through the grid.areas

    grid.areas.forEach(area => {
      // set the color for this loop
      const color = p.random(colors)
      // set the stroke color
      p.stroke(color)
      p.fill(color)

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
      let fillColor: Color
      do {
        fillColor = p.random(colors)
      } while (fillColor === color) // Continue looping until the color is different

      p.fill(fillColor)
      p.stroke(fillColor)

      // the area.height and area.width may not be the same
      // get the smaller of the two
      const minDimension = Math.min(area.width, area.height)

      // in the center of the rect, draw a circle
      p.ellipse(0, 0, minDimension / 2, minDimension / 2)

      // pick a new fill color
      let fillColor2: Color
      do {
        fillColor2 = p.random(colors)
      } while (fillColor2 === color || fillColor2 === fillColor) // Continue looping until the color is different

      p.fill(fillColor2)
      p.stroke(fillColor2)

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
      p.resetMatrix()
    })

    console.clear()
    console.log('grid', grid)
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
