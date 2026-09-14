# SHOPSHIFT

Grywalny prototyp zarządzania sklepem kosmetycznym. Kup towar, ustal ceny, uruchom kampanię, pakuj i wysyłaj zamówienia. Obrót nie zawsze oznacza zysk.

## Jak zagrać

Gra jest dostępna pod adresem https://zdzioblowski-cell.github.io/shopshift-mvp/. Lokalnie otwórz index.html lub uruchom npm start. Bez instalowania zależności.

Zacznij od 10–20 sztuk Dewdrop i 10 sztuk Cloud Nine. Wybierz kanały reklamowe i budżety, zapisz plan, otwórz dzień, spakuj i wyślij paczki, a następnie sprawdź wynik finansowy.

## Feedback

Przycisk „Przekaż opinię” otwiera formularze GitHub Issues. Zgłoszenia są publiczne i wymagają konta GitHub; granie nie wymaga konta.

## Zapis i prywatność

Postęp jest zapisywany lokalnie w przeglądarce. Można go eksportować/importować w Opcjach. Wydanie nie ma analityki, reklam sieciowych ani własnego backendu. Zapis z localhost nie przenosi się automatycznie na publiczny adres.

## Zakres MVP 0.5.0

6 fikcyjnych kosmetyków, 2 dostawców, 5 ścieżek marketingowych, ceny i zapasy, pakowanie, wysyłka, opinie, zwroty, pełny rachunek wyniku, 3 poziomy magazynu i pracownik. Kolorystyka: czerń, szarości i czerwień. Brak VAT, podatków, amortyzacji i natywnych pakietów mobilnych. Wszystkie produkty i dostawcy są fikcyjni.

## Kod i testy

engine.js — niezależny silnik ekonomii; app.js — interfejs i zapis; scene.js — grafika Canvas; feedback.js — formularze opinii; style.css — wygląd. npm test uruchamia 31 testów ekonomii, w tym pełną symulację 30 dni. Node.js 18 lub nowszy wymagany tylko do testów i opcjonalnego lokalnego serwera.

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

## Wersja 0.5.0 — sklep działa na żywo

Zamówienia klientów: losowe odstępy 10–50 sekund. Towar można zamawiać w każdej fazie; każdy zakup przyjeżdża po losowych 1–5 minutach aktywnej gry. Przed startem kampanii warto poczekać na pierwszą dostawę. Brak towaru przy nadejściu klienta oznacza utracone zamówienie. Sesje napływają na żywo i reagują na aktualne ceny i promocje.

Dostawy są opłacane od razu, zajmują pojemność magazynu i zachowują pozostały czas przy zmianie dnia i zapisie. Pauza, ukryta karta oraz otwarte okno dialogowe zatrzymują zegar.

Przyciski nad magazynem: Zamów towar, Zmień ceny, Promocje, Marketing. Ceny, rabaty i darmową dostawę można zmieniać podczas sprzedaży; nowe ustawienia dotyczą kolejnych zamówień. Przyjęte zamówienia zachowują warunki zakupu. Budżety początkowe i koszty stałe ustala się przed otwarciem dnia; podczas kampanii można dokupić ruch.

## Analityka i dynamiczny popyt — 0.5.0

Analityka pokazuje wyłącznie fikcyjny sklep: rzeczywiście zasymulowane sesje, oglądanie produktów, koszyki, przejścia do kasy, przyjęte zakupy i wysłaną sprzedaż według źródła. Nie instalujemy Google Analytics i nie śledzimy graczy. Każdy zakup przypisujemy źródłu jednej sesji; powroty użytkowników i wielokanałowa atrybucja nie są modelowane. Organiczne i bezpośrednie wejścia są połączone. Zakupy to przyjęte zamówienia, a przychód/ROAS dotyczą wysłanych paczek, z dopłatą za dostawę, przed późniejszymi zwrotami.

Sesje napływają przez 180 sekund aktywnej gry na kampanię. Każda ocenia bieżącą cenę, promocję, reputację i jakość źródła. Rabat zwiększa prawdopodobieństwo zakupu przez niższą efektywną cenę, nie gwarantuje zysku. Kolejka zamówień jest obsługiwana co losowe 10–50 sekund; brak kupujących może wydłużyć oczekiwanie. Doładowanie w trakcie kampanii dodaje wyłącznie marginalny ruch do pozostałego czasu oraz od razu pobiera koszt mediów i prowizję agencji. Nie odtwarza już odwiedzonych sesji.

Nasycenie (parametry scenariusza, nie realne benchmarki): Google 300 zł, Meta 250 zł, Instagram 180 zł, TikTok 150 zł, artykuły 700 zł dziennie. Do progu ruch jest proporcjonalny do budżetu; powyżej wzrost jest logarytmiczny, a jakość dodatkowego zasięgu obniża konwersję. Dzienna losowość ruchu pozostaje ±30%. Model nie gwarantuje monotonicznego ROAS w każdej pojedynczej rozgrywce, ale oczekiwany zwrot na złotówkę maleje. Prognoza zakłada pełną dostępność i realizację; limit magazynu i brak towaru mogą dodatkowo ograniczyć sprzedaż.

Układ raportów inspirowany dokumentacją [pozyskiwania ruchu GA4](https://support.google.com/analytics/answer/12923437?hl=pl) oraz [raportów e-commerce GA4](https://support.google.com/analytics/answer/12924131?hl=pl). Nie jest to implementacja ani kopia algorytmów Google. Starsze zapisy zachowują bieżący dzień; pełny model sesji zaczyna działać po otwarciu kolejnego dnia.
