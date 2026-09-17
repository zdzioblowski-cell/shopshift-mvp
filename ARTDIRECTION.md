# SHOPSHIFT 0.13.0 — Centrum dowodzenia

Układ wdrożony na podstawie zaakceptowanej makiety 3: ciemny magazyn, nawigacja po lewej, rzeczywista kolejka zamówień na dole i osobny panel wysyłki. Zarządzanie otwiera się w bocznym panelu. Ekonomia i format zapisów pozostają bez zmian.

Tło assets/command-warehouse.jpg wygenerowano przez imagegen jako ilustrację wnętrza: nowoczesny izometryczny magazyn kosmetyków, grafitowe i czerwone akcenty, ciepłe oświetlenie, regały z produktami, stanowisko pakowania, biuro i fragment samochodu dostawczego, bez napisów, interfejsu i postaci. Postacie, liczniki stanów oraz gotowe paczki rysuje scene.js. Tło jest dekoracją; dokładne dostępne ilości i pojemność pokazują liczniki gry.

Walidacja: 97 testów zasad gry oraz test przeglądarkowy układu desktop/mobile, nawigacji, ręcznego pakowania i wysyłki partii 10 paczek. Zmiana wizualna nie resetuje zapisów w przeglądarce.

## 0.13.1 — realistyczni pracownicy
Asset: assets/warehouse-worker.png. Wygenerowano wbudowanym imagegen, następnie usunięto tło przez imagegen z zachowaniem przezroczystości. Atlas 4×2: cztery klatki chodu, dwa kierunki. Renderer wyrównuje sylwetki do stóp, skaluje według głębi i dodaje cień kontaktowy. Trasy po wolnej podłodze omijają meble; test próbuje 27 000 położeń pełnego zespołu względem stref przeszkód powiększonych o 24 px. Animacja nie realizuje zamówień automatycznie. To nadal scena 2D ze stałymi trasami, nie symulacja fizyczna 3D.

Prompt generowania:
Create a production game sprite atlas on a genuinely transparent alpha background. 1536x1024 landscape, EXACTLY 4 columns x 2 rows equal cells. Eight full-body images of THE SAME realistic adult warehouse employee, charcoal work polo, dark gray cargo trousers, black practical shoes, short brown hair, natural adult proportions, detailed realistic 3D rendered cloth and skin, warm overhead warehouse lighting. Camera elevated 30 degrees looking down, orthographic three-quarter view, intended compositing into realistic isometric warehouse. Each sprite completely contained in its equal 384x512 cell, standing soles at 92% of cell height, head at 10%, same size across all 8 cells, generous transparent spacing. TOP ROW four walking cycle frames facing screen right (three-quarter toward viewer): left foot forward, passing, right foot forward, passing. BOTTOM ROW four walking cycle frames facing screen left and away from viewer: left foot forward, passing, right foot forward, passing. Arms naturally walking; empty hands. Realistic anatomy, NOT cartoon, NOT chibi, NO outlines. No background, no floor, no shadow, no labels, no text, no grid lines. Transparent pixels everywhere outside the people.

Prompt korekty: Remove all background; true transparent alpha; preserve all eight people, positions, size, clothing and poses in the unchanged 4×2 atlas. No shadows or glow outside people.

## 0.13.3 — wygodniejsze sterowanie
Lista niskich stanów zachowuje węzły przycisków, przewinięcie i kolejność przy aktualizacji. Nowe pozycje dopisywane są na końcu; uzupełnione pozostają oznaczone do zwinięcia listy. Przycisk pakowania jest zakotwiczony nad prawym rogiem zamówień na komputerze. Pole progu dostawy ma większą szerokość i styl zgodny z panelem gry.
Scena pokazuje dokładnie liczbę zatrudnionych osób, bez dodatkowej nieruchomej sylwetki właściciela. Klatki postaci mają stałe kotwiczenie; rytm kroków zależy od odległości. Trasy mają łagodny start i zatrzymanie. Animacja pozostaje uproszczonym atlasem 2D z czterema klatkami na kierunek.
