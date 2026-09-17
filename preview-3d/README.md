# SHOPSHIFT — osobny podgląd pracownic 3D

Otwórz index.html przez serwer HTTP. Podgląd nie odczytuje i nie zapisuje stanu gry.
Kobiecy model roboczy, dopasowana animacja szkieletowa chodu, płynny obrót do stycznej trasy, kamera orbitalna, zbliżenie, pauza oraz wybór 1/3/5 pracownic. Stałe odstępy na wspólnej zamkniętej trasie zapobiegają nakładaniu postaci. To nie jest jeszcze swobodne wyszukiwanie dróg ani dynamiczna symulacja tłumu. Scena i strój są robocze. Długość cyklu ustawiona na 1,46 m na podstawie ruchu stóp po przeniesieniu animacji.

## Źródła
- Three.js 0.169.0 — MIT; kopia licencji vendor/LICENSE. https://threejs.org/license/
- Model kobiecy Michelle z oficjalnych przykładów Three.js (Mixamo): https://github.com/mrdoob/three.js/blob/dev/examples/models/gltf/Michelle.glb
- Źródło animacji Walk: Soldier z oficjalnych przykładów Three.js, w podglądzie nie jest wyświetlany; animacja przeliczana na kości modelu kobiecego. https://github.com/mrdoob/three.js/blob/dev/examples/models/gltf/Soldier.glb
- Warunki stosowania modeli i animacji Mixamo w projektach: https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html
Modele są użyte jako składnik demonstracji gry, nie jako osobno oferowana paczka assetów.

## Sprawdzenie
Test przeglądarkowy: ładowanie modeli, pięć postaci, brak przecięcia trasy ze strefą stołu, minimalne odległości na 500 próbkach pełnego obwodu, pauza, zbliżenie i szerokość ekranu mobilnego. Weryfikacja wizualna sylwetek i przeniesionej pozy. Docelowy wygląd, praca przy stole i wdrożenie do gry pozostają następnym etapem.
