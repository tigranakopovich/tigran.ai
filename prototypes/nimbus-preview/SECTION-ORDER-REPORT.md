# Порядок секций — локальный отчёт10.10.2026

По прямому назначению владельца поменяны местами только две существующие секции.

## Итог
Hero → Проект → Задачи → Как работаю / контакт.

Изменена одна строка сборки main в scripts/render-page.mjs: hero+project+tasks+finale. index.html регенерирован штатной сборкой. Никаких перестроений компонентов, новых копий контента или нового JS не добавлено.

## Сохранено
Содержимое каждой секции сравнено до/после: идентично. SHA256 подтвердил неизменность всех src файлов (стили, данные, renderer, контроллеры), формы/контакта, shell, зависимостей/lockfile, SPEC, production site/ и предыдущего AUDIT-POLISH-REPORT.md. Названия/порядок ссылок шапки и целевые ID/якоря сохранены; назначение касалось только порядка секций. Существующие отступы и плавность якорной прокрутки не менялись.

## Проверки
Одна успешная сборка. Целевой Chrome1440×900 /390×844: DOM-порядок секций, переход «Посмотреть проект» к #project, desktop/mobile навигация к #tasks, выбор и пауза примера задач. Целевые секции видны ниже fixed header. Горизонтального overflow, page/console ошибок нет. Полную матрицу/GPU-аудит/watch не выполнял.

## Изменённые файлы этого прохода
- scripts/render-page.mjs — только порядок main
- index.html — сгенерированная перестановка
- SECTION-ORDER-REPORT.md

## Локальный просмотр
http://127.0.0.1:4176/?v=project-first

## Два отчёта для передачи MAIN
- [Новый: перестановка секций](F:/testlanding/prototypes/nimbus-preview/SECTION-ORDER-REPORT.md)
- [Предыдущий: точечная доводка после аудита](F:/testlanding/prototypes/nimbus-preview/AUDIT-POLISH-REPORT.md)

Предыдущий отчёт сохранён без изменений, включая ссылки на снимки изменённых областей.

## Снимки текущей версии
- [Проект desktop](F:/testlanding/.preview-checks/section-order/project-1440.png)
- [Проект mobile](F:/testlanding/.preview-checks/section-order/project-390.png)
- [Задачи desktop](F:/testlanding/.preview-checks/section-order/tasks-1440.png)
- [Задачи mobile](F:/testlanding/.preview-checks/section-order/tasks-390.png)

Evidence: .preview-checks/section-order/checks.json.

## OPEN
Новых вопросов по перестановке нет. Прежние OPEN сохранены: согласованный HP-пакет, физические устройства/Safari и Telegram composer. Реальные сообщения не отправлялись. Не было production export, commit/push или публикации.
