function DoseController(healthMonitor, medicinePump, alertService) {
  // ! wartość ciśnienia / funkcja do podania leku / powiadomienie lekarza
  return {
    checkHealthAndApplyMedicine: checkHealthAndApplyMedicine,
    // checkIsGivenDosedMedicine: checkIsGivenDosedMedicine,
  };

  function checkHealthAndApplyMedicine() {
    const pressure = healthMonitor.getSystolicBloodPressure();
    try {
      if (pressure < 55) {
        alertService.notifyDoctor();
        medicinePump.dose({
          name: "RaisePressure",
          count: 3,
        });
      } else if (medicinePump.getTimeSinceLastDoseInMinutes() > 30) {
        if (pressure < 60) {
          medicinePump.dose({
            name: "RaisePressure",
            count: 2,
          });
        } else if (pressure > 150) {
          medicinePump.dose({
            name: "LowerPressure",
            count: 1,
          });
        } else {
          medicinePump.dose({
            name: "RaisePressure",
            count: 1,
          });
        }
      }
    } catch (e) {
      // checkIsGivenDosedMedicine();
      checkHealthAndApplyMedicine();
    }
  }
}
module.exports = DoseController;
