(function(win, doc) {
  const width = win.innerWidth
  const docEl = doc.documentElement

  docEl.style.fontSize = `${width / 23.4375}px`
  win.addEventListener('resize', () => {
    const newWidth = win.innerWidth
    docEl.style.fontSize = `${newWidth / 23.4375}px`
  })

  doc.body.style.fontSize = '16px'
})(window, document)