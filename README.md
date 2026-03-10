# Unisono Vlašim - Web

Webová stránka hudební kapely Unisono z Vlašimi.

## Funkce

- Responzivní design
- Dvojjazyčná podpora (CZ/EN)
- Přehrávač hudby
- Fotogalerie
- Kalendář akcí
- Kontaktní formulář (Netlify Forms)
- CMS pro správu obsahu (Decap CMS)

## Deployment na Netlify

### 1. Připojení GitHub repozitáře

1. Nahrajte tento projekt na GitHub
2. Přihlaste se na [Netlify](https://netlify.com)
3. Klikněte na "Add new site" > "Import an existing project"
4. Vyberte GitHub a tento repozitář
5. Nastavení ponechte výchozí a klikněte "Deploy"

### 2. Nastavení Netlify Identity (pro CMS)

1. V Netlify dashboardu jděte do "Site configuration" > "Identity"
2. Klikněte "Enable Identity"
3. V "Registration preferences" vyberte "Invite only"
4. V "Services" > "Git Gateway" klikněte "Enable Git Gateway"
5. Pozvěte sebe jako uživatele v "Identity" > "Invite users"

### 3. Nastavení Netlify Forms

1. Forms jsou automaticky povoleny
2. Emaily chodí na adresu spojenou s Netlify účtem
3. Pro přesměrování na info@unisonovlasim.cz:
   - Jděte do "Site configuration" > "Forms" > "Form notifications"
   - Přidejte "Email notification" s cílovou adresou

### 4. Přístup do CMS

Po nastavení Identity přejděte na:
```
https://vase-domena.netlify.app/admin/
```

## Struktura projektu

```
unisono-web/
├── admin/              # Netlify CMS
│   ├── index.html
│   └── config.yml
├── audio/              # MP3 soubory
├── content/            # Obsah spravovaný přes CMS
│   ├── events.json
│   ├── gallery.json
│   ├── about.json
│   └── contact.json
├── css/
│   └── style.css
├── images/
│   ├── uploads/        # Nahrané obrázky přes CMS
│   ├── logo.png
│   └── bg-guitar.jpg
├── js/
│   └── main.js
├── index.html
├── netlify.toml
└── _redirects
```

## Správa obsahu

### Přidání akce/koncertu

1. Přihlaste se do CMS (`/admin/`)
2. Klikněte na "Akce / Events"
3. Klikněte "New Akce"
4. Vyplňte údaje a uložte

### Přidání fotky do galerie

1. Přihlaste se do CMS
2. Klikněte na "Galerie / Gallery"
3. Klikněte "New Fotka"
4. Nahrajte obrázek a vyplňte údaje

## Kontakt

Email: info@unisonovlasim.cz
