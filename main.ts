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
// initialize the obj with the default values
const obj = {
  title: 'Pen Plotter Project', // string
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
gui
  .add(obj, 'drawOvals')
  .name('Draw ovals')
  .onFinishChange(() => {
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

    // draw a rect for the background
    p.rectMode(p.CORNER)
    const inset = 20
    p.rect(0 + inset, 0 + inset, width - inset * 2, height - inset * 2)


  }
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
