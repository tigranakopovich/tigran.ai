# Tigran AI — отдельный локальный prototype

Дата: 02.10.2026. Основание: SPEC.md и references/attio-study/BUILDER-BRIEF.md, README/MEASUREMENTS.json, desktop-hero / hero-windows / platform и mobile-hero screenshots.

## Отдельная публикация по запросу владельца

02.10.2026 владелец разрешил push и публикацию подготовленного прототипа. Размещается отдельный путь `/prototypes/attio-preview/hero-storyboard.html`; основной лендинг не заменяется. Кадры остаются статичными. Далее сохранён отчёт о локальном этапе.

## Просмотр

Открыть [прототип](http://127.0.0.1:4174/). Сервер запущен отдельно от основного локального preview.

Повторный запуск из F:\testlanding: `node prototypes/attio-preview/preview-server.cjs`. Остановка — Ctrl+C. Только localhost, без watch/авто-аудитов.

## Что реализовано

- Пять секций с прежними marketing-copy, фактами и Primary Conversion.
- Центрированный Hero: две строки на широком desktop, описание и CTA сверху, широкая сцена 1200×600 ниже. Основное окно, sidebar, три источника и подтверждение сохранения. Текст и полный результат видны сразу.
- macOS-подобные собственные рамки с непрозрачным контентом. Три точки декоративны, не имеют действий. Apple logo/fonts, fake app controls и enterprise offer не используются.
- Задачи: три явных selector с постоянно видимыми названиями/описаниями, одна большая выбранная сцена, кнопка запуска. Результаты не очищаются, сохраняются, повтор доступны. Один активный task timeline.
- Кейс: Telegram-вход и две независимые ветви — материалы объявления и Google Sheets. Модель и 16 GB RAM / 512 GB SSD согласованы во всех иллюстративных результатах. Laptop SVG только в кейсе.
- Работа: все три полных описания выше одной общей сцены. Явный выбор click/Enter/Space, переход 120+120 ms, повтор и стабильная высота. Review / Build / Support — самостоятельные примеры.
- Контакт: оригинальный портрет с оранжевым фоном, desktop 200×220 / mobile 88×88; одно необязательное поле и точные шаблоны личного Telegram.
- Отдельная mobile/tablet-композиция: нормальный поток окон, вертикальные source→result, full-width task selector; нет уменьшения всего canvas.

## Motion и lifecycle

scene-controller.js адаптирован из supporting инженерного контракта. Данные отделены в data.js, timelines — в timelines.js, bindings/геометрия — app.js.

- Hero: около 9 s + 5 s статичной паузы, не более двух desktop autoplay; unlimited явный replay. Mobile/tablet Hero запускается только кнопкой. Пауза/продолжение останавливают WAAPI и timers.
- «стоимость», «Заявка.pdf», «Анна» и собранная запись переносятся измеренными Bézier-траекториями. Temporary nodes не участвуют в layout, aria-hidden, удаляются при завершении/отмене.
- Задачи: Lead 3.8 s, Status 4 s, Document 4.6 s; кейс один проход около 5 s; выбранные work-сцены 4–5 s.
- SVG-пути вычисляются по реальным allocated zones. Нет magic translate на адаптивном layout, масштабирования всего canvas или измерений layout на каждом кадре.
- Resize (ширина или высота), offscreen, hidden-document event, contact focus и reduced motion отменяют/settle timelines. Pending awaits разрешаются; stale runId не изменяет новую сцену.
- Нет постоянного JS tick, новых dependencies, анимированных больших blur/shadows, сетевых demo-интеграций или отправки сообщений.

Для читаемости наслоения document-source поставлен на z=3 вместо проектного z=1: его файлы остаются видны. Центральный контент ограничен 560px / 440px на narrow desktop, чтобы окно документов не закрывало шаги и поля. Это локальное уточнение target geometry для review, не изменение copy/SPEC.

## Выполненные проверки

Chrome headless с установленным Chrome, локальный HTTP. Статика проверялась до включения timelines, затем повторно после исправлений.

- 1440 / 1280 / 1024 / 768 / 430 / 390 / 360 / 320 px: пять секций, нет horizontal overflow/обрезаний окон, локальный Manrope с кириллицей; основной текст из SPEC. Source message дословный, ID уникальны.
- Keyboard: Enter/Space для запуска и выбора, видимый focus, mobile menu / Escape / возврат focus. Focus и поле стабильны.
- Flight: значение «стоимость» совпадает с target; рассчитанное конечное положение отличается менее 1px. Независимые endpoints обеих case-ветвей проверены на desktop/tablet.
- 10 быстрых Hero replays, 10 task replays, rapid work switching: нет transient leaks или stale-result callback; одновременно ≤1 playing task.
- Все три task outcomes, повтор и сохранённый результат проверены. Высоты task/work workspace постоянны при выборе на desktop и mobile.
- Hero pause/resume, ограничение двумя autoplay, отсутствие Hero autoplay на mobile, resize во flight, height-only resize, offscreen, focus contact проверены.
- Reduced motion отключает timelines, мгновенный статичный результат сохраняется. document.hidden / visibilitychange моделированы; реальное OS-переключение вкладок не проверено.
- Ошибки JS / console / HTTP ресурсов в проверках отсутствуют.
- Найденные проблемы — конфликт panel/live-status ID и изменение высоты скрытого review-panel — исправлены; проверки повторены успешно.

Screenshot-crops снимались с временно static header и скрытым offscreen skip-link, чтобы Chrome не накладывал fixed/sticky элементы при захвате блока длиннее viewport. Рабочий прототип сохраняет sticky header и доступный skip-link; keyboard checks выполнены с обычными стилями.

## Screenshots и запись

- [Desktop 1440 — полная страница](F:/testlanding/.preview-checks/attio/static-1440.png)
- [Desktop 1280](F:/testlanding/.preview-checks/attio/static-1280.png)
- [Desktop 1024](F:/testlanding/.preview-checks/attio/static-1024.png)
- [Tablet 768](F:/testlanding/.preview-checks/attio/static-768.png)
- [Mobile 390 — полная страница](F:/testlanding/.preview-checks/attio/static-390.png)
- [Mobile 320](F:/testlanding/.preview-checks/attio/static-320.png)
- [Hero windows](F:/testlanding/.preview-checks/attio/windows-1440.png)
- [Сопоставление с reference — обе версии 1440px](F:/testlanding/.preview-checks/attio/comparison-1440.png)
- [Короткая запись — Hero, три задачи и внедрение](F:/testlanding/.preview-checks/attio/motion-demo.gif)

Запись: 109 browser frames, GIF около 27 s / 960×600 / 2 MB. Это обзор движения, не performance measurement. Отдельно сохранены Hero кадры 0 / 1.5 / 3.7 / 6 / 8 / 14 s: `.preview-checks/attio/hero-time-*.png`.

Все evidence/разовые скрипты в .preview-checks/attio/ (Git ignore).

## Изменённые файлы и сохранность

Созданы только файлы этого prototype: index.html, styles.css, app.js, data.js, timelines.js, scene-controller.js, preview-server.cjs, README.md.

Production index.html, styles.css, script.js, preview-server.cjs и SPEC.md совпадают по SHA256 с состоянием начала задачи. Существовавшие изменения MAIN в SPEC/supporting documents/LOCAL-REVIEW сохранены. Commit/push/deploy не выполнялись. Основной опубликованный сайт не изменён.

Общие assets только прочитаны: локальные Manrope, favicon, outline-icon/laptop symbols и Avatar-preview.webp (существующая копия реального Avatar.png). Оригинальный портрет не редактировался.

## OPEN / не проверено

- Безопасного согласованного publish-пакета case нет. Прототип использует явно обозначенные иллюстрации, не реальные client screenshots.
- Оба Telegram templates, личный target @tigran_ai и Unicode URL проверены. Composer в Telegram Desktop/Web/Android/iOS здесь не подтверждён; технический сценарий остаётся OPEN. Реальные сообщения не отправлялись.
- Физические iOS/Android, Safari, реальные медленные сети и performance profiling не проверены. Нет заявления о 60fps/конверсии.
- Требуется оценка владельца визуального prototype и отдельный integration brief для production.
