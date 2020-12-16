function DoseController (healthMonitor, medicinePump, alertService) {

  return {
    checkHealthAndApplyMedicine: checkHealthAndApplyMedicine
  }

  function checkHealthAndApplyMedicine () {
    const pressure = healthMonitor.getSystolicBloodPressure()
    if (pressure < 60) {
      medicinePump.dose({ name: "RaisePressure", count: 2 })
    } else {
      medicinePump.dose({ name: "RaisePressure", count: 1 })
    }
  }

}

module.exports = DoseController
