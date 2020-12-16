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

  function given({ pressure, medicine = "LowerPressure" }) {
    medicinePump = {
      dose: jest.fn(), //funckja, której wywołania będziemy sledzić
      getTimeSinceLastDoseInMinutes: jest.fn().mockReturnValueOnce(10).mockReturnValueOnce(1),
    };
    // getTimeSinceLastDoseInMinutes: jest.fn(medicine).mockReturnValueOnce(10).mockReturnValueOnce(1),
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
    dosedMedicine({
      name: "RaisePressure",
      count: 1,
    });
  });

  it("Gdy ciśnienie spadnie poniżej 60, podaj 2 dawki leku podnoszącego ciśnienie.", () => {
    given({
      pressure: 59,
    });

    doseController.checkHealthAndApplyMedicine();

    dosedMedicine({
      name: "RaisePressure",
      count: 2,
    });
  });

  it("Gdy ciśnienie wzrośnie powyżej 150, podaj lek obniżający ciśnienie.", () => {
    given({
      pressure: 160,
    });

    doseController.checkHealthAndApplyMedicine();

    dosedMedicine({
      name: "LowerPressure",
      count: 1,
    });
  });

  // ! Jesli podano lek i po tym czas od podania leku wynosi Więcej niż 2 minuty to ponów próbe

  it("Gdy pompa nie zadziała 1 raz, ponów próbę.", () => {
    given({
      pressure: 160,
      medicine: "LowerPressure",
    });

    doseController.checkHealthAndApplyMedicine();

    dosedMedicine({
      name: "LowerPressure",
      count: 1,
    });
    expect(medicinePump.getTimeSinceLastDoseInMinutes.mock.results.map((it) => it.value)).toEqual([10, 1]);

    expect(medicinePump.getTimeSinceLastDoseInMinutes.mock.calls.length).toBe(2);
  });

  function dosedMedicine({ name, count }) {
    expect(medicinePump.dose).toBeCalledWith({
      name,
      count,
    });
  }
});
