function ApplyMedicineDose ({ medicie }) {
  return { commandType: 'ApplyMedicineDose', medicie }
}

function MeasurePressure () {
  return { commandType: 'CheckHealth' }
}
