# SHOPSHIFT

Grywalny prototyp zarządzania sklepem kosmetycznym. Kup towar, ustal ceny, uruchom kampanię, pakuj i wysyłaj zamówienia. Obrót nie zawsze oznacza zysk.

## Jak zagrać

Gra jest dostępna pod adresem https://zdzioblowski-cell.github.io/shopshift-mvp/. Lokalnie otwórz index.html lub uruchom npm start. Bez instalowania zależności.

Zacznij od 10–20 sztuk Dewdrop i 10 sztuk Cloud Nine. Wybierz kanały reklamowe i budżety, zapisz plan, otwórz dzień, spakuj i wyślij paczki, a następnie sprawdź wynik finansowy.

## Feedback

Przycisk „Przekaż opinię” otwiera formularze GitHub Issues. Zgłoszenia są publiczne i wymagają konta GitHub; granie nie wymaga konta.

## Zapis i prywatność

Postęp jest zapisywany lokalnie w przeglądarce. Można go eksportować/importować w Opcjach. Wydanie nie ma analityki, reklam sieciowych ani własnego backendu. Zapis z localhost nie przenosi się automatycznie na publiczny adres.

## Zakres MVP 0.8.0

6 fikcyjnych kosmetyków, 2 dostawców, 5 ścieżek marketingowych, ceny i zapasy, pakowanie, wysyłka, opinie, zwroty, pełny rachunek wyniku, 3 poziomy magazynu i pracownik. Kolorystyka: czerń, szarości i czerwień. Brak VAT, podatków, amortyzacji i natywnych pakietów mobilnych. Wszystkie produkty i dostawcy są fikcyjni.

## Kod i testy

engine.js — niezależny silnik ekonomii; app.js — interfejs i zapis; scene.js — grafika Canvas; feedback.js — formularze opinii; style.css — wygląd. npm test uruchamia 38 testów ekonomii, w tym pełną symulację 30 dni. Node.js 18 lub nowszy wymagany tylko do testów i opcjonalnego lokalnego serwera.

## Rozgrywka na żywo

Po otwarciu dnia zamówienia pojawiają się pojedynczo w losowych odstępach 10–50 sekund. Ceny, reklama i reputacja nadal określają wielkość popytu. Towar rezerwowany jest dopiero po nadejściu zamówienia.

Postać chodzi do regału, zabiera produkt, pakuje i odnosi paczkę. Cykl trwa 16 sekund, a z pracownikiem 9 sekund. Bez zamówień przygotowuje stanowisko. Gracz nadal zleca wysyłkę i zamyka dzień; może też pomóc ręcznie w pakowaniu.

Nowe zamówienie wyświetla baner i krótki dźwięk. Dźwięk jest domyślnie włączony i uruchamia się po pierwszym kliknięciu lub użyciu klawiatury (ograniczenie przeglądarek). Można go wyciszyć; wybór jest zapamiętywany.

Pauza, otwarte okno dialogowe i ukryta karta zatrzymują przyjmowanie oraz pakowanie. Gra nie nalicza zdarzeń za czas nieobecności. Zapis przechowuje kolejkę, pozostały czas do zamówienia oraz etap pakowania. Starsze zapisy są obsługiwane: przyjęte wcześniej zamówienia są pakowane automatycznie; nowy rytm napływu zaczyna się w kolejnym dniu.

Wcześniejsze zamknięcie dnia anuluje przyjęte, niewysłane zamówienia i rezygnuje z pozostałego popytu; reklama nie jest zwracana.

Test interfejsu w rzeczywistym czasie: zainstaluj opcjonalnie Playwright (`npm install --no-save playwright`, `npx playwright install chromium`), następnie `npm run test:browser`. Sprawdza także dźwięk, pauzę i animację. Test trwa około minuty.


## Ekonomia 0.3

Google Ads, Meta/Facebook, Instagram, TikTok i artykuły zewnętrzne z niezależnymi budżetami. Koszty agencji: domyślnie 1500 zł/miesiąc + 10% budżetu reklam i treści. SEO ma 30-dniowe opóźnienie. Nowy sklep ma minimalny ruch organiczny.

Promocje: obniżka, kupon START i 3+1. Koszyki 1–3 sztuki, a w 3+1 cztery sztuki tego samego produktu. Osobno rozliczane są kurier, opakowanie, płatności, wynagrodzenie i narzut pracodawcy oraz narzędzia. Stawki można edytować przed otwarciem dnia.

Zobacz [REALIA.md](REALIA.md) lub ekran „Koszty → Źródła i ograniczenia modelu”. Są tam źródła i wyraźnie oznaczone założenia. Nie ma jeszcze dokładnej księgowości VAT/podatków, a CPC i konwersje nie pochodzą z danych konkretnego sklepu.

## Wersja 0.8.0 — sklep działa na żywo

Zamówienia klientów: losowe odstępy 10–50 sekund. Towar można zamawiać w każdej fazie; każdy zakup przyjeżdża po losowych 1–5 minutach aktywnej gry. Przed startem kampanii warto poczekać na pierwszą dostawę. Brak towaru przy nadejściu klienta oznacza utracone zamówienie. Sesje napływają na żywo i reagują na aktualne ceny i promocje.

Dostawy są opłacane od razu, zajmują pojemność magazynu i zachowują pozostały czas przy zmianie dnia i zapisie. Pauza, ukryta karta oraz otwarte okno dialogowe zatrzymują zegar.

Przyciski nad magazynem: Zamów towar, Zmień ceny, Promocje, Marketing. Ceny, rabaty i darmową dostawę można zmieniać podczas sprzedaży; nowe ustawienia dotyczą kolejnych zamówień. Przyjęte zamówienia zachowują warunki zakupu. Budżety początkowe i koszty stałe ustala się przed otwarciem dnia; podczas kampanii można dokupić ruch.

## Analityka i dynamiczny popyt — 0.8.0

Analityka pokazuje wyłącznie fikcyjny sklep: rzeczywiście zasymulowane sesje, oglądanie produktów, koszyki, przejścia do kasy, przyjęte zakupy i wysłaną sprzedaż według źródła. Nie instalujemy Google Analytics i nie śledzimy graczy. Każdy zakup przypisujemy źródłu jednej sesji; powroty użytkowników i wielokanałowa atrybucja nie są modelowane. Organiczne i bezpośrednie wejścia są połączone. Zakupy to przyjęte zamówienia, a przychód/ROAS dotyczą wysłanych paczek, z dopłatą za dostawę, przed późniejszymi zwrotami.

Sesje napływają przez 180 sekund aktywnej gry na kampanię. Każda ocenia bieżącą cenę, promocję, reputację i jakość źródła. Rabat zwiększa prawdopodobieństwo zakupu przez niższą efektywną cenę, nie gwarantuje zysku. Kolejka zamówień jest obsługiwana co losowe 10–50 sekund; brak kupujących może wydłużyć oczekiwanie. Doładowanie w trakcie kampanii dodaje wyłącznie marginalny ruch do pozostałego czasu oraz od razu pobiera koszt mediów i prowizję agencji. Nie odtwarza już odwiedzonych sesji.

Nasycenie (parametry scenariusza, nie realne benchmarki): Google 300 zł, Meta 250 zł, Instagram 180 zł, TikTok 150 zł, artykuły 700 zł dziennie. Do progu ruch jest proporcjonalny do budżetu; powyżej wzrost jest logarytmiczny, a jakość dodatkowego zasięgu obniża konwersję. Dzienna losowość ruchu pozostaje ±30%. Model nie gwarantuje monotonicznego ROAS w każdej pojedynczej rozgrywce, ale oczekiwany zwrot na złotówkę maleje. Prognoza zakłada pełną dostępność i realizację; limit magazynu i brak towaru mogą dodatkowo ograniczyć sprzedaż.

Układ raportów inspirowany dokumentacją [pozyskiwania ruchu GA4](https://support.google.com/analytics/answer/12923437?hl=pl) oraz [raportów e-commerce GA4](https://support.google.com/analytics/answer/12924131?hl=pl). Nie jest to implementacja ani kopia algorytmów Google. Starsze zapisy zachowują bieżący dzień; pełny model sesji zaczyna działać po otwarciu kolejnego dnia.

## Magazyn, platforma i kredyt — 0.8.0

Alert obejmuje produkty wcześniej zamówione lub obecne w sklepie. Ostrzegamy przy 5 sztukach dostępnych po uwzględnieniu kolejki klientów; przy 3+1 próg to 8 sztuk. Komunikat wskazuje dostawy w drodze. Powtarzamy powiadomienie po zmianie poziomu ostrzeżenia lub ponownym spadku zapasu, nie przy każdym odświeżeniu.

Platforma sklepu: nowa gra ma 299 zł netto/miesiąc (9,97 zł na zamknięty dzień), również bez sprzedaży. Jest to ta sama pozycja, która wcześniej nazywała się „Sklep / narzędzia”, bez dodania drugiej opłaty. Stare zapisy zachowują swoją stawkę, np. 99 zł. Przykłady 169/299/729 zł pochodzą z regularnego miesięcznego cennika Shoper (Starter/Standard/Premium), odczytanego 15.09.2026. Wybór w grze zmienia wyłącznie koszt; nie odwzorowujemy funkcji ani dodatkowych opłat poszczególnych planów, promocji na pierwszy rok, dodatków czy integracji.

Kredyt to oferta fikcyjnego banku: 12% nominalnie rocznie, stałe przez umowę w tej wersji gry, prowizja 2% potrącana z wypłaty. Są to założenia scenariusza, nie bieżąca oferta ani wyliczenie oprocentowania z aktualnego WIBOR. Punkt odniesienia stanowi struktura bankowych ofert: mBank publikuje prowizję za udzielenie 0–5%, a za wcześniejszą spłatę 3%, min. 100 zł. Bieżące promocje, np. marża 5,9% z kodem CELE do 15.09.2026, nie są pełnym oprocentowaniem i nie stanowią stawki użytej w grze.

Limit w grze: 5000 zł od początku przy założeniu zdolności i poręczenia właściciela; 15 000 zł od dnia 31 przy dodatnim wyniku ostatnich 7 dni. Jedna aktywna umowa, brak nowego finansowania przy ujemnej gotówce. W rzeczywistości bank ocenia zdolność, historię i staż; przykładowo linia ING wymaga przynajmniej 6 miesięcy prowadzenia firmy. Przyspieszone odblokowanie po 30 dniach i dostępność dla nowej firmy są ułatwieniem rozgrywki.

Okres: 3, 6 lub 12 miesięcy gry. Raty z równą częścią kapitałową, co 30 zamkniętych dni; odsetki naliczane codziennie od salda według roku 365 dni. Pierwsza rata po 30 zamkniętych dniach liczonych od dnia uruchomienia. Wpływ kredytu i spłata kapitału nie są przychodem ani kosztem. Prowizje i naliczone odsetki obciążają P&L; nieopłacone odsetki pozostają zobowiązaniem. Zakładka Finansowanie pokazuje zadłużenie, raty i koszt całkowity przy terminowej spłacie.

Przy braku środków spłacamy dostępne odsetki, potem kapitał, a reszta pozostaje zaległością. Od przeterminowanego kapitału przyjmujemy 14,5% rocznie (parametr symulacji, nie wykładnia prawa); od pozostałego 12%. Bez odsetek od odsetek. Wcześniejsza spłata: 3% niewymagalnego kapitału, min. 100 zł. Nie symulujemy windykacji, BIK, zabezpieczeń, renegocjacji umowy ani zmian stóp. Prognoza kosztu nie uwzględnia opóźnień i wcześniejszego zamknięcia.

Źródła odniesienia: [cennik Shoper](https://www.shoper.pl/pelny-cennik-uslug-shoper), [pożyczka dla firm mBank](https://www.mbank.pl/firmy/kredyty/biezace-zarzadzaniem-firma/pozyczka-dla-firm/), [tabele oprocentowania mBank](https://www.mbank.pl/pdf/oprocentowanie/tabela-firmy.pdf), [warunki linii ING](https://www.ing.pl/male-firmy/kredyty-i-pozyczki/linia-kredytowa-dla-malych-firm).

## Wersja 0.8.0 — pierwsza rozgrywka

Nowy sklep może zamówić zestaw startowy: po 20 sztuk serum i kremu za 860 zł. Zakup jest atomowy, a dostawy nadal trwają 1–5 minut. Interfejs prowadzi do planu marketingu i nie pozwala uruchomić płatnej kampanii bez towaru na regałach. Sam silnik zachowuje możliwość symulowania pustego sklepu dla testów.

Pięć celów wynika z zapisu: pierwsza wysyłka, pięć wysyłek, pierwszy zyskowny dzień, dwadzieścia wysyłek i przeprowadzka. Osiągnięcia nie dodają pieniędzy. Podsumowanie dnia pokazuje marżę po realizacji i wskazówki wynikające z kosztów.

Na telefonie: pełna szerokość ekranu, dolny pasek głównej akcji, paczek i pauzy, wybór działu z listy zamiast ukrytych zakładek. Edytowane pola zachowują wpisywaną wartość i fokus podczas odświeżania gry.

Nowy start przetestujesz po wyeksportowaniu dotychczasowego zapisu i wybraniu Opcje → Nowa gra lub w osobnej sesji przeglądarki. Aktualizacja nie resetuje istniejącego sklepu. To nadal wersja testowa w języku polskim, bez zewnętrznego śledzenia graczy i bez reklam.


### Zmiany 0.8.0
15 kosmetyków za 100–500 zł, silniejszy wpływ kampanii na sprzedaż i szybszy początek napływu ruchu. Nad magazynem widoczny licznik wizyt, zamówień, kolejki i przychodu z reklam oraz doładowanie Google Ads. Migracja zapisów zachowuje firmę, historię, koszt zapasów i przyjęte koszyki. Parametry konwersji to przyspieszony model gry; nasycenie budżetów pozostaje.


### Zmiany 0.8.1
Bazowy narzut wynosi 40–60% względem kosztu Bloom: (cena katalogowa − koszt zakupu) / koszt zakupu. Odpowiada to marży na sprzedaży około 28,6–37,5%, przed logistyką, reklamami, kosztami stałymi i zwrotami. Koszty bazowe: 71–313 zł, ceny katalogowe nadal 100–500 zł. Rabat hurtowy Luma −14% może podnieść narzut ponad bazowy zakres. Ceny ustawiane przez gracza i promocje zmieniają faktyczną rentowność. Zapasy i dostawy zakupione wcześniej zachowują historyczny koszt; nowe dostawy mają nowe stawki.


### Podgląd kosztów 0.8.2
Karty produktów oraz domyślny podgląd promocji używają aktualnej ceny wybranego dostawcy, także gdy magazyn zawiera tanie historyczne zapasy. W Promocjach można wybrać koszt historyczny zapasu, oznaczony w tabeli. Rzeczywisty wynik finansowy pozostaje oparty na cenie faktycznie kupionego towaru. ROAS mierzy przychód względem wydatków reklamowych, a nie zysk.


### Wcześniejsza spłata 0.8.3
W Finansowaniu znajduje się wyróżniona sekcja wcześniejszej spłaty całego kredytu. Rozliczenie pokazuje kapitał, naliczone odsetki, prowizję i gotówkę po spłacie. Brak środków i blokada w rozliczonym dniu mają czytelne wyjaśnienie. Dostęp również przez przycisk w Finansach.


### Zarządzanie firmą 0.8.4
Bazowy narzut 40–60%. Aktywna gra automatycznie pakuje i wysyła; usunięto obowiązek ręcznej obsługi paczek. Główny przycisk podczas sprzedaży prowadzi do wyniku i kosztów. Zapisane spakowane zamówienia są automatycznie wysyłane po wznowieniu. Adapter czasu wywołuje advance z autoFulfill=true; tryb domyślny silnika pozostaje dostępny do symulowania oddzielnych etapów w testach.


### Sterowanie i komunikaty 0.8.5
Przywrócono ręczne pakowanie/pomoc oraz wysyłkę przyciskiem; automatyczne pakowanie przez postać pozostaje. Aktywna gra nie zleca już automatycznej wysyłki. Narzut bazowy pozostaje 40–60%. Powiadomienia w otwartym oknie są wyświetlane wewnątrz niego, nad przyciemnieniem tła; po zamknięciu wracają na dół ekranu.
