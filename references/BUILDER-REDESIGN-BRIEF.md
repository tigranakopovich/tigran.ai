# Tigran AI — единое задание Builder на редизайн

Дата: 03.10.2026. Подготовил MAIN.
READINESS: READY FOR LOCAL IMPLEMENTATION WHEN OWNER SENDS THIS BRIEF TO BUILDER. Тексты и motion утверждены 03.10.2026. MAIN в этом чате меняет только документы.

## 1. Назначение

Доработать существующий работающий лендинг на Nimbus-базе, сохраняя функциональность и оптимизацию. Не создавать сайт заново и не переносить light v2/Attio. Четыре визуальные области: Hero → единая панель задач → реальный кейс → общий финал A (этапы + контакт).

Назначение: локальный редизайн действующего лендинга по утверждённым текстам, референсам и motion. Отсутствие оригинальных фото HP не блокирует работу: в локальной версии использовать реальные подтверждённые данные, утверждённый немецкий текст и честное текстовое представление материалов. Не выдавать нарисованное фото или чужой ноутбук за оригинальный. Публикация/commit/push не назначены.

## 2. Что прочитать и посмотреть

Обязательны только:
1. SPEC.md — утверждённые факты, тексты, статусы.
2. references/VISUAL-SYSTEM.md — текущая геометрия, motion, accessibility, engineering invariants.
3. references/LANDING-EXACT-COPY.json и .md — завершённый новый пакет sample copy со статусом APPROVED.
4. references/materials/publish/case-data.json, case-listing-de.txt и references/materials/CASE-MATERIALS-REVIEW.md — проверенные данные/ограничения материалов.
5. Четыре картинки references/hero-dark-motion-v1.png, tasks-unified-v1.png, case-dark-v1.png, final-unified-a.png.

Поддерживающие ранние handoffs — история обсуждения. Не переносить из них конкурирующие конструкции поверх актуального SPEC/VISUAL. Не читать весь репозиторий. После этой подготовки читать только необходимые модули Nimbus.

## 3. Сохранить рабочую основу

- Исходники prototypes/nimbus-preview/, действующий Vite/vanilla/Three/GSAP/Lenis и lockfile. Без новых dependencies, upgrades, frameworks или повторной установки.
- Fixed немного прозрачная шапка выше содержимого, навигация/якоря, mobile menu, верхний scroll-progress.
- Текущие настройки wheel/Lenis: владелец отложил их изменение.
- Локальный Manrope, отложенный optional WebGL import, форма/меню независимо от декоративного движка.
- Один GSAP ticker, seeded immutable geometry, shader uniforms, desktop DPR≤1.5/mobile≤1, mobile render cap30, observer visibility, render stopped вне Hero/hidden, CSS fallback, no-JS, reduced motion и BFCache lifecycle.
- Draft URL именно в личный @tigran_ai, оба шаблона Primary Conversion. Сообщение отправляет посетитель, не приложение.
- Подтверждённые основной copy и факты кейса. Никаких новых услуг, отзывов, цен, экономии времени, обещания универсальных интеграций.
- Готовая сборочная/экспортная структура. Generated root assets не править как исходники.

## 4. Hero — заменить композицию и полезную демонстрацию

Точный reference и параметры VISUAL. Постоянные три строки H1 слева, третья mint; справа задача→результат, шесть сценариев, pause. Поле тише и позади правой части. Старые chips absorption, event traces и блокирующее intro удалить, а не оставить параллельно.

Утверждённый copy брать из JSON. Панели одинакового размера, источник соответствует результату. Небольшая обработка/заполнение, затем пауза чтения. Стабильная схема доступна без JS. Hero непрерывно меняет шесть примеров примерно каждые 6 секунд на desktop и mobile; пауза входит в этот цикл. Reduced motion — ручной статичный выбор. Полные правила удержания и пользовательской паузы — VISUAL-SYSTEM, раздел 9.

Desktop заголовок слегка расходится при уходе Hero и точно возвращается при scroll вверх; mobile/reduced выключить. Description/CTA стабильны. Кнопки деликатно поднимаются, без magnet/cursor-follow света на Hero CTA.

## 5. Задачи — один workspace вместо трёх длинных блоков

Один heading/intro, общий panel с десятью компактными selectors и одной динамической сценой. Слева explanation, справа source→result, снизу index/progress/previous/pause/next. На mobile компактный выбор, не десять больших cards перед контентом.

APPROVED JSON — единственный источник demo copy. Показать содержательный черновик текста/документа/таблицы, не пустые серые линии. Автосмена после однократного появления: непрерывный круг 10–12 секунд на пример с паузой для чтения на desktop и mobile. Ручной выбор удерживается до явного продолжения; пользовательская пауза не сбрасывается.

Одно слабое общее pointer glow по всему workspace, без прямоугольных стыков в nested scene. Не создавать второй RAF/animated blur. На coarse/reduced pointer-follow выключен.

## 6. Подтверждённый кейс — материалы и доступные previews

Copy слева, Telegram-вход справа разветвляется в материалы объявления и отдельную строку Sheets. В конце немецкого текста реальный Artikelnummer. Основной copy SPEC неизменён.

Владелец разрешил MAIN подготовить текст под ноутбук: HP EliteBook840G7, данные ID1 из реальной таблицы. Немецкий текст authored для лендинга, не оригинальный бот output. Case-data.json явно указывает реконструкцию. Не смешивать MSI/3, Lenovo/6 и HP/1; не выдавать это за единый original run.

Пока photoFiles=[] и deploymentReady=false: локальный прототип может показать честно подписанную схему с пустым техническим slot для материала в отчёте; не публикуемый fake laptop photo. Не копировать generated laptop из reference и не обещать «реальные материалы» без оригиналов. Если MAIN позже назначит реальные фото — использовать только проверенный набор.

Один entry проход по двум связям. Preview доступен hover/focus accent и явной кнопкой «Материалы кейса»/touch: компактная inline details-area, не полноэкранная галерея. Показать German full text, source reconstruction, файлы и табличные данные. Hover не открывает внешний Telegram. Никаких download/copy/zoom/video/автопубликации/складских статусов.

Кнопки «Материалы кейса» и «Повторить этапы» включены MAIN в назначенный локальный scope. Не добавлять другие действия вне brief.

## 7. Финал A — единый компактный блок

Этапы горизонтально сверху, outcome/условия, divider, контакт ниже. Большие прежние этапные cards + work canvas заменить небольшими встроенными illustrations; descriptions всех трёх видны.

«Решение под вашу задачу» вместо обязательной technical chain. Сопровождение — возможное продолжение, shield-check вместо группы людей. Мини-движение: исходники→карта; input→process→result; проверка→исправление. В любой момент один sequence; contact focus прекращает декорацию. Нативный control «Повторить этапы» при назначении microcopy, не hover-only interaction.

Контакт заметнее: воздух после divider, более крупный heading, high readable contrast, higher broadfield, CTA ниже. Фото отдельное, не вырезать лицо из mockup: принятое исходное/soft-background asset. Сохранить личность, одежду и реальное лицо.

На reference стоит candidatecaption. В реализации до отдельного решения сохранить утверждённую «Подготовим первое сообщение. Отправите его сами в Telegram.» Нельзя обещать composer на всех clients без проверки. No new name/email/taskfields, questionnaire, fake successscreen.

## 8. Общая анимация и mobile

Однократные спокойные entrances transform/opacity по VISUAL, не scroll pin, не artificial viewport height. Контент сразу доступен, quick scroll/anchor/restore не оставляют hiddenblock. Сначала appearance, потом useful short sequence. На mobile сокращённые расстояния, reduced motion полная статика.

Все selectors и previews доступны native keyboard/touch. Сохранять paused user intent. Selection/resize/hidden/offscreen/reduced cancel old timeline и временные узлы; нет stale callbacks и catch-up. Ghost data decorative aria-hidden, смысл остаётся HTML.

Без page-wide живой сферы, звукa, heavy blur или continuously floating контакта. Сохранить общую палитру/типографику/границы и ритм всех четырёх областей.

## 9. Ограниченные implementation passes после назначения MAIN

A. Статичная структура и copy: собрать все области по принятому пакету, проверить screenshots desktop/mobile до motion.
B. Hero и tasks motion/controller/glow; проверить понятность входа/результата, паузу и lifecycle.
C. Кейс и финал: назначенные материалы, accessible preview, entrances/mini-scenes, неизменность contact.
D. Итоговая разовая проверка и отчёт. Не начинать непрерывный watch/auto-audit. Не публиковать.

Не нужны четыре разных сайта или новые чаты. Это четыре ограниченных прохода в текущем Builder, один source of truth.

## 10. Разовая проверка

Запрос MAIN в данном назначаемом brief: build и browser checks нужны для верификации после реализации. Sizes1440×900/1280×720/1024/768×1024/430/390×844/375/360/320, static fullpage/sections и short motioncapture.

Проверить:
- точные тексты, 4 visual области, все anchors/header/progress/mobile menu;
- readability/contrast, no overflow, корректные реальные материалы/подписи;
- Tab/Enter/Space/Escape, pause/manual hold, quick10switches/replays;
- resize воflight, hidden/offscreen/reduced toggle, no leakedtransients, one activeexample;
- inverse H1 scroll, touch не зависает hover;
- noJS/WebGLoff/importfailure, lazychunk не грузится initial reduced; frame count stops outsideHero;
- empty/filled Cyrillic draft URL. Никаких realmessages.
- отсутствие console errors; build warnings разобрать, не скрыть;
- источник photos/артикул одинаков, authoredGerman не назван оригинальным.

Headless/softwareGPU не доказывает60fps или работуSafari/iPhone. Невыполненные physical checks и composerOPEN перечислить. Не запускать лишние тесты unrelatedпроектов.

## 11. Назначенный scope и ограничения

APPROVED владельцем 03.10.2026: точные тексты примеров и немецкая редакция HP, шесть примеров Hero по ≈6s, десять примеров задач по 10–12s; непрерывный круг на desktop/mobile, временное удержание hover/focus, постоянная пауза после ручного выбора до явного продолжения. Подписи управления из JSON и «Материалы кейса»/«Повторить этапы» включены в локальный brief.

OPEN не блокируют локальный редизайн, но должны попасть в отчёт:
- Оригинальные фото HP и их подтверждённая связь с артикулом 1 отсутствуют. Не подменять их generated картинками или фотографиями другого заказа. Показывать текст, файлы и таблицу; не оставлять сломанные img или выдуманную галерею.
- Для портрета использовать настоящий Avatar.png. Отдельная смягчённая производная — кандидат, без самостоятельной замены лица; при сомнении оставить оригинал и согласовать визуальный результат.
- Telegram candidatecaption не утверждена: сохранить Primary Conversion дословно и проверить текущий draft flow без отправки сообщений. При технической невозможности доложить, не придумывать другую воронку.
- Публикация, commit, push и установка зависимостей не входят в поручение.

Данные resultData у дополнительных Hero — те же утверждённые структуры второй секции, компактно представленные внутри стабильной панели. Не копировать в Hero длинные описания второй секции и не менять её тексты.

## 12. Отчёт Builder

Changed source files, build outputchanges отдельно, ссылка local preview, screenshots/motioncapture, выполненные/невыполненные проверки, OPEN. Указать что production не опубликован и реальные сообщения не отправлялись. Попросить MAIN о следующем интеграционном назначении после конкретного проверяемого результата.

## Готовый prompt для отправки Builder

Ты — Builder Tigran AI. MAIN назначает локальный редизайн существующего Nimbus-лендинга по references/BUILDER-REDESIGN-BRIEF.md, SPEC.md и references/VISUAL-SYSTEM.md. Exact copy в references/LANDING-EXACT-COPY.json APPROVED; немецкий текст HP/артикул 1 APPROVED. Hero: шесть примеров, постоянная смена около 6 секунд на пример с паузой внутри цикла. Задачи: десять примеров, постоянная смена раз в 10–12 секунд. На телефоне оба цикла тоже автоматические с доступной паузой; reduced motion статичный ручной выбор. Сохрани фиксированную полупрозрачную шапку, прогресс, форму, зависимости и оптимизацию. Доработай четыре области по актуальным референсам из prototypes/nimbus-preview/, без нового сайта. Оригинальных фото HP пока нет: не выдумывай их, используй текстовую реконструкцию подтверждённых материалов и отметь ограничение. Портрет — настоящий Avatar.png. Выполни назначенные проходы, разовые build/browser checks; покажи локальный результат, screenshots/запись, список изменений и OPEN. Код реализации меняй в своём Builder-проходе, но не публикуй, не делай commit/push, не устанавливай зависимости и не отправляй реальные сообщения.


## Приоритет ритма после согласования

Ранние указания «три Hero», «один круг desktop» и «manual mobile» отменены. Применять раздел 9 актуального VISUAL-SYSTEM и motion из JSON. Референсы показывают композицию, количество вкладок и новые времена определяют актуальные документы.
