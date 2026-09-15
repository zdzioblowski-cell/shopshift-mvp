# SHOPSHIFT 0.6 — stawki i ograniczenia modelu

Stan weryfikacji: 14 września 2026 r. Gra symuluje nowy sklep kosmetyczny w Polsce. Nie jest prognozą konkretnego sklepu ani kalkulatorem księgowym.

## Konwencja finansowa

Wszystkie ceny produktów, przychody i koszty handlowe w grze są kwotami netto. Gotówka oznacza uproszczone środki operacyjne bez VAT. Pensja pracownika jest opisana osobno jako brutto. Nie ma rozliczenia VAT, podatku dochodowego, ZUS właściciela, amortyzacji, rozliczeń bankowych ani terminów płatności faktur. Koszty miesięczne dzielimy na 30 dni kalendarzowych i pobieramy codziennie. Rzeczywista faktura miesięczna może mieć inny termin, a miesiące inną długość.

## Dane źródłowe i stawki scenariuszowe

| Pozycja | Domyślna wartość | Podstawa i ograniczenie |
|---|---|---|
| Agencja | 1500 zł/mies. + 10% wydatków | Model wskazany przez autora gry. Procent obejmuje w tej wersji reklamy, publikacje i SEO obsługiwane w planie. Stała część wynosi 50 zł/dzień nawet bez sprzedaży. To nie średnia dla wszystkich agencji. |
| Pensja | 5500 zł brutto/mies. | Założenie scenariuszowe. Oficjalne minimum na 2026 r. to 4806 zł brutto. |
| Narzut pracodawcy | 20,48% | 9,76% emerytalne + 6,5% rentowe + założone 1,67% wypadkowe + 2,45% FP + 0,10% FGŚP. Bez PPK i szczególnych zwolnień. Koszt przy 5500 zł to 6626,40 zł/mies., czyli 220,88 zł/dzień gry. |
| Kurier | 13,50 zł/paczkę | Edytowalne założenie dla małego sklepu, nie gwarantowana oferta InPost. Rzeczywista stawka zależy od umowy, gabarytu, wolumenu i dopłat. Publiczne cenniki InPost zostały zaktualizowane od 1 marca 2026 r. |
| Opakowanie | 1,80 zł; +0,60 zł przy ponad 2 szt. | Założenie obejmuje karton, wypełnienie, taśmę i etykietę. Sam karton 200×150×100 mm w sprawdzonej ofercie Kartony24 kosztował 0,71 zł netto przy 20 sztukach; oferta zależy od ilości. Dodatki i większy karton są szacunkiem. |
| Płatności | 4,0% + 1 zł/transakcję | Punkt odniesienia: standardowe karty EOG w publicznym cenniku Stripe. BLIK i inne karty mogą mieć inne stawki. W grze opłata liczona jest od uproszczonej sprzedaży netto; w rzeczywistości operator nalicza ją od pełnej płatności klienta, w tym VAT. Nie jest to dokładna kalkulacja faktury operatora. |
| Sklep i narzędzia | 299 zł/mies. dla nowej gry | Założenie, do edycji. |
| Obsługa zwrotu | 6 zł/paczkę | Założenie: koszt wewnętrznej obsługi, transport zwrotny opłaca klient. Gra zakłada utratę wartości otwartego kosmetyku; nie symuluje wszystkich przyczyn, warunków prawnych ani częściowych zwrotów. |
| Lokal | 35 / 85 / 170 zł/dzień | Założenie zależne od poziomu siedziby. Bez lokalizacji, kaucji i oddzielnych mediów. |

## Marketing: nie udajemy danych konkretnego sklepu

Google nie ma jednej stałej ceny kliknięcia. CPC zależy m.in. od aukcji, konkurencji i jakości reklamy. Poniższe liczby są parametrami scenariusza, nie wynikami badania polskich sklepów kosmetycznych. W szczególności konwersje nie są obietnicą ani danymi z Twojej firmy.

| Ścieżka | Bazowy CPC | Bazowa konwersja wizyt |
|---|---:|---:|
| Google Ads | 1,20 zł | 7,5% |
| Meta Ads / Facebook | 0,80 zł | 4,5% |
| Instagram | 0,90 zł | 4,0% |
| TikTok | 0,55 zł | 3,0% |
| Artykuły zewnętrzne | 350 zł/publikację | 4,5% z 15–40 wizyt polecających/publikację |

Rzeczywisty ruch zmienia się losowo o około ±30%. Cenę, reputację, promocję i rozwój marki uwzględniamy przy konwersji, z limitem 18%. Instagram jest częścią ekosystemu reklamowego Meta: rozdzielenie go w interfejsie jest decyzją gry. Jednoczesna emisja w Meta i Instagramie zmniejsza liczbę dodatkowych wizyt z Instagrama o 15% jako uproszczenie nakładania się odbiorców. Nie modelujemy pełnej atrybucji wielokanałowej ani aukcji reklamowej.

Nowy sklep ma około 2–5 wizyt organicznych dziennie i konwersję bazową 1,2%, więc zwykle nie otrzyma z nich zamówienia. Google zaleca ocenianie efektów SEO po tygodniach; niektóre zmiany wymagają miesięcy. W grze inwestycja SEO zaczyna wpływać na ruch po 30 dniach od poniesienia danego wydatku, a efekt jest stopniowy. Publikacje rozwijają również rozpoznawalność marki, ale zakup artykułu nie gwarantuje pozycji w wyszukiwarce.

Każda kolejna sesja ocenia bieżące ceny i promocję podczas napływu ruchu. Zakwalifikowane zamówienia przychodzą co losowe 10–50 sekund; ten zegar jest kompresją czasu rozgrywki, a nie rzeczywistym czasem zakupów klientów. Ruch, który nie skonwertował, nie musi wywołać powiadomienia. Przy słabej kampanii może nie być żadnego zamówienia.

## Promocje i raportowanie

- Obniżka: rabat dla wszystkich kupujących, od ceny ustawionej w karcie produktu.
- Kupon START: 65% kupujących wykorzystuje kod w modelu. Ten udział jest założeniem.
- 3+1: cztery sztuki tego samego kosmetyku, cena za trzy. Koszt i rezerwacja dotyczą wszystkich czterech.
- Zwykłe koszyki zawierają 1–3 sztuki jednego produktu. Rabaty nie łączą się.
- Rabat pomniejsza przychód; nie jest odejmowany ponownie jako koszt.
- Zwrot całego koszyka oddaje faktyczną wpłatę po rabacie i nalicza obsługę. Pierwotny koszt towaru, opakowania, przesyłki i opłaty operatora pozostaje kosztem.
- CPA oraz ROAS kanału dotyczą budżetu tego kanału i wysłanych zamówień. Nie obejmują agencji, stałego SEO, kosztów stałych ani późniejszych zwrotów. Pełny wynik pokazuje P&L.
- Nie symulujemy obowiązków informacyjnych realnego sklepu przy ogłaszaniu promocji ani historii najniższej ceny. To wewnętrzne decyzje w grze, nie szablon do uruchomienia prawdziwej promocji.

## Źródła

- [Ministerstwo Rodziny — minimalne wynagrodzenie](https://www.gov.pl/web/rodzina/minimalne-wynagrodzenie-za-prace)
- [Biznes.gov.pl — składki pracodawcy](https://biznes.gov.pl/pl/portal/00274)
- [ZUS — zabezpieczenie społeczne, opis finansowania składek](https://www.zus.pl/documents/10182/167567/Zabezpieczenie%2Bspo%C5%82eczne%2Bw%2BPolsce.pdf/387eb8f7-0522-4f74-ace3-907cd6b1e80f?t=1764601572506)
- [InPost — aktualizacja cenników od marca 2026](https://inpost.pl/aktualnosci-aktualizacja-cennikow-inpost-od-1-marca-2026-r)
- [InPost — cenniki](https://inpost.pl/cenniki)
- [Kartony24 — karton 200×150×100](https://kartony24.eu/karton-klapowy-200x150x100-mm-b320.html)
- [Stripe — cennik dla Polski](https://stripe.com/en-pl/pricing)
- [Google Ads — koszt kliknięcia](https://support.google.com/google-ads/answer/116495?hl=pl)
- [Google Search Central — czas oczekiwania na efekty SEO](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

## Analityka i dynamiczny popyt — 0.5.0

Analityka pokazuje wyłącznie fikcyjny sklep: rzeczywiście zasymulowane sesje, oglądanie produktów, koszyki, przejścia do kasy, przyjęte zakupy i wysłaną sprzedaż według źródła. Nie instalujemy Google Analytics i nie śledzimy graczy. Każdy zakup przypisujemy źródłu jednej sesji; powroty użytkowników i wielokanałowa atrybucja nie są modelowane. Organiczne i bezpośrednie wejścia są połączone. Zakupy to przyjęte zamówienia, a przychód/ROAS dotyczą wysłanych paczek, z dopłatą za dostawę, przed późniejszymi zwrotami.

Sesje napływają przez 180 sekund aktywnej gry na kampanię. Każda ocenia bieżącą cenę, promocję, reputację i jakość źródła. Rabat zwiększa prawdopodobieństwo zakupu przez niższą efektywną cenę, nie gwarantuje zysku. Kolejka zamówień jest obsługiwana co losowe 10–50 sekund; brak kupujących może wydłużyć oczekiwanie. Doładowanie w trakcie kampanii dodaje wyłącznie marginalny ruch do pozostałego czasu oraz od razu pobiera koszt mediów i prowizję agencji. Nie odtwarza już odwiedzonych sesji.

Nasycenie (parametry scenariusza, nie realne benchmarki): Google 300 zł, Meta 250 zł, Instagram 180 zł, TikTok 150 zł, artykuły 700 zł dziennie. Do progu ruch jest proporcjonalny do budżetu; powyżej wzrost jest logarytmiczny, a jakość dodatkowego zasięgu obniża konwersję. Dzienna losowość ruchu pozostaje ±30%. Model nie gwarantuje monotonicznego ROAS w każdej pojedynczej rozgrywce, ale oczekiwany zwrot na złotówkę maleje. Prognoza zakłada pełną dostępność i realizację; limit magazynu i brak towaru mogą dodatkowo ograniczyć sprzedaż.

Układ raportów inspirowany dokumentacją [pozyskiwania ruchu GA4](https://support.google.com/analytics/answer/12923437?hl=pl) oraz [raportów e-commerce GA4](https://support.google.com/analytics/answer/12924131?hl=pl). Nie jest to implementacja ani kopia algorytmów Google. Starsze zapisy zachowują bieżący dzień; pełny model sesji zaczyna działać po otwarciu kolejnego dnia.

## Magazyn, platforma i kredyt — 0.6.0

Alert obejmuje produkty wcześniej zamówione lub obecne w sklepie. Ostrzegamy przy 5 sztukach dostępnych po uwzględnieniu kolejki klientów; przy 3+1 próg to 8 sztuk. Komunikat wskazuje dostawy w drodze. Powtarzamy powiadomienie po zmianie poziomu ostrzeżenia lub ponownym spadku zapasu, nie przy każdym odświeżeniu.

Platforma sklepu: nowa gra ma 299 zł netto/miesiąc (9,97 zł na zamknięty dzień), również bez sprzedaży. Jest to ta sama pozycja, która wcześniej nazywała się „Sklep / narzędzia”, bez dodania drugiej opłaty. Stare zapisy zachowują swoją stawkę, np. 99 zł. Przykłady 169/299/729 zł pochodzą z regularnego miesięcznego cennika Shoper (Starter/Standard/Premium), odczytanego 15.09.2026. Wybór w grze zmienia wyłącznie koszt; nie odwzorowujemy funkcji ani dodatkowych opłat poszczególnych planów, promocji na pierwszy rok, dodatków czy integracji.

Kredyt to oferta fikcyjnego banku: 12% nominalnie rocznie, stałe przez umowę w tej wersji gry, prowizja 2% potrącana z wypłaty. Są to założenia scenariusza, nie bieżąca oferta ani wyliczenie oprocentowania z aktualnego WIBOR. Punkt odniesienia stanowi struktura bankowych ofert: mBank publikuje prowizję za udzielenie 0–5%, a za wcześniejszą spłatę 3%, min. 100 zł. Bieżące promocje, np. marża 5,9% z kodem CELE do 15.09.2026, nie są pełnym oprocentowaniem i nie stanowią stawki użytej w grze.

Limit w grze: 5000 zł od początku przy założeniu zdolności i poręczenia właściciela; 15 000 zł od dnia 31 przy dodatnim wyniku ostatnich 7 dni. Jedna aktywna umowa, brak nowego finansowania przy ujemnej gotówce. W rzeczywistości bank ocenia zdolność, historię i staż; przykładowo linia ING wymaga przynajmniej 6 miesięcy prowadzenia firmy. Przyspieszone odblokowanie po 30 dniach i dostępność dla nowej firmy są ułatwieniem rozgrywki.

Okres: 3, 6 lub 12 miesięcy gry. Raty z równą częścią kapitałową, co 30 zamkniętych dni; odsetki naliczane codziennie od salda według roku 365 dni. Pierwsza rata po 30 zamkniętych dniach liczonych od dnia uruchomienia. Wpływ kredytu i spłata kapitału nie są przychodem ani kosztem. Prowizje i naliczone odsetki obciążają P&L; nieopłacone odsetki pozostają zobowiązaniem. Zakładka Finansowanie pokazuje zadłużenie, raty i koszt całkowity przy terminowej spłacie.

Przy braku środków spłacamy dostępne odsetki, potem kapitał, a reszta pozostaje zaległością. Od przeterminowanego kapitału przyjmujemy 14,5% rocznie (parametr symulacji, nie wykładnia prawa); od pozostałego 12%. Bez odsetek od odsetek. Wcześniejsza spłata: 3% niewymagalnego kapitału, min. 100 zł. Nie symulujemy windykacji, BIK, zabezpieczeń, renegocjacji umowy ani zmian stóp. Prognoza kosztu nie uwzględnia opóźnień i wcześniejszego zamknięcia.

Źródła odniesienia: [cennik Shoper](https://www.shoper.pl/pelny-cennik-uslug-shoper), [pożyczka dla firm mBank](https://www.mbank.pl/firmy/kredyty/biezace-zarzadzaniem-firma/pozyczka-dla-firm/), [tabele oprocentowania mBank](https://www.mbank.pl/pdf/oprocentowanie/tabela-firmy.pdf), [warunki linii ING](https://www.ing.pl/male-firmy/kredyty-i-pozyczki/linia-kredytowa-dla-malych-firm).


## Balans rozgrywki 0.8.0
Katalog obejmuje 15 fikcyjnych kosmetyków z cenami bazowymi 100–500 zł i kosztami zakupu 39–225 zł. Konwersje bazowe Google 7,5%, Meta 4,5%, Instagram 4%, TikTok 3%, artykuły 4,5% są celowo przyspieszonymi parametrami gry, nie benchmarkiem ani prognozą rynkową. Progi nasycenia, rosnący koszt marginalnej wizyty i spadająca jakość dodatkowej widowni pozostają. Ruch przyspiesza na początku kampanii (postęp czasu do potęgi 0,65); suma opłaconych wizyt pozostaje bez zmian. Przyjęte zamówienia i historyczny koszt zakupionego towaru zachowują swoje wartości przy aktualizacji. Ceny przyszłych ofert poniżej 100 zł są jednorazowo podniesione do nowych cen katalogowych. Ceny po rabacie mogą być niższe niż 100 zł.


## Korekta narzutu 0.8.1
Bazowy narzut wynosi 40–60% względem kosztu Bloom: (cena katalogowa − koszt zakupu) / koszt zakupu. Odpowiada to marży na sprzedaży około 28,6–37,5%, przed logistyką, reklamami, kosztami stałymi i zwrotami. Koszty bazowe: 71–313 zł, ceny katalogowe nadal 100–500 zł. Rabat hurtowy Luma −14% może podnieść narzut ponad bazowy zakres. Ceny ustawiane przez gracza i promocje zmieniają faktyczną rentowność. Zapasy i dostawy zakupione wcześniej zachowują historyczny koszt; nowe dostawy mają nowe stawki.


### Podgląd kosztów 0.8.2
Karty produktów oraz domyślny podgląd promocji używają aktualnej ceny wybranego dostawcy, także gdy magazyn zawiera tanie historyczne zapasy. W Promocjach można wybrać koszt historyczny zapasu, oznaczony w tabeli. Rzeczywisty wynik finansowy pozostaje oparty na cenie faktycznie kupionego towaru. ROAS mierzy przychód względem wydatków reklamowych, a nie zysk.
