export default {
  base: '/testdawcore/',
  optimizeDeps: {
    exclude: ['@waveform-playlist/worklets', '@waveform-playlist/recording'],
    include: ['soundfont2', 'react', 'react-dom'],
  },
}
