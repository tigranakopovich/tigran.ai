# Tigran AI — прототип

Статус: локальный прототип для просмотра, без публикации. Дата: 02.10.2026.

## Просмотр и сборка

[Открыть локально](http://127.0.0.1:4176/). Сейчас запущен Vite preview готовой production-сборки; watch отсутствует.

Из F:\testlanding:

```powershell
npm run build --prefix prototypes/nimbus-preview
npm run preview --prefix prototypes/nimbus-preview
```

Выходной каталог: `prototypes/nimbus-preview/dist/`. Остановить preview можно Ctrl+C в его терминале. Содержимое dist и node_modules игнорируется Git. Push / deployment не выполнялись.

## Реализация

Отдельные пять секций: Hero → задачи → проект → этапы → личный контакт. Утверждённые маркетинговые тексты, факты одного кейса и контакт сохранены. Поле — художественный фон; интерфейсы не изображают собственную универсальную платформу.

Тёмная палитра #080E0B / #15231D, светлые заголовки, голубой процесс, зелёный результат. Крупные трёхстрочные заголовки, самостоятельные mobile-композиции, содержательные glass-демонстрации. Последовательность этапы → контакт компактная. Поле не перекрывает HTML и не блокирует CTA.

WebGL: Three.Points и собственные vertex/fragment shaders. Seed 1042026; 19 000 точек desktop, 7 000 mobile при инициализации. 78% оболочка, остальные объём; неровный силуэт, глубина, rim и верхний боковой свет. Точки серебристые, часть имеет холодный отблеск. Связей между точками нет. Инициализированные позиции не меняются; движение через shader uniforms. DPR ограничен 1.5.

Общий GSAP ticker обслуживает Lenis и WebGL, Lenis синхронизирован с ScrollTrigger. Скролл задаёт только целевые параметры поля; далее численные значения плавно интерполируются. В скрытой вкладке render прекращается. Reduced motion отключает Lenis/ScrollTrigger и оставляет статичный кадр. Pointer repulsion / слабый наклон отключены для coarse pointer. Pagehide с persisted=true приостанавливает работу без disposal; pageshow возобновляет её. При обычном уходе освобождаются geometry/material/renderer и управляющие обработчики.

Hero: короткое неблокирующее интро, маски строк, световой вход, два декоративных чипа; максимум два цикла с паузой. Слабые следы событий содержат слово «ПРИМЕР» и находятся в декоративной зоне. Основные тексты присутствуют в HTML, CTA доступны сразу. Без JS и reduced motion всё статично.

Задачи: только явный запуск, один активный task, повтор, переносы по реальным source/target rect, завершённый результат остаётся. Документ переносит клиента, дату и услугу одного иллюстративного примера. При смене, resize, уходе из viewport, focus контакта, hidden/reduced-motion временные элементы удаляются.

Кейс: один согласованный иллюстративный ноутбук 16 GB RAM / 512 GB SSD, независимые материалы и Sheets, однократное мягкое проявление. SVG рисунки прямо обозначены как иллюстративная схема. Клиентские исходники не использовались.

Этапы: все описания видны; явные кнопки и replay. Во внедрении передаётся пример Алексей / Консультация через Telegram → n8n → AI → Sheets, а не только акцентируются логотипы. Контейнер сохраняет размеры при выборе.

Контакт: оригинальный портрет с оранжевым фоном, одно необязательное поле, утверждённые draft URL для пустого и заполненного ответа. Портрет / поле / CTA не анимируются. Реальные сообщения не отправлялись.

## Зависимости и шрифты

Пакеты были отсутствующими. Владелец отдельно разрешил установку только для этого прототипа. Установлены: Vite 8.3.2, Three.js 0.186.1, GSAP 3.15.0, Lenis 1.3.26. Версии зафиксированы package-lock.json; root-инфраструктура не менялась. npm после установки сообщил 0 vulnerabilities.

Unbounded 900 и IBM Plex Mono не найдены. Display-fallback — реальный локальный Manrope 800; текст — Manrope; mono — системный Consolas / Courier New. font-synthesis:none. Для точной типографики задания нужны лицензированные WOFF2 Unbounded 900 с кириллицей и IBM Plex Mono. Manrope и его OFL скопированы в public/fonts.

Production build успешен, предупреждений в финальной сборке нет. WebGL загружается отдельным модулем, Three core и renderer разделены. Размеры JS gzip: основной 54.12 kB, scene 2.69 kB, core 46.69 kB, renderer 84.73 kB. Это размеры файлов, не оценка FPS.

## Screenshots и запись

- [Desktop 1440×900](F:/testlanding/.preview-checks/nimbus/desktop-1440.png)
- [Desktop: вся страница](F:/testlanding/.preview-checks/nimbus/full-1440.png)
- [Mobile 390×844](F:/testlanding/.preview-checks/nimbus/desktop-390.png)
- [Mobile: вся страница](F:/testlanding/.preview-checks/nimbus/full-390.png)
- [Задачи desktop](F:/testlanding/.preview-checks/nimbus/tasks-1440.png)
- [Кейс desktop](F:/testlanding/.preview-checks/nimbus/project-1440.png)
- [Этапы mobile](F:/testlanding/.preview-checks/nimbus/process-390.png)
- [Контакт mobile](F:/testlanding/.preview-checks/nimbus/contact-390.png)
- [Запись движения GIF](F:/testlanding/.preview-checks/nimbus/motion-demo.gif)
- [Mobile fallback без WebGL](F:/testlanding/.preview-checks/nimbus/fallback-mobile.png)

GIF — 59 снимков Chrome, ~15 секунд монтажного воспроизведения при 250 ms/кадр. Показывает Hero, заявку, документ, внедрение. Снято с программным WebGL; запись не является замером производительности. Для section crops fixed header/skip-link временно скрывались только в инструменте screenshot, чтобы они не перекрывали снимок длинной секции. В самом прототипе доступны header и keyboard skip-link.

## Browser checks

Реальный Chrome через Playwright, production build. WebGL в проверках использовал программный SwiftShader (`--enable-unsafe-swiftshader`); нативная производительность GPU не измерялась.

Проверены 1440×900, 1280×720, 768×1024, 390×844, 375×812, 320×844:

- Пять секций, точный H1 и основные абзацы сверены со SPEC.
- Manrope с кириллицей загружен; overflow и обрезанного содержимого нет.
- Ноутбуки только в кейсе.
- Быстрая прокрутка вниз/обратно и resize — без ошибки или потери поля.
- Enter / Space запускают demos и выбирают этапы. Focus 2 px видим; меню открывается Enter, Escape закрывает с возвратом focus.
- Все три task demos завершаются. Проверены 10 быстрых повторов, смена примера и resize во время переноса: ≤1 активного task, transient nodes после отмены/финиша =0.
- Высота work-canvas на desktop 286 px при всех пяти проверенных переключениях, на mobile 520 px при всех трёх выборах.
- Focus контакта отменяет demos. Пустой шаблон и заполненный кириллический ответ «Бухгалтерские услуги & продажи» дают точный text в личном t.me URL.
- При reduced motion поле не создаёт новых кадров, Lenis выключен, результаты видимы. Переключение обратно восстанавливает режим движения.
- Touch-эмуляция 390 px: 7 000 частиц; при deviceScaleFactor=3 реальный renderer DPR=1.5.
- Отмена в hidden и pause/resume pagehide/pageshow persisted проверены **симуляцией событий**. Реальный OS background / реальный BFCache во всех браузерах этим не подтверждены.
- `?webgl=off` включает CSS fallback; без JS видны пять секций и прямой личный Telegram.
- Console/page errors и warnings =0.

Evidence: [static-checks.json](F:/testlanding/.preview-checks/nimbus/static-checks.json), [motion-checks.json](F:/testlanding/.preview-checks/nimbus/motion-checks.json), [неизменность production/SPEC](F:/testlanding/.preview-checks/nimbus/preserved-after.json).

## Изменённые файлы

Все новые файлы только в `prototypes/nimbus-preview/`:

- index.html
- package.json, package-lock.json, vite.config.js
- src/main.js, src/form.js
- src/webgl/scene.js, src/webgl/shaders.js
- src/motion/choreography.js, src/motion/demos.js
- src/styles/tokens.css, base.css, components.css, sections.css
- public/fonts/Manrope-Cyrillic.woff2, Manrope-Latin.woff2, OFL.txt
- public/images/tigran.webp, public/favicon.svg
- README.md

Временные browser scripts, screenshots и запись лежат в игнорируемом `.preview-checks/nimbus/`. Существовавшие изменения других документов не трогались. Хэши index.html/styles.css/script.js/SPEC.md/root preview-server.cjs совпали до/после работы. Никакого commit, push, deployment этого прохода.

## Ограничения / OPEN

Unbounded 900 / IBM Plex Mono нужны для точной версии шрифтов. Физические iOS/Android, Safari, аппаратный GPU, реальный BFCache и OS background не проверены. Нативное получение draft в Telegram composer остаётся OPEN: проверенные URL не доказывают его работу. Безопасный пакет материалов кейса отсутствует, поэтому схема иллюстративная. Визуальная приёмка владельцем / MAIN ещё не выполнена.

Для интеграции использованы официальные описания [Lenis + GSAP ticker](https://github.com/darkroomengineering/lenis), [GSAP ticker](https://gsap.com/docs/v3/GSAP/gsap.ticker/), [Three.js](https://threejs.org/docs/), [Vite production build](https://vite.dev/guide/build) и типы code splitting установленного Rolldown.

## Публикация основной страницы — 2 октября 2026

По прямому разрешению владельца Tigran AI подготовлен для основного адреса Vercel. Исходники остаются в этом каталоге; production HTML, assets и images лежат в корне репозитория. Для обновления: `npm run build --prefix prototypes/nimbus-preview`, затем `node prototypes/nimbus-preview/publish-root.cjs`, commit и push в main. Vercel автоматически публикует корневой статичный сайт. Публикуемый HTML имеет production title и разрешённую индексацию; локальный прототип сохраняет noindex.

Разовая проверка production-файлов Chrome: 1440 и 390 px, пять секций, отсутствие горизонтального скролла, загрузка Manrope, Telegram draft URL и отсутствие ошибок консоли. Ограничения устройств и Telegram composer из предыдущего отчёта сохраняются.


## Актуальная публикация — 11 октября 2026

Vercel обслуживает только `site/` по `vercel.json`. Историческая инструкция выше про корневой export больше не применяется. Для текущей версии: `npm run build --prefix prototypes/nimbus-preview`, затем `node scripts/export-site.cjs`, проверка `site/`, commit и push в main. `publish-root.cjs` для текущего deployment не использовать. Экспорт включает только runtime assets, шрифты/лицензию, обработанный портрет и Earth fallback; исходники, материалы, `.env` и отчёты не публикуются. Production title отличается от локального прототипа.
