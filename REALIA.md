# SHOPSHIFT 0.3 — stawki i ograniczenia modelu

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
| Płatności | 1,5% + 1 zł/transakcję | Punkt odniesienia: standardowe karty EOG w publicznym cenniku Stripe. BLIK i inne karty mogą mieć inne stawki. W grze opłata liczona jest od uproszczonej sprzedaży netto; w rzeczywistości operator nalicza ją od pełnej płatności klienta, w tym VAT. Nie jest to dokładna kalkulacja faktury operatora. |
| Sklep i narzędzia | 99 zł/mies. | Założenie, do edycji. |
| Obsługa zwrotu | 6 zł/paczkę | Założenie: koszt wewnętrznej obsługi, transport zwrotny opłaca klient. Gra zakłada utratę wartości otwartego kosmetyku; nie symuluje wszystkich przyczyn, warunków prawnych ani częściowych zwrotów. |
| Lokal | 35 / 85 / 170 zł/dzień | Założenie zależne od poziomu siedziby. Bez lokalizacji, kaucji i oddzielnych mediów. |

## Marketing: nie udajemy danych konkretnego sklepu

Google nie ma jednej stałej ceny kliknięcia. CPC zależy m.in. od aukcji, konkurencji i jakości reklamy. Poniższe liczby są parametrami scenariusza, nie wynikami badania polskich sklepów kosmetycznych. W szczególności konwersje nie są obietnicą ani danymi z Twojej firmy.

| Ścieżka | Bazowy CPC | Bazowa konwersja wizyt |
|---|---:|---:|
| Google Ads | 1,20 zł | 3,5% |
| Meta Ads / Facebook | 0,80 zł | 1,8% |
| Instagram | 0,90 zł | 1,5% |
| TikTok | 0,55 zł | 1,0% |
| Artykuły zewnętrzne | 350 zł/publikację | 2,0% z 15–40 wizyt polecających/publikację |

Rzeczywisty ruch zmienia się losowo o około ±30%. Cenę, reputację, promocję i rozwój marki uwzględniamy przy konwersji, z limitem 12%. Instagram jest częścią ekosystemu reklamowego Meta: rozdzielenie go w interfejsie jest decyzją gry. Jednoczesna emisja w Meta i Instagramie zmniejsza liczbę dodatkowych wizyt z Instagrama o 15% jako uproszczenie nakładania się odbiorców. Nie modelujemy pełnej atrybucji wielokanałowej ani aukcji reklamowej.

Nowy sklep ma około 2–5 wizyt organicznych dziennie i konwersję bazową 1,2%, więc zwykle nie otrzyma z nich zamówienia. Google zaleca ocenianie efektów SEO po tygodniach; niektóre zmiany wymagają miesięcy. W grze inwestycja SEO zaczyna wpływać na ruch po 30 dniach od poniesienia danego wydatku, a efekt jest stopniowy. Publikacje rozwijają również rozpoznawalność marki, ale zakup artykułu nie gwarantuje pozycji w wyszukiwarce.

Popyt jest wyliczany przy otwarciu dnia. Zakwalifikowane zamówienia przychodzą co losowe 20–30 sekund; ten zegar jest kompresją czasu rozgrywki, a nie rzeczywistym czasem zakupów klientów. Ruch, który nie skonwertował, nie musi wywołać powiadomienia. Przy słabej kampanii może nie być żadnego zamówienia.

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
