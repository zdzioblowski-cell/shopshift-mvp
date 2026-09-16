# SHOPSHIFT 0.12.0 — wycena i cele

## Wdrożony zakres

Wartość firmy obok gotówki, sześć kolejnych celów, jeden aktywny cel z paskiem i następnym kamieniem, termin 14 dni, ponawianie, grant i trwałe odblokowania. Podsumowanie dnia pokazuje wycenę oraz ukończenie lub niepowodzenie celu. W Rozwoju widoczna jest cała droga. Zachowano istniejące lokale, limity pracowników i rozbudowę za wysyłki.

## Model danych

Definicje `GOALS` w silniku zawierają `id`, `title`, `description`, `type`, `target`, `windowDays`, `stage`, `reward`. Stan zapisu `progression` zawiera `version`, `startedDay`, `stage`, `unlocks`, `grants`, `goals`. Stan celu: `id`, `startDay`, `progress`, `status` (`locked`, `active`, `completed`, `failed`), `completedDay`, `failedDay`, `attempt`, `rewardClaimed`. Brak kary finansowej. Stan początkowy starego zapisu nie wypłaca nagród podczas migracji: pierwsze rozliczenie następuje przy zamknięciu dnia.

Funkcje: `valuation`, `goalProgress`, `progressionInit`, `progressionClose`, `retryGoal`, `progressionValid`. Odczyt UI nie przyznaje nagrody. Silnik wykonuje rozliczenie jednego celu po zapisie wyniku zamkniętego dnia, uruchamiając następny od kolejnego dnia. Import sprawdza spójność stanu celów i nagród. Istniejący klucz localStorage pozostaje niezmieniony.

## Wycena

Minimum 7 zamkniętych dni, średnia z maksymalnie 14 ostatnich. Dodatni średni zysk netto × 365 × mnożnik. Przy niedostatecznej historii UI pokazuje kreskę, przy stracie wycena zyskowa wynosi 0. Nie uwzględnia bieżącego niezamkniętego dnia ani grantu. To score scenariusza, nie gotówka ani cena transakcyjna.

Mnożnik bazowy 3.0; suma ograniczona do 0.5–8:

- Wzrost: dopiero pełne ostatnie 30 i wcześniejsze 30 dni. Przy dodatnim wzroście dodatek min(2, 0.5 + 3 × wzrost).
- Retencja: repeat rate klientów z wysyłką co najmniej 10% daje min(1.5, 0.5 + 2.5 × (repeat − 0.1)).
- Kanały: co najmniej dwa kanały z minimum 10% sprzedaży każdy dają +0.3, kolejne po +0.35 do +1. Brak pełnych danych kanałów wyłącza tę korektę i karę koncentracji.
- Marża netto ponad 10% daje min(1, 0.3 + 3.5 × (marża − 0.1)).
- Jeden kanał powyżej 80% sprzedaży: −0.7. Ujemna gotówka: −1.
- Zadłużenie powyżej 25% majątku brutto: −0.5; powyżej 50%: −1. Majątek obejmuje dodatnią gotówkę, zapasy, dostawy i rezerwacje.

Annualizacja może szybko dawać milionowe wartości przy wysokim dziennym zysku. Progi zachowano ze specyfikacji; ich tempo wymaga dalszych playtestów. Wycenę i składniki można sprawdzić w Finansach i przez „Jak liczymy wycenę?”.

## Cele i źródła postępu

1. Rozruch: suma przychodów zamkniętych dni ≥50 000 zł oraz dodatni łączny wynik netto. Jednorazowy grant 5000 zł. Grant zwiększa gotówkę i `progression.grants`, jest oddzielną pozycją uzgodnienia gotówki. W uproszczonej ekonomii gry jest wyłączony z wyniku i podatku; nie udaje przychodu ze sprzedaży ani nie zwiększa wyceny.
2. Zdrowa marża: suma zysku netto od dnia aktywacji przez 14 dni ≥10 000 zł. Wcześniejszy zysk nie liczy się. Ostatni dzień okna może przynieść sukces. Po niepowodzeniu ponowienie w fazie planowania rozpoczyna nowe pełne 14 dni. Nagroda: `preferentialLoan`.
3. Lojalność: `crmMetrics.repeatRate` ≥25%, na podstawie faktycznych klientów z wysyłką. Nagroda: `winback`.
4. Skala: wycena ≥250 000 zł. Nagroda `warehouse` pozwala przenieść się z poziomu 1 do centrum wysyłek bez wymogu 100 wysyłek; nadal wymaga kosztu przeprowadzki i fazy planowania.
5. Własna marka: wycena ≥500 000 zł. Nagroda `privateLabel`.
6. Milion: wycena ≥1 mln. Nagroda `endgame`.

Silnik postępu obsługuje też definicje celu obrotu dziennego, AOV produktów oraz kolejnych dni ROAS/LTV:CAC powyżej progu. Brak wartości wskaźnika przerywa serię. Te typy nie dodają nowych aktywnych celów do pierwszej szóstki.

## Zaczepy na następne etapy

`preferentialLoan`, `winback`, `privateLabel` i `endgame` to trwałe uprawnienia, jasno opisane jako przyszłe scenariusze. Nie wypłacają jeszcze 20 000 zł, nie umarzają długu i nie uruchamiają nowego kanału. Warunki pożyczki preferencyjnej i mechanika jej umorzenia wymagają oddzielnego wdrożenia. Podobnie marketplace, DE/CZ, VC, przejęcia, zdarzenia, IPO, exit i imperium. Interfejs nie obiecuje działającej funkcji, która jest tylko wpisem odblokowania.

Nagrody boost i prestiż oraz scenariusze przetrwania pozostają przyszłymi rozszerzeniami. Gra pozostaje w istniejącej architekturze JavaScript + localStorage; migracja do React nie jest potrzebna do tej warstwy.

## Weryfikacja

95 testów silnika; dodatkowo przeglądarka: start, wycena, modal objaśnień, przyznanie grantu, ekran nagrody, kolejny cel, odświeżenie bez drugiej wypłaty, drabina i układ 390 px.
