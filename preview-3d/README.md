# SHOPSHIFT — pracownice na tle sklepu (podgląd 3)

Osobny podgląd, bez odczytywania lub zmieniania zapisu gry. Otwórz index.html przez HTTP.

Domyślnie pokazuje jedną zatrzymaną pracownicę 3D na istniejącym tle magazynu. Wybór 1/3/5 postaci, pauza, podgląd tras, przełączenie na scenę 3D i zbliżenie. Różne kolory ubrań. Kobiecy model z jasnym wariantem skóry i brązowymi włosami; ubiór nadal roboczy.

## Korekta sylwetki

Smuklejszy profil nóg i bioder, mniejsze buty z zaokrągloną podeszwą, osobna luźna koszulka i proste nogawki spodni przypisane do szkieletu. Skala postaci zwiększona o około 12% względem poprzedniego podglądu. Przyciski „Z przodu” i „Z boku” pokazują jedną zatrzymaną postać na neutralnym tle, bez zasłaniających mebli. „Uruchom chód” pozwala wrócić do oceny animacji. Wygląd nadal roboczy; nie zmienia wersji produkcyjnej gry.

## Ruch

Pięć otwartych tras w oddzielnych strefach pracy. Po dojściu do stanowiska postać zatrzymuje się na 2–6 s, potem wybiera inne stanowisko swojej strefy i wraca lub idzie dalej. Nie ma wspólnej zamkniętej pętli. Obrót przed ruszeniem, przyspieszanie/hamowanie, miękkie przejście między chodem i postawą spoczynkową. Faza kroku zależy od przebytej odległości; cykl 1,72 m (po korekcie skali) skalibrowany na podstawie ruchu stóp. Korekta wysokości oparta na spodzie butów.

Trasy omijają stół, mają osobne korytarze i dodatkowy próg bezpieczeństwa odległości 0,7 m. To podgląd ruchu po przygotowanych trasach, nie swobodny system szukania dróg. Postoje symbolizują zadania; nie są jeszcze powiązane z zamówieniami ani animacją pakowania w grze. Tło jest płaską ilustracją; niewidoczna bryła stołu zapewnia przybliżone zasłanianie postaci stojącej za meblem.

## Źródła

- Three.js 0.169.0, MIT: vendor/LICENSE, https://threejs.org/license/
- Kobiecy model Superhero Female FullBody, Hair Long i tekstury: Quaternius, Universal Base Characters Standard, CC0 1.0. Pełna informacja autora: character/License_Standard.txt. https://quaternius.com/packs/universalbasecharacters.html oraz https://quaternius.itch.io/universal-base-characters
- Zmiany modelu w podglądzie: jasna tekstura skóry z pakietu, materiały ubrań, buty, włosy, przeniesienie animacji na szkielet modelu.
- Źródło animacji Walk: Soldier z oficjalnych przykładów Three.js, niewyświetlany model źródłowy. https://github.com/mrdoob/three.js/blob/dev/examples/models/gltf/Soldier.glb
- Warunki użycia Mixamo w grach: https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html
- Tło: istniejący asset projektu ../assets/command-warehouse.jpg.

## Walidacja

Test przeglądarkowy: ładowanie wszystkich assetów bez błędów, wybór pięciu postaci, 120 sekund symulacji ruchu, minimalne odstępy, brak wejścia w strefę stołu, kierunek ruchu zgodny z obrotem postaci, wielokrotne postoje każdej pracownicy, pauza, przełącznik tła/sceny 3D, zbliżenie, brak poziomego przewijania na ekranie 390 px. Weryfikacja zrzutów na tle sklepu i w zbliżeniu.
