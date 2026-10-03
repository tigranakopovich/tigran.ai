# Nimbus — финальная точечная доводка

Дата: 03.10.2026. Назначение MAIN: references/BUILDER-NIMBUS-FINAL-POLISH.md. Локальная версия, визуальная приёмка владельца ожидается.

Preview: http://127.0.0.1:4176/ — существующий Vite preview собранного dist, без watch.

## Сделано

- Hero на wide/high desktop получает отдельный первый экран: min-block-size:100svh, arrow 28 px от нижнего края. На коротких/узких экранах естественная высота, без clipping, snap/pin или смены Lenis/touch.
- Удалено вертикальное центрирование содержимого карточек в flex:1; данные находятся непосредственно после заголовков. Стабильная геометрия шести примеров сохранена.
- Сфера центрируется по объединённым source/result панелям. Область canvas квадратная 1,42 ширины демо; camera z=6,4, проекция силуэта примерно 1,16 ширины демо. Silver rim, прозрачный центр, мягкий боковой свет, ослабление дальних точек и размер по глубине. Убран прежний pulse; вращение и дыхание сохранены. Точки 19000 desktop /7000 mobile не увеличивались. DPR, lazy import, один ticker, visibility/hidden, BFCache и mobile cap сохранены. Размещение измеряется только при initial/fonts/resize/restore, без DOM измерений на кадре. CSS fallback использует ту же область.
- Материалы кейса вынесены из растущей правой колонки в отдельный полный ряд. Copy/схема выровнены по началу; раскрытие не меняет их положение. Desktop body — три колонки, mobile — последовательный поток. Native summary, aria-expanded и Escape/focus сохранены; SVG пересчитывается на toggle, без auto-scroll. Технические provenance-заметки убраны из интерфейса; краткая подпись примера, полный немецкий текст и данные HP/артикул 1 сохранены.
- Финал: padding28, gaps20, компактные outcome/divider/footer; убран принудительный перенос work H2, font36 на desktop. Портрет136×154, широкая контактная колонка. Форма и основные тексты сохранены.
- Подписи каналов: одинаковые три строки, отдельные колонки названия и формата, спокойный разделитель. Заполнение/прогресс/повтор не переписывались.

## Ограниченные проверки

Один build после правок — PASS (Vite exit0). Размеры только1440×900 и390×844. Оснований повторять720px/полную девятиразмерную матрицу не обнаружено: высота ограничивается min-size только для high/wide Hero, остальные экраны и финал растут по содержимому.

- Desktop Hero900px; tasks H2 top1030px, на первом экране его нет. Overflow false. Screenshot desktop.png снят в обычном motion, reduced=false, WebGL available=true, 19000точек; renderer работал (frames886 на момент измерения), fallback не выдаётся за GPU.
- Сфера просмотрена на desktop screenshot: видимые верхняя и боковые дуги за обеими карточками, без прямоугольного отсечения canvas; слабее текста/CTA.
- Open/close case: desktop copy docTop1880,77 /scene1908,77 /summary2640,48 не изменились; scroll2158 остался прежним. Mobile docTop copy2574,41 /scene3217,20 /summary4360,69, scroll3906 — без изменения. Summary после Escape видим: top482,48desktop/454,69mobile, aria-expanded=false, focus возвращён.
- Полный немецкий текст содержит Artikelnummer:1; технические интерфейсные заметки удалены. Данные не менялись; новых фото нет.
- Final panel1440: 760px вместо1027px в исходном измерении. Work H2 одна строка42px, портрет136px. Input56px/font16. Mobile panel1345px, естественная прокрутка; input56px при min52/font16, портрет88px. Текст не обрезан.
- Горизонтального переполнения нет на двух размерах, ошибок JS/console нет. Mobile screenshot статичный с initial reduced, настоящий портрет декодирован.
- Не выполнялась повторная проверка всех сценариев, stress, fallback/lifecycle-матрица, физических устройств или динамического reduced motion. Основа заполнения/формы/контроллеров не изменялась.

Evidence: F:/testlanding/.preview-checks/polish/checks.json, baseline.cjs/check.cjs и screenshots.

## Screenshots

- F:/testlanding/.preview-checks/polish/desktop.png — первый экран1440×900, обычный motion/WebGL.
- F:/testlanding/.preview-checks/polish/mobile.png — вся mobile-страница390px, reduced static.
- Дополнительные целевые кадры для отчёта: final-1440.png/final-390.png, materials-1440.png/materials-390.png там же.

## Изменённые файлы этого прохода

- prototypes/nimbus-preview/scripts/render-page.mjs
- prototypes/nimbus-preview/src/main.js (только размещение поля на layout changes)
- prototypes/nimbus-preview/src/webgl/scene.js
- prototypes/nimbus-preview/src/webgl/shaders.js
- prototypes/nimbus-preview/src/styles/sections.css
- prototypes/nimbus-preview/src/motion/supporting.js (только draw на toggle)
- prototypes/nimbus-preview/index.html (generated)
- prototypes/nimbus-preview/FINAL-POLISH-REPORT.md, REDESIGN-REPORT.md (актуальный указатель)

Ignored dist/.preview-checks/polish — сборка и доказательства. SPEC/VISUAL, carousels.js, choreography.js, form.js, data и lockfile в этом проходе не редактировались. Production export, commit/push, публикация, зависимости и реальные сообщения не выполнялись.

## OPEN

Оригинальные фото HP/разрешения отсутствуют. Немецкий текст — утверждённая редакция для лендинга, не оригинальный bot output; вход Telegram/table — HTML по утверждённым данным, не клиентские screenshots. Telegram composer, физические устройства/Safari, реальные FPS и динамическое reduced motion остаются неподтверждёнными. Это ограниченная локальная проверка, не повторная полная приёмка сайта.
