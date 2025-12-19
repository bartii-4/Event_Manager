Prosty system do zarządzania wydarzeniami (meetupami).

Funkcjonalności:
- Rejestracja i logowanie użytkownika (hasła są hashowane)
- Pełny CRUD wydarzeń (tworzenie, wyświetlanie, edycja, usuwanie)
- Filtracja i sortowanie listy wydarzeń przez parametry w URL oraz formularz GET
- Prosty, spójny frontend przy użyciu EJS (widoki: lista, szczegóły, formularz, login, rejestracja)

Technologie:
- Node.js + Express
- EJS (widoki)
- MongoDB (sterownik "mongodb")

Instalacja:
1. Zainstaluj zależności:

```powershell
npm install
```

2. Uruchom lokalnie MongoDB lub użyj kontenera (instrukcja w docker.txt).

3. Uruchom aplikację:

```powershell
npm start
```

Domyślnie serwer startuje na http://localhost:3000

Pliki ważne:
- `src/connection/db.js` — połączenie z MongoDB
- `src/models` — proste modele (`User.js`, `Event.js`)
- `src/controllers` — logika HTTP
- `src/routes` — routy Express
- `src/views` — widoki EJS

Autor: Kręcisz Bartosz
Licencja: MIT
