const MAX_FRETS = 24

const ROMAN_FLAT = [
  "I", "bII", "II", "bIII", "III", "IV", "bV", "V", "bVI", "VI", "bVII", "VII"
]

const SEMI_TONES_SHARP = [
  "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#"
]
const SEMI_TONES_FLAT = [
  "E", "F", "Gb", "G", "Ab", "A", "Bb", "B", "C", "Db", "D", "Eb"
]

const MAJOR_STEPS = [2, 2, 1, 2, 2, 2, 1]
const MAJOR_ABS = [0, 2, 4, 5, 7, 9, 11]

const SCALES = [
  { MAJOR:      majorScaleRotation(0) },
  { DORIAN:     majorScaleRotation(0) },
  { PHRYGIAN:   majorScaleRotation(0) },
  { LYDIAN:     majorScaleRotation(0) },
  { MIXOLYDIAN: majorScaleRotation(0) },
  { MINOR:      majorScaleRotation(0) },
  { LOCRIAN:    majorScaleRotation(0) },
]

function majorScaleRotation(root) {
  arrayRotate(MAJOR_ABS)
}

function scale(toneList, steps) {
  return steps.map(step => toneList[step])
}

const REVERSE_MAP_SHARP = reverseMap(SEMI_TONES_SHARP)
const REVERSE_MAP_FLAT = reverseMap(SEMI_TONES_FLAT)

function reverseMap(noteList) {
  return noteList.reduce((hash, note, idx) => {
    return Object.assign(hash, {
      [note]: idx
    })
  }, {})
}

function findTheFifth(noteName) {
  var obj = findNote(noteName)
  var idx = obj.map[noteName]
  return obj.array[(idx + 7) % obj.array.length]
}

function findNote(noteName) {
  if (REVERSE_MAP_FLAT[noteName]) {
    return { map: REVERSE_MAP_FLAT, array: SEMI_TONES_FLAT }
  } else {
    return { map: REVERSE_MAP_SHARP, array: SEMI_TONES_SHARP }
  }
}


// UI

const strings = document.querySelectorAll("string")
const keys = document.getElementById("keys")
let key = "E"

function getNote(string, fret) {
  var base = findNote(key)
  return [
    arrayRotate(base.array, 0),
    arrayRotate(base.array, 7),
    arrayRotate(base.array, 3),
    arrayRotate(base.array, 10),
    arrayRotate(base.array, 5),
    arrayRotate(base.array, 0),
  ][string][fret % 12]
}

function arrayRotate(arr, n) {
  // ["A", "B", "C"], 1 -> ["B", "C", "A"]
  // ["A", "B", "C"], 2 -> ["C", "A", "B"]
  return arr.slice(n).concat(arr.slice(0, n))
}

render()

keys.addEventListener("change", function (evt) {
  key = evt.target.value
  render()
})

window.addEventListener("keyup", function (evt) {
  switch (evt.keyCode) {
    case 38:
      key = findNextKey(1)
      break
    case 40:
      key = findNextKey(-1)
      break
  }
  render()
})

function findNextKey(n) {
  var idx = 0
  while (key !== keys.children[idx].value) {
    idx++
  }
  return keys.children[idx+n].value
}

// add keys
for(let i = 0; i < 11; i++) {
  let sharp = SEMI_TONES_SHARP[i]
  let flat = SEMI_TONES_FLAT[i]
  if (sharp !== flat) {
    makeKey(flat, flat)
  }
  makeKey(sharp, sharp)
}

function makeKey(value, text) {
  return keys.appendChild(
    Object.assign(
      document.createElement("option"),
      { value, text }
    )
  )
}

function render() {
  let base = findNote(key)
  let idx = base.map[key]
  let theScale = scale(arrayRotate(base.array, idx), MAJOR_ABS)

  strings.forEach((stringEl, stringNum) => {
    stringEl.children.length = 0
    while (stringEl.lastChild) {
      stringEl.removeChild(stringEl.lastChild)
    }
    for (let i = 0; i < MAX_FRETS; i++) {
      let fret = document.createElement("fret")
      let note = getNote(stringNum, i)
      fret.innerHTML = note

      if (theScale.includes(note)) {
        fret.classList.add("in-key")
      }
      stringEl.appendChild(fret)
    }
  })
}