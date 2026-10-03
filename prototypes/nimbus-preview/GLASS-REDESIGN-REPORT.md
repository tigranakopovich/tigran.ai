# Graphite / glass — локальный отчёт Builder

Дата: 04.10.2026. Назначение: references/BUILDER-GLASS-REDESIGN-BRIEF.md.
Статус: визуальная доработка подготовлена для просмотра; узнаваемая Земля OPEN из-за отсутствия источника географии. Визуальная приёмка владельцем не заявлена.

## Просмотр

http://127.0.0.1:4176/ — существующий Vite preview, без watch. Сервер оставлен для просмотра владельцем.
Повторный запуск: npm run preview --prefix prototypes/nimbus-preview.
Собранный результат: prototypes/nimbus-preview/dist; root production не экспортировался.

## Выполнено

- Единая нейтральная graphite палитра #13171D / #202630, серебристые границы, мягкий верхний свет и тени. Старые зелёные поверхности заменены в существующих правилах. Mint сохранён для действий, выбора и статуса.
- Glass: крупные desktop surfaces blur8px, без вложенных фильтров; mobile/coarse плотнее, blur0. Внутренние данные имеют плотную читаемую подложку. Glow — один слой с мягкой маской края.
- Hero 56/44 после gap: три строки H1, компактнее содержимое, стабильные карточки. На 1440×900 Hero900px, стрелка заканчивается в872px, задачи ниже первого viewport.
- Сфера центрируется относительно высоты двух карточек. Seeded arrays и число точек сохранены; прежняя деформация осей/силуэта компенсирована shader, вращение замедлено uniform. Круглая абстрактная сфера, не готовая географическая Земля.
- Каналы оформлены компактными строками. Кейс сохранил раздельные материалы/Sheets и стабильное раскрытие полным рядом.
- Финал desktop760px, новый отдельный портрет WebP16 610bytes из предоставленной производной; без перекраски или повторной генерации. Лицо/волосы/подбородок сохранены. Ширина136px desktop /88px mobile, пропорции4:5.
- Контроллеры, сценарии6/15s, тексты, данные HP/art1, форма, оба Telegram шаблона, fixed header/progress, меню, Lenis, lazy loading/DPR/общий ticker не переписаны.

## Изменённые файлы (этот проход)

В prototypes/nimbus-preview/:
- src/styles/tokens.css
- src/styles/base.css
- src/styles/components.css
- src/styles/sections.css
- src/main.js — геометрия размещения сферы
- src/webgl/scene.js — скорость вращения
- src/webgl/shaders.js — компенсация формы
- scripts/contact.html — отдельный портрет
- public/images/tigran-graphite.webp — оптимизированный asset
- index.html — обновлён существующим renderer
- GLASS-REDESIGN-REPORT.md — этот отчёт

Generated dist обновлён сборкой. Локальные scripts/screenshots/motion/check results сохранены в .preview-checks/glass/ (не source/production).
SPEC, VISUAL-SYSTEM, root production, package/lockfile не изменялись этим проходом. Уже существующие документальные изменения MAIN сохранены. Commit/push/публикации нет.

## Фактические проверки

Ограниченный Chromium/Chrome desktop1440×900 и эмуляция touch/mobile390×844; не полный аудит.

- Build exit0. Вторая сборка только после выявленных проблем: Hero первоначально950px и прямоугольный край glow; после исправления Hero900px и мягкая маска края.
- На обоих размерах overflow=false; header fixed; progress виден; поле16px, высота56px; портрет загружен.
- Hero: повтор активной вкладки сбрасывает runId/progress и начинает source.
- Задачи: source→fill→итог; progress около.067 через1s, полный1 после15s; активная вкладка повторяет, stop показывает полный итог, continue начинает новый проход. Один действующий контроллер сохранён.
- Кейс: docTop текста/сцены одинаковы до открытия/после открытия/после закрытия. Enter открывает, Escape закрывает и возвращает focus.
- Keyboard smoke: Enter выбирает вкладку; focus-visible solid2px на обоих размерах. Не заявляется повторная полная клавиатурная матрица.
- Initial reduced smoke: все значения видимы, manual выбор работает, progress1, GPU=false, scene/three chunks не запрошены.
- Normal-motion WebGL off: fallback виден, основной контент доступен. Renderer frames не увеличиваются вне Hero на обоих размерах.
- Ошибки console/pageerror:0 в ограниченной проверке.
- Новые computed palette и смешанные поверхности: консервативный расчёт при максимальной surface alpha.84 и слабой белой подсветке.07: ink11.66:1, secondary7.06:1, mint7.93:1; CTA10.13:1. Это проверка новой палитры, не полный аудит каждого пикселя.
- Telegram: проверены сформированные draft URL с пустым полем и кириллицей «Веломастерская», реальные сообщения не отправлялись; composer/передача на устройствах не подтверждены.

## Артефакты

- .preview-checks/glass/desktop.png — full page1440px, обычный motion
- .preview-checks/glass/mobile.png — full page390px
- .preview-checks/glass/hero-1440.png — Hero с обычным WebGL motion
- .preview-checks/glass/motion.gif — короткая покадровая запись Hero/задач; не измерение FPS
- .preview-checks/glass/checks.json, final-checks.json, contrast.json — измерения

ffmpeg отсутствует; зависимости не устанавливались. Запись сохранена GIF существующим Pillow из browser screenshots.

## OPEN / ограничения

1. Достоверная локальная география/подготовленный asset континентов отсутствует. Нужна equirectangular land mask либо лицензированный локальный GeoJSON/SVG с источником. Четыре mockup изображения не являются географическими данными. Случайные острова не добавлены. Текущий круглый абстрактный particle fallback/scene нельзя принимать за готовую Землю.
2. Оригинальные фото HP и связь фото с art1, разрешения публикации отсутствуют. Generated ноутбуки и вымышленные файлы не использованы.
3. Telegram composer, реальные телефоны/Safari, аппаратная плавность/FPS не проверены этим проходом. Проверки выполнялись в Chromium с программным GPU.
4. Динамическое изменение reduced motion не включалось в этот smoke; initial reduced проверен.
5. Визуальная приёмка нового оформления и портрета — после просмотра владельцем. Публикация не выполнялась.
