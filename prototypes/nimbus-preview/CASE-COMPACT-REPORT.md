# Компактный кейс и название — локальный отчёт 10.10.2026

Выполнен только BUILDER-CASE-COMPACT-BRIEF. Старые задания не повторялись.

## Изменения
Основная карточка «Материалы объявления» содержит прежние заголовок/подпись, HP EliteBook840G7, характеристики, одну фразу «Das HP EliteBook 840 G7 bietet16GB Arbeitsspeicher und eine512-GB-SSD.», артикул1 и прежнюю строку папки/Advertisement.txt. В интерфейсе фраза дословная с исходными пробелами. Два повторных полных абзаца удалены только из preview. Полный немецкий файл и его отображение в details не изменены.

Высота естественная:372,9px desktop /376,9px mobile. Резервного min-height нет, CSS не менялся. Линии/контроллер связей не переписывались. Остальной copy, отзыв, результат, Telegram, Sheets, форма и motion сохранены.

Title из shell: «Tigran AI — прототип». Package name: tigran-ai-preview. Два name-поля корня lockfile синхронизированы, версии/дерево неизменны. Активное название в README и локальном legacy publish helper исправлено; helper не запускался.

## Изменённые файлы
- scripts/render-page.mjs
- scripts/shell.html
- index.html — регенерирован
- package.json
- package-lock.json — только два name-поля
- README.md — название, технические пути сохранены
- publish-root.cjs — текстовые обозначения/title, без запуска
- CASE-COMPACT-REPORT.md

## Проверки
Одна успешная сборка Vite. Кейс1440×900/390×844: один короткий фрагмент, полный документ в details, совпадение артикула, отсутствие overflow/внутренней прокрутки/line-clamp, естественная высота, Enter/Space на summary, основной ряд не сдвигается. Начало/конец обеих линий совпадают с геометрией карточек до/после resize (отклонение менее0,001px). Ошибок page/console нет. Снимки просмотрены.

SHA256 подтвердил неизменность controller/renderer/данных/полного документа/формы/стилей/production site/. Lock tree сравнен отдельно без name-полей. Полная матрица/GPU-аудит/watch не повторялись.

Поиск в текущих src/scripts: осталось только техническое window.nimbusPreview, используемое для диагностики. В видимом body/title/package name чужого названия нет. Каталог prototypes/nimbus-preview, технические пути/imports, URL и исторические отчёты/архивы не переименованы. Исторические mentions Nimbus в SPEC сохраняются — передать MAIN для документального решения, Builder SPEC не редактировал. Root scripts/export-site.cjs также вне назначенного scope; перед будущей публикацией нужно учитывать новый prototype title в его существующем преобразовании title. Экспорт сейчас не выполнялся.

## OPEN
Согласованный оригинальный HP-пакет отсутствует; reconstruction не становится deployment-ready. Физические телефоны/Safari/Telegram composer в этом ограниченном проходе не проверялись. Публикации, commit/push, установки и реальных сообщений не было.

## Просмотр
http://127.0.0.1:4176/?v=compact-1010

![Desktop](F:/testlanding/.preview-checks/case-compact/case-1440.png)

![Mobile](F:/testlanding/.preview-checks/case-compact/case-390.png)

Секции выделены из обычного full-page capture при scrollY=0; mobile использует естественную высоту, без diagnostic CSS. Evidence: .preview-checks/case-compact/checks.json.
