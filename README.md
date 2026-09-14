# SHOPSHIFT

Grywalny prototyp zarządzania sklepem kosmetycznym. Kup towar, ustal ceny, uruchom kampanię, pakuj i wysyłaj zamówienia. Obrót nie zawsze oznacza zysk.

## Jak zagrać

Gra jest dostępna pod adresem https://zdzioblowski-cell.github.io/shopshift-mvp/. Lokalnie otwórz index.html lub uruchom npm start. Bez instalowania zależności.

Zacznij od 10–20 sztuk Dewdrop i 10 sztuk Cloud Nine. Wybierz kanały reklamowe i budżety, zapisz plan, otwórz dzień, spakuj i wyślij paczki, a następnie sprawdź wynik finansowy.

## Feedback

Przycisk „Przekaż opinię” otwiera formularze GitHub Issues. Zgłoszenia są publiczne i wymagają konta GitHub; granie nie wymaga konta.

## Zapis i prywatność

Postęp jest zapisywany lokalnie w przeglądarce. Można go eksportować/importować w Opcjach. Wydanie nie ma analityki, reklam sieciowych ani własnego backendu. Zapis z localhost nie przenosi się automatycznie na publiczny adres.

## Zakres MVP 0.3.0

6 fikcyjnych kosmetyków, 2 dostawców, 5 ścieżek marketingowych, ceny i zapasy, pakowanie, wysyłka, opinie, zwroty, pełny rachunek wyniku, 3 poziomy magazynu i pracownik. Kolorystyka: czerń, szarości i czerwień. Brak VAT, podatków, amortyzacji i natywnych pakietów mobilnych. Wszystkie produkty i dostawcy są fikcyjni.

## Kod i testy

engine.js — niezależny silnik ekonomii; app.js — interfejs i zapis; scene.js — grafika Canvas; feedback.js — formularze opinii; style.css — wygląd. npm test uruchamia 21 testów ekonomii, w tym pełną symulację 30 dni. Node.js 18 lub nowszy wymagany tylko do testów i opcjonalnego lokalnego serwera.

## Rozgrywka na żywo

Po otwarciu dnia zamówienia pojawiają się pojedynczo w losowych odstępach 20–30 sekund. Ceny, reklama i reputacja nadal określają wielkość popytu. Towar rezerwowany jest dopiero po nadejściu zamówienia.

Postać chodzi do regału, zabiera produkt, pakuje i odnosi paczkę. Cykl trwa 16 sekund, a z pracownikiem 9 sekund. Bez zamówień przygotowuje stanowisko. Gracz nadal zleca wysyłkę i zamyka dzień; może też pomóc ręcznie w pakowaniu.

Nowe zamówienie wyświetla baner i krótki dźwięk. Dźwięk jest domyślnie włączony i uruchamia się po pierwszym kliknięciu lub użyciu klawiatury (ograniczenie przeglądarek). Można go wyciszyć; wybór jest zapamiętywany.

Pauza, otwarte okno dialogowe i ukryta karta zatrzymują przyjmowanie oraz pakowanie. Gra nie nalicza zdarzeń za czas nieobecności. Zapis przechowuje kolejkę, pozostały czas do zamówienia oraz etap pakowania. Starsze zapisy są obsługiwane: przyjęte wcześniej zamówienia są pakowane automatycznie; nowy rytm napływu zaczyna się w kolejnym dniu.

Wcześniejsze zamknięcie dnia anuluje przyjęte, niewysłane zamówienia i rezygnuje z pozostałego popytu; reklama nie jest zwracana.

Test interfejsu w rzeczywistym czasie: zainstaluj opcjonalnie Playwright (`npm install --no-save playwright`, `npx playwright install chromium`), następnie `npm run test:browser`. Sprawdza także dźwięk, pauzę i animację. Test trwa około minuty.


## Ekonomia 0.3

Google Ads, Meta/Facebook, Instagram, TikTok i artykuły zewnętrzne z niezależnymi budżetami. Koszty agencji: domyślnie 1500 zł/miesiąc + 10% budżetu reklam i treści. SEO ma 30-dniowe opóźnienie. Nowy sklep ma minimalny ruch organiczny.

Promocje: obniżka, kupon START i 3+1. Koszyki 1–3 sztuki, a w 3+1 cztery sztuki tego samego produktu. Osobno rozliczane są kurier, opakowanie, płatności, wynagrodzenie i narzut pracodawcy oraz narzędzia. Stawki można edytować przed otwarciem dnia.

Zobacz [REALIA.md](REALIA.md) lub ekran „Koszty → Źródła i ograniczenia modelu”. Są tam źródła i wyraźnie oznaczone założenia. Nie ma jeszcze dokładnej księgowości VAT/podatków, a CPC i konwersje nie pochodzą z danych konkretnego sklepu.
