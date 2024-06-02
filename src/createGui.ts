import GUI from 'lil-gui'

import { addUrlParam, setPageTitle } from './utils'

const gui = new GUI().title('Sketch controls')

export function createGui(obj) {
  gui.add(obj, 'about').name('About this sketch')
  gui.add(obj, 'redraw').name('Redraw');
  const _seedWordInGui = gui
    .add(obj, 'seedWord')
    .name('Seed word')
    .onChange(() => {
      addUrlParam('seedWord', obj.seedWord, obj)
    })
  gui
    .add(obj, 'newSeedValue')
    .name('Generate new seed')
    .onChange(() => {
      _seedWordInGui.setValue(obj.seedWord).updateDisplay()
      addUrlParam('seedWord', obj.seedWord, obj)
      // trigger the redraw function
      obj.redraw()
    })
  gui.add(obj, 'saveSvg').name('Save SVG')

  // Create a folder for canvas options
  const canvasOption = gui.addFolder('Canvas options')
  // Close the folder by default
  canvasOption.close()

  canvasOption.add(obj, 'title').onFinishChange(() => {
    setPageTitle(obj.title)
    addUrlParam('title', obj.title, obj)
  })
  canvasOption.add(obj, 'width').onFinishChange(() => {
    addUrlParam('width', obj.width, obj)
  });
  canvasOption.add(obj, 'height').onFinishChange(() => {
    addUrlParam('height', obj.height, obj)
  })
  canvasOption.add(obj, 'resize').name('Refresh Canvas')
}
