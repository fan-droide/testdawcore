import '@dawcore/components'

const editor = document.getElementById('editor')
editor.audioContext = new AudioContext()

const micBtn = document.getElementById('mic-btn')
const recordBtn = document.querySelector('daw-record-button')
let trackCounter = 0

micBtn.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    editor.recordingStream = stream
    micBtn.textContent = 'Mic enabled'
    micBtn.disabled = true
  } catch (err) {
    micBtn.textContent = 'Mic denied: ' + err.message
  }
})

recordBtn.addEventListener('click', async (e) => {
  if (editor.isRecording) return
  e.stopImmediatePropagation()

  if (!editor.recordingStream) {
    alert('Click "Enable Mic" first')
    return
  }

  if (!editor.selectedTrackId) {
    trackCounter++
    const track = document.createElement('daw-track')
    track.setAttribute('name', 'Take ' + trackCounter)
    editor.appendChild(track)

    const trackId = await new Promise((resolve) => {
      editor.addEventListener('daw-track-connected', (e) => resolve(e.detail.trackId), { once: true })
    })
    editor._setSelectedTrackId(trackId)
  }

  await editor.startRecording(editor.recordingStream, { overdub: true })
}, { capture: true })
