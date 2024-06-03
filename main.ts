import './src/css/input.css'

// Import p5 module
import p5 from 'p5'
import init, { p5SVG } from 'p5.js-svg'
import { createQtGrid, createVoronoiDiagram, randomBias, randomSnap, random, seedPRNG } from '@georgedoescode/generative-utils'
import { dialogController } from './src/dialog'
import { sanitizeFilename, initUrlParams, setPageTitle } from './src/utils'
import { createGui } from './src/createGui';

// Initialize dialog controller
dialogController.init({
  dialogId: 'about-dialog',
  closeBtId: 'close-dialog'
})

init(p5)

let pInstance: p5SVG

// initialize the obj with the default values
const obj = {
  // canvas options
  title: 'Pen Plotter Project', // string
  width: 1056, // number (8.5 x 11 inch document)
  height: 816, // number (8.5 x 11 inch document)
  // sketch specific functions to be added to GUI controls
  redraw: () => {
    pInstance.redraw()
  },
  saveSvg: () => {
    const timestamp = new Date().getTime()
    pInstance.save(`${sanitizeFilename(obj.title)}_${timestamp}.svg`)
  },
  resize: () => {
    pInstance.resizeCanvas(obj.width, obj.height)
  },
  seedWord: 'helloWorld', // string
  newSeedValue: () => {
    let randomSeed = Math.random().toString(36).substring(7)
    console.log('newSeedValue in main', randomSeed)
    obj.seedWord = randomSeed
    seedPRNG(obj.seedWord)
    // this will trigger a redraw on the sketch
    // by calling redraw() method
  },
  about: () => dialogController.open(),
}

// Initialize the sketch by syncronizing the URL params with the sketch properties obj
// This will also update the URL params if they are not in sync with the obj properties
initUrlParams(obj)

// Create the GUI, passing the obj and the p5 instance
// p5 instance is needed to redraw the sketch when the seed word is changed
// TODO: Customize this GUI for your sketch
createGui(obj)

// p5 sketch
const sketch = (p: p5SVG) => {
  // Assign the sketch instance to the global variable
  pInstance = p

  // SVG is sized to be a full 8 1/2 x 11 inch document when opened in InkScape

  const getWidth = () => obj.width
  const getHeight = () => obj.height

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

    // No fill color for all shapes
    p.noFill()

    // draw a rect for the background
    p.rectMode(p.CORNER)

    const width = obj.width
    const height = obj.height

    const inset = 25

    p.rect(0 + inset, 0 + inset, width - inset * 2, height - inset * 2)

    const insetWidth = width - inset * 2
    const insetHeight = height - inset * 2

    const focus = {
      x: random(0, insetWidth),
      y: random(0, insetHeight)
    }

    const points = [...Array(100)].map(() => {
      return {
        x: randomBias(0, insetWidth, focus.x, 1),
        y: randomBias(0, insetHeight, focus.y, 1),
        width: 15,
        height: 15
      }
    })
    p.push()
    // Draw the points
    // color the points
    p.fill('#ff0000')
    p.stroke('#00ff00')
    p.strokeWeight(1)
    points.forEach(point => {
      p.ellipse(point.x + inset, point.y + inset, point.width, point.height)
    })
    p.pop()

    let voronoi = createVoronoiDiagram({
      width: insetWidth,
      height: insetHeight,
      points: points,
      relaxIterations: 3
    })
    // debugger;
    voronoi.cells.forEach(cell => {
      console.log(cell);
      p.push()
      p.noFill()
      p.stroke('#0000ff')
      p.strokeWeight(1)
      p.ellipse(cell.centroid.x + inset, cell.centroid.y + inset, 10, 10)

      // p.beginShape()
      // cell.halfedges.forEach(halfedge => {
      //   const v = halfedge.getStartpoint()
      //   p.vertex(v.x + inset, v.y + inset)
      // })
      // p.endShape(p.CLOSE)
      p.pop()
    })

  }
}

// Create a new p5 instance and attach the sketch
new p5(sketch, document.getElementById('sketch'))
