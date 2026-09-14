# SHOPSHIFT

Grywalny prototyp zarządzania sklepem kosmetycznym. Kup towar, ustal ceny, uruchom kampanię, pakuj i wysyłaj zamówienia. Obrót nie zawsze oznacza zysk.

## Jak zagrać

Po włączeniu GitHub Pages gra będzie dostępna pod adresem https://zdzioblowski-cell.github.io/shopshift-mvp/. Lokalnie otwórz index.html lub uruchom npm start. Bez instalowania zależności.

Zacznij od 10–20 sztuk Dewdrop i 10 sztuk Cloud Nine. Wybierz kampanię Social starter, otwórz dzień, spakuj i wyślij paczki, a następnie sprawdź wynik finansowy.

## Feedback

Przycisk „Przekaż opinię” otwiera formularze GitHub Issues. Zgłoszenia są publiczne i wymagają konta GitHub; granie nie wymaga konta.

## Zapis i prywatność

Postęp jest zapisywany lokalnie w przeglądarce. Można go eksportować/importować w Opcjach. Wydanie nie ma analityki, reklam sieciowych ani własnego backendu. Zapis z localhost nie przenosi się automatycznie na publiczny adres.

## Zakres MVP 0.1.2

6 fikcyjnych kosmetyków, 2 dostawców, 4 kampanie, ceny i zapasy, pakowanie, wysyłka, opinie, zwroty, pełny rachunek wyniku, 3 poziomy magazynu i pracownik. Kolorystyka: czerń, szarości i czerwień. Brak VAT, podatków, amortyzacji i natywnych pakietów mobilnych. Wszystkie produkty i dostawcy są fikcyjni.

## Kod i testy

engine.js — niezależny silnik ekonomii; app.js — interfejs i zapis; scene.js — grafika Canvas; feedback.js — formularze opinii; style.css — wygląd. npm test uruchamia 13 testów ekonomii, w tym pełną symulację 30 dni. Node.js 18 lub nowszy wymagany tylko do testów i opcjonalnego lokalnego serwera.
