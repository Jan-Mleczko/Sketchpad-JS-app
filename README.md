# Szkicownik w JavaScript

Oto aplikacja Szkicownik będąca prostym edytorem graficznym. Działa ona na stronie WWW wewnątrz przeglądarki, ponieważ napisałem ją w JavaScript z wykorzystaniem Canvas API. Odznacza się on przede wszystkim dużą konfigurowalnością.

![Zrzut ekranu](https://github.com/Jan-Mleczko/Sketchpad-JS-app/blob/main/zrzut.jpg?raw=true)

Użytkownik ma do dyspozycji następujące narzędzia do rysowania:
* Rysowanie odręczne, tak jak narzędzie _Ołówek_ w programie MS Paint.
* Zmazywanie (tak jak narzędzie _Gumka_ w programie MS Paint).
* Zmazanie całego rysunku naraz.
* Nakreślenie równego odcinka między dwoma punktami (jak narzędzie _Linia_ w MS Paint).
* Namalowanie prostokąta lub koła.

Inne funkcjonalności:
* Ikony wyboru narzędzi z podpowiedziami dotyczącymi określonego narzędzia wyświetlanymi na pasku stanu aplikacji, gdy użytkownik najedzie myszą na ikonę narzędzia. Zmiana narzędzia nastąpi dopiero po kliknięciu jego ikony.
* Paleta barw łatwo konfigurowalna w kodzie.
* Konfigurowalny rozmiar obszaru rysowania. Reszta GUI się do tego dostosuje.
* Konfigurowalny rozmiar ikon narzędzi. Przeskalują się one odpowiednio.
* Skrypt nie jest ściśle związany z dokumentem HTML. Wystarczy zaznaczyć odpowiednim ID, gdzie na stronie ma się znaleźć obszar aplikacji, a skrypt sam się tym zajmie. Przykładowy plik HTML ma tylko 11 wierszy.
