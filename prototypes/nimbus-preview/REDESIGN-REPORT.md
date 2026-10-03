# Локальный редизайн Nimbus — отчёт Builder

> Последующее ограниченное назначение MAIN выполнено 03.10.2026: предыдущие уточнения в REFINEMENT-REPORT.md; последний ограниченный проход и текущие screenshots описаны в FINAL-POLISH-REPORT.md. Ниже сохранён исторический отчёт первоначального прохода, его прежние timings/controls заменены новым назначением.

Дата: 03.10.2026. Назначение: `references/BUILDER-REDESIGN-BRIEF.md`.
Статус: локальная реализация и разовые browser checks выполнены; визуальная приёмка MAIN ожидается. Production не экспортирован и не опубликован. Commit/push и отправки сообщений не выполнялись. Зависимости не устанавливались, lockfile сохранён.

## Превью и материалы

- http://127.0.0.1:4176/ — сервер Vite preview собранного dist, без watch. Оставлен для просмотра владельцем.
- Повторная сборка: `npm run build --prefix prototypes/nimbus-preview`.
- Повторный запуск: `npm run preview --prefix prototypes/nimbus-preview`.
- Screenshots: `F:/testlanding/.preview-checks/redesign/live-desktop.png`, `live-mobile.png` — обычный motion-режим.
- Полные страницы: `final-full-1440.png`, `final-full-390.png` в том же каталоге.
- Секции: `final-hero/tasks/project/process/contact-1440.png` и `-390.png`.
- Запись: `motion-preview.gif` — 70 кадров, около 20 секунд; Hero, ручные примеры, две ветви кейса, этапы. Интервалы кадров записаны при захвате. GIF иллюстрирует последовательности, не служит замером FPS.
- Для стабильных полных/секционных screenshots использован reduced motion; у отдельных секционных кадров скрыта только fixed шапка и skip-link, чтобы они не перекрывали длинный снимок. Сама страница их сохраняет.

## Выполненные проходы

A. До новой анимации собраны четыре визуальные области и просмотрены static screenshots 1440/390. Проверены все девять размеров. Сохранены фиксированная полупрозрачная шапка, прогресс, якоря, Manrope, форма и настоящий портрет.

B. Hero содержит шесть сценариев, задача→результат и тихую сферу только в правой части Hero. В задачах один workspace, десять компактных переключателей и одна сцена. Контроллеры читают утверждённый JSON. Циклы 6 и 11 секунд идут и на mobile. Hover/focus удерживают advance, после выхода начинается новый полный интервал. Ручной выбор/повтор сохраняет пользовательскую паузу до явного продолжения. Кнопка паузы завершает декоративный перенос и оставляет полный результат.

C. Кейс использует HP EliteBook 840 G7, Intel Core i5-10210U, 16 GB, 512 GB, 14 Zoll, артикул 1. Вход и два результата соединены по фактическим rects. Полные материалы раскрываются нативным details/summary; Escape закрывает и возвращает фокус. В финале A три компактных этапа, одна последовательность мини-сцен, outcome/условия и контакт внутри общей поверхности. Focus поля отменяет декорацию.

D. Сборка и проверки ниже выполнены. Исторические неиспользуемые стили review.css и прежний demos.js удалены, параллельная старая сцена не запускается.

## Проверки и результаты

- Build: без предупреждений. HTML 42.45 kB / gzip 8.27; CSS 31.39 / 7.32; основной JS 161.33 / 58.75. Three.js остаётся в отдельных ленивых chunks; initial reduced motion их не запрашивает.
- Размеры: 1440×900, 1280×720, 1024×900, 768×1024, 430×900, 390×844, 375×812, 360×800, 320×800 — без горизонтального скролла, четыре visual sections и все пять anchors.
- Точное содержимое source/result всех 6 Hero и 10 tasks сверено с JSON. Немецкий полный текст сверён с case-listing-de.txt, артикул в таблице равен 1. В кейсе нет ни одного img и подставных фото.
- Геометрия workspace постоянна при переключении всех десяти примеров на каждой ширине. Высоты desktop 587/587/585 px; 768 —707; mobile 984/1038/1038/1105/1171. Высота учитывает самый длинный утверждённый пример, без обрезки текста.
- Enter/Space, видимый focus, ручной выбор, десять быстрых повторов, единственный видимый active scenario, resize во время прохода, reduced toggle и отсутствие оставшихся transient nodes — PASS.
- Hover hold, полный новый интервал после ухода, ручная пауза после возвращения, мобильная автосмена обеих областей, touch без зависшего hover — PASS.
- Обратимое расхождение H1 проверено по transform coordinates; возврат к исходным нулевым смещениям. На mobile/reduced mapping не создаётся.
- Проверены no-JS, `?webgl=off`, отказ загрузки lazy chunk: содержимое и личный Telegram доступны. При initial reduced GPU chunks не загружаются; включение motion позднее корректно создаёт поле.
- Счётчик WebGL frames прекращает расти при полностью ушедшем Hero. Mobile DPR=1; ограничение обновлений 30 сохранено. Один GSAP ticker, Lenis autoRaf:false/lerp .085 и wheel-настройки сохранены.
- Hidden/BFCache: проверена реакция обработчиков через симуляцию visibilitychange и persisted pagehide/pageshow. Поле при BFCache не уничтожается, после возврата работает, userPaused сохраняется. Это не доказательство поведения реального Safari BFCache или фонового режима физического телефона.
- Computed контраст выбранных вторичных текстов/подписей/поля/активного selector: 6.07–9.93:1; порог 4.5 выдержан. Границы native controls дополнительно усилены; focus mint outline сохранён.
- Пустой и заполненный кириллицей draft URL дословно соответствуют двум шаблонам SPEC и ведут в @tigran_ai. Реальная отправка не выполнялась.
- Ошибок/предупреждений консоли при итоговом прогоне нет.

Доказательства: `static-results.json`, `interactions.json`, `lifecycle.json`, `final-gates.json`, `final-checks.json`, `preserved-before.json`, `preserved-after.json` в `.preview-checks/redesign/`.

## Изменённые исходники

- `prototypes/nimbus-preview/package.json`: существующий build теперь сначала генерирует HTML из локальных шаблонов/данных; dependencies неизменны.
- `scripts/render-page.mjs`, `scripts/shell.html`, `scripts/contact.html`: сборка разметки с сохранённой оболочкой/контактным copy.
- `src/data/examples.json`: точный снимок APPROVED JSON; `case.json`: только необходимые публичные данные без частных путей источников; `case-listing-de.txt`: утверждённый немецкий текст.
- `src/main.js`: подключение контроллеров к существующему independent UI/lazy WebGL/lifecycle.
- `src/motion/carousels.js`: Hero/tasks state, интервалы, pause/hold, очистка, workspace glow.
- `src/motion/supporting.js`: ветви кейса, inline details и этапы.
- `src/motion/choreography.js`: один ticker, Lenis, входы, обратимый H1, visibility.
- `src/webgl/scene.js`: размеры renderer по ограниченной Hero-области, pointer только справа, меньшая яркость; seeded geometry/shaders сохранены.
- `src/styles/tokens.css`, `components.css`, `sections.css`: актуальная система и mobile-композиции.
- Удалены больше не подключаемые `src/motion/demos.js`, `src/styles/review.css`.
- `REDESIGN-REPORT.md`: этот отчёт.

## Generated output — отдельно

- `prototypes/nimbus-preview/index.html`: сгенерированная разметка прототипа.
- `prototypes/nimbus-preview/dist/`: локальная сборка, игнорируется Git.
- `.preview-checks/redesign/`: проверочные scripts, JSON, screenshots, кадры и GIF; игнорируется Git.
- Root index.html/styles.css/script.js, SPEC и package-lock совпадают с хэшами до прохода. Корневые assets и production export не менялись. Ранее существовавшие изменения документов MAIN сохранены.

## OPEN

1. Исходные фотографии HP и подтверждение их связи с артикулом 1, разрешения на клиентские материалы отсутствуют. В показанной схеме только текстовые данные и Advertisement.txt; никаких generated/чужих ноутбуков. deploymentReady материала остаётся false.
2. Немецкий текст — одобренная редакция для лендинга, не оригинальный bot output. Это указано в раскрываемых материалах. Устаревший пункт про принятие немецкого текста в `case-data.json.open` не отменяет более поздние APPROVED SPEC/copyStatus.
3. Использован существующий WebP настоящего Avatar.png с оранжевым фоном. Candidate soft-background не принят автоматически, лицо не менялось.
4. Нативное заполнение Telegram composer на разных clients, физические iPhone/Android, Safari, аппаратный GPU/FPS и реальный OS-background/BFCache не проверены. Гарантия 60 fps не заявляется.
5. Candidate Telegram caption не применена: действующая подпись сохранена дословно.
6. Дальнейшая интеграция/публикация требует следующего отдельного назначения MAIN после визуального просмотра этого результата.

Финальный контроль: переход последнего Hero/tasks на первый, Space для продолжения, Enter/Escape в mobile menu, якорь и fixed header/progress — PASS. Исправлен перехват pointer events декоративной областью стрелки; повторная проверка прошла.


