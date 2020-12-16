function PressureMeasured ({ pressure, occurredAt }) {
  return { eventType: 'PressureMeasured', pressure, occurredAt }
}

function MedicineDoseApplied ({ medicie, occurredAt }) {
  return { eventType: 'MedicineDoseApplied', medicie, occurredAt }
}

function DoctorNotified ({ occurredAt }) {
  return { eventType: 'DoctorNotified', occurredAt }
}
