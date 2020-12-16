Wearables stają się coraz bardziej popularne. Powoli wkraczają też do świata medycyny.

Twoim zadaniem będzie napisanie kontrolera do SmartWatcha, który na podstawie stanu pacjenta dobierze odpowiednią porcję
 leku.

Aby poznać stan pacjenta, SmartWatch komunikuje się po Bluetooth Low Energy z niewielkim urządzeniem monitorującym 
ciśnienie krwi pacjenta (skurczowe).

Aby podać lek, SmartWatch komunikuje się ze specjalną pompą, podającą lek do krwi pacjenta.

Twój kontroler powinien obsłużyć następujące przypadki:

1. Gdy ciśnienie spadnie poniżej 90, podaj 1 dawkę leku podnoszącego ciśnienie.
2. Gdy ciśnienie spadnie poniżej 60, podaj 2 dawki leku podnoszącego ciśnienie.
3. Gdy ciśnienie wzrośnie powyżej 150, podaj lek obniżający ciśnienie. 
5. Gdy pompa nie zadziała (może się to zdarzyć przy intensywnym ruchu ręką), ponów próbę.
6. Nie podawaj leku, jeśli od ostatniej dawki upłynęło 30 minut lub mniej.
7. Gdy ciśnienie spadnie poniżej 55, najpierw wyślij alarm do lekarza, następnie podaj
 3 dawki leku podnoszącego ciśnienie