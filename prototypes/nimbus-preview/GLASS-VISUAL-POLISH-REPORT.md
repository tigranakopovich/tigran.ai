# Glass visual audit — корректирующий проход Builder

04.10.2026. Scope: SPEC + GLASS-VISUAL-AUDIT-2026-10-04.md; прежние инженерные ограничения сохранены.
Локальный результат для просмотра владельцем; визуальная приёмка не объявляется автоматически.

## Preview

http://127.0.0.1:4176/ — существующий Vite preview без watch, оставлен для просмотра.
Запуск при необходимости: npm run preview --prefix prototypes/nimbus-preview.
Root production не экспортировался. SPEC, package/lockfile, Lenis и контроллеры каруселей/формы не изменены. Commit/push/публикации/реальных сообщений нет.

## Исправления

1. Natural Earth land1:110m получен с официального CDN. Локальная маска1024×512, компактные интервалы строк JSON и orthographic fallback25E/12N из одной географии. Сохранены исходный архив, SHA256, provenance, скрипт подготовки stdlib/Pillow (существующий runtime, без install).
   Каталог: https://www.naturalearthdata.com/downloads/110m-physical-vectors/
   Архив: https://naciscdn.org/naturalearth/110m/physical/ne_110m_land.zip
   Terms/public domain: https://www.naturalearthdata.com/about/terms-of-use/
   Источник рядом с asset: public/earth/SOURCE.md; оригинал scripts/geography/ne_110m_land.zip.
2. aLand/aShell назначаются один раз seeded точкам; берега получают небольшой дополнительный акцент. Океаны слабее материков, задняя полусфера приглушена, volume22% имеет меньшую alpha. Движение uniforms, ракурс Европа/Африка/Азия; X/Y проекция без растяжения. Число19000desktop/7000mobile и исходные positions не менялись. Нет сетевых geo запросов в runtime, новых RAF/postprocessing.
3. Материал: static neutral light позади поверхностей, верхнее отражение, серебристый верх/боковой край, глубина тени. Outer glass.72; backing только под читаемыми данными. Hero без blur для видимости географии, workspace/final ограниченный desktop blur8px; mobile/coarse gradients без blur. Вне Hero частиц нет.
4. Hero: компактнее таблицы/поля/варианты, общий stack461px desktop вместо484px предыдущего прохода; одинаковая геометрия всех6. Сохранены левый copy/CTA и заполнение6s.
5. Задачи:10 существующих SVG-иконок вкладок, h3 31px/description18px desktop, source/result по реальному наполнению без растянутого пустого низа. Arrow центрирован в свободном промежутке. Replay — компактная outline кнопка, progress15s/stop/повторы сохранены.
6. Кейс: Telegram badge/message bubble, материалы документ/file label, Sheets таблица; две mint ветви2px. HP/art1/немецкий текст и отдельный ряд details сохранены. Никаких generated фото, количества файлов, размеров или времени.
7. Финал: icon glass tiles, H2 контакта42px/две смысловые строки desktop,30px mobile, без дополнительной SVG-стрелки у «Перейти в Telegram ↗». Общая панель820px desktop; аватар и точные Primary Conversion тексты/поле/URL сохранены.

## Фактические проверки

Только1440×900 и эмуляция touch390×844 в Chromium/Chrome, плюс короткий initial reduced/fallback smoke; предыдущая матрица не повторялась.
- Итоговый Vite build exit0. План одной сборки не выдержан: всего5 запусков после ошибки UTF-8 в подготовительном скрипте и адресных визуальных исправлений читаемости/обрамления Земли, заголовка контакта/стрелки и компактности таблиц. Watch/install отсутствуют.
- Full-page screenshots desktop/mobile и4 сравнения: reference приведён к1440px, implementation1440px; Hero «Заявки» и tasks «Контент» в полном завершённом состоянии. Изображения лично просмотрены, не только проверен overflow.
- Overflow=false на обоих размерах, header fixed, верхний scroll progress видим; console/pageerror0 в ограниченном check.
- Hero active-tab replay сбрасывает runId; финальная высота stack[461,461,461,461,461,461].
- Tasks manual progress≈.067 через1s →1 после15s. Replay→0/source, stop→1/result, resume→source. Enter выбирает вкладку; focus solid2px. Контроллеры не переписывались.
- Материалы кейса Enter открывает/Escape закрывает+focus; docTop текста/сцены не меняется при toggle на1440/390.
- Renderer frames stopped вне Hero; DPR/cap/lazy/cleanup/shared ticker сохранены. Это targeted smoke, не повторная полная lifecycle матрица.
- Initial reduced: result/full content/manual selection, GPU=false, scene/three chunks не запрошены; fallback из той же маски. Normal WebGL-off: fallback visible/GPU=false, основной контент доступен.
- Последняя статическая проверка: final desktop820px; H2 42px/95px высотой, обе строки47px. Mobile final1451px, естественный рост без clipping, H2 30px.
- Запись Earth/демонстраций — GIF browser screenshots, не измерение аппаратного FPS.

Измерения: .preview-checks/glass-polish/checks.json, final-checks.json, earth-final.json.

## Визуальная сверка и оставшиеся расхождения

- Hero: композиция и прозрачность ближе, реальная география вместо абстракции. Earth имеет меньше точек/деталей и менее яркий край, чем generated reference: текущий утверждённый particle count сохранён. В коротком примере есть общий резерв под полный контент всех6, но stack сокращён461px и стабилен. Правая кромка крупной Земли подходит к краю viewport. Сходство не заявляется пиксельным.
- Tasks: одна glass navigation и source→result, усиленная типографика. Вход короче результата — карточки имеют естественную разную высоту, не растягиваются пустотой. Сохранена точная дополнительная note, отсутствующая на mockup. Используются существующие SVG, не весь brand-icon набор изображения.
- Case: узнаваемые три интерфейса и2 ветви. Текст длиннее сгенерированного mockup: сохраняется утверждённая немецкая редакция. Нет вымышленных JPG/5files/KB/time; исходные фото отсутствуют. Полная5-column Sheets строка доступна в details, компактная карточка отделяет model/CPU от art/RAM/SSD.
- Final: H2 в2 строки как целевая композиция, panel820px; портрет меньшего утверждённого размера136px, с сохранённым кадрированием готового asset. Ref имеет более яркое и контрастное отражение; реализация спокойнее и не зависит от blur/mobile GPU. Реальная fixed header видна при scroll, в section mockups её нет — это сохранённое требование.

## Артефакты

.preview-checks/glass-polish/desktop.png
.preview-checks/glass-polish/mobile.png
.preview-checks/glass-polish/earth-and-demos.gif
.preview-checks/glass-polish/comparison-hero.jpg
.preview-checks/glass-polish/comparison-tasks.jpg
.preview-checks/glass-polish/comparison-case.jpg
.preview-checks/glass-polish/comparison-final.jpg
Также section screenshots1440/390 и fallback/reduced.

## Изменённые файлы этого прохода

В prototypes/nimbus-preview/:
- scripts/render-page.mjs — badges и SVG существующих вкладок, geographical fallback DOM
- scripts/contact.html — смысловые строки H2 и удаление дублирующей SVG-стрелки
- src/styles/tokens.css — glass/reflection/shadow
- src/styles/sections.css — световые планы/иерархия/компактность
- src/main.js — диаметр Earth относительно группы panels
- src/webgl/scene.js — once land/shell classification/initial view
- src/webgl/shaders.js — land/ocean/coast/front/volume lighting
- src/webgl/land-mask.json — prepared geographic row intervals
- scripts/geography/prepare-earth.py, ne_110m_land.zip, SOURCE.md
- public/earth/natural-earth-land-mask.png, earth-fallback.webp, SOURCE.md
- index.html — существующий renderer; dist — generated build
- GLASS-VISUAL-POLISH-REPORT.md — этот отчёт
Локальные checks/artifacts — .preview-checks/glass-polish/.

## OPEN

- Оригинальные фотографии HP/art1 и разрешения отсутствуют. Фотографии не выдуманы.
- Telegram composer/передача на реальных устройствах остаются OPEN; форма/шаблоны сохранены, сообщений не отправлялось.
- Физические телефоны/Safari/аппаратная плавность и FPS не подтверждены программным GPU Chromium.
- Динамическое переключение reduced motion не входит в этот smoke; initial reduced подтверждён.
- Окончательная визуальная приёмка владельцем после локального просмотра. Географический source ранее OPEN теперь подготовлен; оставшиеся визуальные различия перечислены выше.
