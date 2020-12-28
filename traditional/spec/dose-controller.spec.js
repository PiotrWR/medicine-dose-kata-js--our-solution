const MedicinePump = require("../dependencies/medicine-pump");
const HealthMonitor = require("../dependencies/health-monitor");
const AlertService = require("../dependencies/alert-service");
const DoseController = require("../src/dose-controller");

describe("Dose Controller", function () {
  let medicinePump;
  let doseController;

  beforeEach(function () {
    console.log("Przed testem");
  });

  function given({ pressure, whenDoseMedicineForFirstTime, medicine = "LowerPressure", timeSinceLastDoseInMinutes = 31 }) {
    medicinePump = {
      dose: whenDoseMedicineForFirstTime
        ? jest
            .fn()
            .mockImplementationOnce(whenDoseMedicineForFirstTime)
            .mockImplementationOnce(() => {})
        : jest.fn(), //funckja, której wywołania będziemy sledzić
      getTimeSinceLastDoseInMinutes: function (medicine) {
        return timeSinceLastDoseInMinutes;
      },
    };
    const healthMonitor = {
      getSystolicBloodPressure: function () {
        return pressure;
      },
    };
    const alertService = AlertService();

    doseController = DoseController(healthMonitor, medicinePump, alertService);
  }

  it("Gdy ciśnienie spadnie poniżej 90, podaj 1 dawkę leku podnoszącego ciśnienie.", () => {
    //given
    given({
      pressure: 89,
    });

    //when
    doseController.checkHealthAndApplyMedicine();

    //then
    sprobowanoPodacLek({
      name: "RaisePressure",
      count: 1,
    });
  });

  it("Gdy ciśnienie spadnie poniżej 60, podaj 2 dawki leku podnoszącego ciśnienie.", () => {
    given({
      pressure: 59,
    });

    doseController.checkHealthAndApplyMedicine();

    sprobowanoPodacLek({
      name: "RaisePressure",
      count: 2,
    });
  });

  it("Gdy ciśnienie wzrośnie powyżej 150, podaj lek obniżający ciśnienie.", () => {
    given({
      pressure: 160,
    });

    doseController.checkHealthAndApplyMedicine();

    sprobowanoPodacLek({
      name: "LowerPressure",
      count: 1,
    });
  });

  it("Gdy pompa nie zadziała 1 raz (rzuci Error), ponów próbę.", () => {
    given({
      pressure: 160,
      whenDoseMedicineForFirstTime: () => {
        throw new Error("Za szybki ruch ręką!");
      },
    });

    doseController.checkHealthAndApplyMedicine();

    const expectedMedicine = {
      name: "LowerPressure",
      count: 1,
    };
    expect(medicinePump.dose.mock.calls.map((call) => call[0])).toEqual([expectedMedicine, expectedMedicine]);
  });

  it("Nie podawaj leku, jeśli od ostatniej dawki upłynęło 30 minut lub mniej.", () => {
    given({
      pressure: 160,
      timeSinceLastDoseInMinutes: 30,
    });

    doseController.checkHealthAndApplyMedicine();

    expect(medicinePump.dose).not.toBeCalledWith({
      name: "LowerPressure",
      count: 1,
    });
  });

  function sprobowanoPodacLek({ name, count }) {
    expect(medicinePump.dose).toBeCalledWith({
      name,
      count,
    });
  }
});
