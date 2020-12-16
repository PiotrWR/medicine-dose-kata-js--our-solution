const MedicinePump = require('../dependencies/medicine-pump')
const HealthMonitor = require('../dependencies/health-monitor')
const AlertService = require('../dependencies/alert-service')
const DoseController = require('../src/dose-controller')


describe('Dose Controller', function () {

  let medicinePump;
  let doseController;

  beforeEach(function () {
  })

  function given ({ pressure }) {
    medicinePump = {
      dose: jest.fn(), //funckja, której wywołania będziemy sledzić
      getTimeSinceLastDoseInMinutes: function (medicine) {
        // we don't care what the implementation of this method is
      }
    }
    const healthMonitor = {
      getSystolicBloodPressure: function () {
        return pressure
      }
    }
    const alertService = AlertService()

    doseController = DoseController(healthMonitor, medicinePump, alertService)
  }

  it('Gdy ciśnienie spadnie poniżej 90, podaj 1 dawkę leku podnoszącego ciśnienie.', () => {
    //given
    given({ pressure: 89 })

    //when
    doseController.checkHealthAndApplyMedicine()

    //then
    dosedMedicine({ name: "RaisePressure", count: 1 })
  })

  it('Gdy ciśnienie spadnie poniżej 60, podaj 2 dawki leku podnoszącego ciśnienie.', () => {
    given({ pressure: 59 })

    doseController.checkHealthAndApplyMedicine()

    dosedMedicine({ name: "RaisePressure", count: 2 })
  })

  it('Gdy ciśnienie wzrośnie powyżej 150, podaj lek obniżający ciśnienie.', () => {
    given({ pressure: 160 })

    doseController.checkHealthAndApplyMedicine()

    dosedMedicine({ name: "LowerPressure", count: 1 })
  })

  function dosedMedicine({name, count}){
    expect(medicinePump.dose).toBeCalledWith({ name, count })
  }

})
