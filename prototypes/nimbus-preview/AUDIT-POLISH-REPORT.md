# Точечная доводка после аудита — локальный отчёт10.10.2026

Выполнено приложенное назначение MAIN. Прежние задания не повторялись.

## Изменения
1. Задачи: внутренние grid-элементы выровнены по началу, карточки естественной высоты. Стабильный внешний stack рассчитан всеми10 уплотнёнными сценариями. На390px описание–исходник18px, вокруг стрелки9px; внутренние элементы больше не распределяют свободную высоту. Резерв только внизу коротких примеров сохраняет положение соседних секций. Stack318,95px desktop /664,47px mobile; короткий mobile398,47px, длинный664,47px. На desktop самый длинный по высоте — «Контент», на mobile — «Отчёты».
2. Mobile результаты таблиц Hero/задач: одна и та же HTML-таблица выводится парами поля/значения. Дополнительная подпись генерируется из тех же columns и aria-hidden, исходные заголовки доступны, роли table/rowgroup/row/cell сохранены. Второго источника значений/дублирующего доступного представления нет. Desktop остаётся таблицей. «Консультация» читается целиком, доступная ширина206px.
3. Кейс: mobile заголовок29px/1.18, результат разделён на подпись и главный числовой акцент34px desktop/28px mobile. Полный точный текст и порядок чтения сохранены. Оговорка оценки клиента рядом и постоянно видна. Короткий немецкий фрагмент, полный документ в details и отзыв не изменены.
4. Земля: существующий panel mask усилен только за карточками (90%) и расширен на tabs (86%) через ещё один rect uniform, измеряемый при layout/resize. Размер, центр, география, медленное вращение, silhouette/halo, количество точек/DPR и shared ticker сохранены. Новых RAF/bloom/postprocessing нет. Fallback asset не изменён.
5. Mobile финал: между этапами20px, перед описанием8px, после разделителя22px, между контактными абзацами12px. Размеры поля/CTA и читаемого основного текста не уменьшены.
6. Theme-color#13171D в shell и регенерированном index. Title «Tigran AI — прототип» сохранён. Технические имена остаются, видимого Nimbus нет.

## Изменённые файлы
- scripts/render-page.mjs — подписи из columns, семантика таблиц, визуальные spans результата, маленький wrapper стрелки задач
- scripts/shell.html — theme-color
- src/styles/sections.css — только назначенные layout/mobile правки
- src/webgl/scene.js — rect вкладок внутри существующего resize/маски
- src/webgl/shaders.js — усиление существующего veil
- index.html — штатно сгенерирован
- AUDIT-POLISH-REPORT.md

## Проверки
Назначенные1440×900 и390×844. Все10 сценариев: устойчивая внешняя высота, отсутствие обрезки; короткий/длинный просмотрены и сняты. Mobile порядок и промежутки измерены. Табличные результаты проверены на pairs. Точные основные тексты сверены без дублей; поле/CTA с клавиатуры, шаблон URL и стабильность раскрытия кейса проверены. Ошибок page/console и горизонтального overflow нет. Короткая проверка progress/replay/pause прошла после изменения wrapper стрелки.

Одна исходная сборка и повтор после обнаруженного дефекта: прежний поворот широкого route-контейнера создавал границы, заходящие на карточки. Поворот перенесён на маленький24×24 wrapper, сохранив существующий signal/timeline. Контроллеры не переписаны. Никакой полной матрицы/GPU-аудита/watch.

SHA256 подтверждает неизменность SPEC, production site/, данных/сценариев, формы/контакта, motion controllers, lockfile/зависимостей, географической маски и fallback.

## OPEN
- Согласованный оригинальный HP-пакет по-прежнему отсутствует. Реконструкция не объявляется deployment-ready; mixed MSI/HP не вставлены.
- Физические телефоны, Safari, аппаратная производительность, ручные screen reader проверки и реальный Telegram composer в этом проходе не проверялись. Реальных сообщений нет.
- Короткие задачи сохраняют нижний резерв высоты самого длинного примера; это предотвращает скачки страницы, внутренние промежутки уплотнены.
- Commit/push/deployment, установка, production export не выполнялись.

## Локально
http://127.0.0.1:4176/?v=audit-polish

## Снимки

| Область | Desktop | Mobile |
|---|---|---|
| Hero, завершённый пример | [Desktop](F:/testlanding/.preview-checks/audit-polish/hero-1440.png) | [Mobile demo](F:/testlanding/.preview-checks/audit-polish/hero-demo-390.png), [верхний viewport](F:/testlanding/.preview-checks/audit-polish/hero-390.png) |
| Короткая задача | [Desktop](F:/testlanding/.preview-checks/audit-polish/tasks-short-1440.png) | [Mobile](F:/testlanding/.preview-checks/audit-polish/tasks-short-390.png) |
| Длинная задача | [Desktop](F:/testlanding/.preview-checks/audit-polish/tasks-long-1440.png) | [Mobile](F:/testlanding/.preview-checks/audit-polish/tasks-long-390.png) |
| Кейс | [Desktop](F:/testlanding/.preview-checks/audit-polish/case-1440.png) | [Mobile](F:/testlanding/.preview-checks/audit-polish/case-390.png) |
| Финал | [Desktop](F:/testlanding/.preview-checks/audit-polish/final-1440.png) | [Mobile](F:/testlanding/.preview-checks/audit-polish/final-390.png) |

Hero — обычные viewport. Секции выделены из обычных full-page captures без diagnostic CSS. Длинные mobile-секции не уменьшались ради одного экрана. Снимки изменённых областей просмотрены визуально; evidence:.preview-checks/audit-polish/checks.json.
