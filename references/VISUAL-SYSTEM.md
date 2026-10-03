# Tigran AI — Supporting Visual Specification

Обновлено: 03.10.2026. APPROVED DIRECTION — общий тёмный редизайн на текущей Nimbus-базе; значения являются стартовыми настройками. Exact copy и режимы смены APPROVED 03.10.2026; недостающие фото и Telegram composer остаются OPEN. Этот документ не разрешает самостоятельно начать implementation/deployment.

## 0. Приоритет, references и сохранение основы

SPEC.md — source of truth. При конфликте приоритет SPEC. Builder использует этот документ только когда MAIN включает его в отдельный brief. Одно назначение: references/BUILDER-REDESIGN-BRIEF.md, после снятия его gates. Old v2/Attio, initial Nimbus prompt и исторические section notes не являются альтернативными заданиями. Архив предыдущей SPEC/VISUAL версии: references/archive/2026-10-03-before-sync/.

Активные картинки:
- Hero: hero-dark-motion-v1.png.
- Задачи: tasks-unified-v1.png.
- Кейс: case-dark-v1.png.
- Финал A: final-unified-a.png, та же версия final-unified-a-v2.png.

Смысловые пять блоков представлены четырьмя визуальными областями: Hero → задачи → кейс → этапы и контакт. Подписи/image-generated фото не брать как final assets/copy. База исходников prototypes/nimbus-preview/, текущий static root является результатом сборки/экспорта, не создавать в нём вторую независимую реализацию.

Сохранить fixed слегка прозрачную шапку над контентом, верхний прогресс scroll, brand/navigation/Telegram, mobile menu/Escape/focus, anchors. Header z-index выше scenes/glow; content scroll-margin соответствует фактической высоте header. Никакого live page-wide sphere; вне Hero GPU stopped. Сохранить Lenis торможение и touch; при воспроизводимом чрезмерном wheel-движении отдельно уменьшить desktop-дистанцию, locked dependencies, native keyboard, form handlers и оба templates из SPEC.

## 1. Единая система

Фон #2D322F; surfaces #38443F; ink #E5EEE8; readable secondary #BFCBC3; placeholder #B5C3BA; mint #84D5A5; dark CTA text #0B2116; process accent #9EB7CE только где помогает смыслу. Контраст проверяется по computed surfaces, не объявлять достаточным из-за hex на бумаге. Обычный текст ≥4.5:1; focus и UI границы различимы. Не наследовать --line:transparent для panels, где нужны контуры.

Manrope local Cyrillic/Latin 400–800, font-display:swap, font-synthesis:none. Display800, body400–500. Mono existing Consolas/system только для меток/данных по необходимости, не для всего copy. Не устанавливать новые fonts/packages.

Content max около1400px, широкие gutters48–72px, tablet24–32px, mobile20–22px (320px:16–18). H1 ориентир76–96px на wide desktop, адаптивное снижение; H2 section40–52px, body16–18px. Без принудительной высоты viewport для всех секций; только Hero на высоком desktop получает отдельный полный первый экран по новому назначению. Panel radius20–28px, buttons12–14px, field12–14px. Поверхности мягкие, без яркого стекла/3D cubes/macOS chrome. Существующие point pattern не размножать.

Hover button y−2…−3px/160–220ms, no size shifts, pressed return. Focus отчётливый; hit target≥44px. На touch hover effects не зависают. Декоративные иконки/панели не fake buttons. Поле16px minimum, сохраняет clear focus.

## 2. Hero

Desktop left copy/right demo. Left около56%, right44%, gap40–56px; соблюдать доступную ширину, не переполнять max-width суммой columns+gap. Три H1 строки, третья mint. Основной текст/CTA сразу видны. Earlier removed eyebrow/служебные chip labels не возвращать.

Справа: две стабильные панели задача → результат и короткая связь только в промежутке. Шесть вкладок: Заявки / Документы / Отчёты / Статусы / Контент / Письма; компактная кнопка паузы. Вкладки разрешено расположить в два ряда без уменьшения читаемости. Геометрия панелей постоянна. Exact APPROVED copy: LANDING-EXACT-COPY.json.hero; дополнительные resultData выводить содержательным мини-интерфейсом.

APPROVED Hero cycle ≈6s: ввод исходного сообщения 1,5–2s → сигнал переноса около 0,7s → заполнение значений результата около 1,5s → чтение → плавная смена. Шесть вкладок, включая повтор активной. Без отдельного replay, счётчика и previous/next. Названия полей постоянно видны; длинный текст раскрывается строками/смысловыми фрагментами, не быстрой печатью букв. Полный смысловой текст остаётся в HTML.

State: selected, phase, userPaused, interactionHeld, visible, hidden, reduced, completedCycles. User pause сохраняется. Hover/focus hold допускает завершить текущий короткий проход, но запрещает advance. Manual tab отменяет old timeline и оставляет выбор до явного continue. Неисполненные callbacks отменяются runId; no catch-up после hidden/offscreen. Accessible selector native buttons aria-pressed либо корректные tabs; не смешивать паттерны.

Сфера: существующий seeded Three.Points/shader позади правых панелей. Видимый объём Nimbus: серебристая подсветка края, прозрачный центр, глубина, мягкий боковой свет. Центр около середины двух панелей, диаметр ориентир 1.1–1.25 их ширины. Разрешена совместная настройка CSS opacity/uExposure/rim; прежний запрет изменять яркость отменён. Без увеличения particle count, новых эффектов или линий между точками. Fine pointer только справа, touch/reduced без реакции, вне Hero рендер остановлен.

H1 scroll divergence desktop: строка1 до20–28px left, строка2 до20–28px right, строка3 до10–16px down; один обратимый scrub mapping без pin/rotation/scale. Description/CTA не двигаются. Mobile/reduced off; narrow desktop smaller amplitude toavoid clipping.

## 3. Задачи — один workspace

Секция heading/intro, затем один общий rounded workspace. Desktop selector10 items в два ряда; left explanation≈28%, right source→result≈72%. Внизу тонкая дорожка, «Повторить пример» и одна небольшая кнопка остановки/продолжения. Без счётчика и previous/next; удалить «Иллюстративный пример». Disclaimer из SPEC сохранён. Mobile: компактные вкладки, отступы и подписи каналов без крупных дополнительных карточек; не уменьшать читаемый текст, не вводить внутреннюю прокрутку, обрезку или огромный пустой резерв.

Exact data LANDING-EXACT-COPY.json.tasks — APPROVED package. Никаких ten stacked cards. Пример контента имеет настоящее осмысленное содержание, source/result согласованы, никаких giant skeleton lines. Platforms по конкретному scenario, не universal badges. YouTube video metadata/план; Facebook только draft-content до access verification.

APPROVED задачи: круг на desktop/mobile, около 15s на пример: исходные данные до 4s → перенос около 1s → заполнение до 5s → чтение около 5s. Короткие данные заполняются быстрее, освобождённое время добавляется к чтению. Значения таблиц, сообщений и документов раскрываются последовательно. Только одна активная timeline. Дорожка отражает весь проход, в том числе ручной, сбрасывается при выборе/повторе и остаётся полной в конце. Ручной выбор удерживает итог до продолжения; hover/focus запрещает advance, но не завершение прохода.

Glow: один absolute pseudo-overlay на наружном workspace, pointer-events:none, большой radial-gradient с мягким transparent edge. Inner source/result не имеют собственных competing pointer lights. Clip только по наружному radius; не обрезать в middle rectangle. Rect measurement на enter/resize/scroll, не continuous layout reads; fine pointer event drives variables/shared animation scheduling. Без expensive animated blur и отдельного постоянногоRAF. Touch/reduced static.

## 4. Кейс

Copy≈43% /scene57%. SourceTelegram→independentmaterials+Sheets. Реальный артикул одинаков в финальном немецком тексте и data-row. Exact main copy SPEC. Case-data.json — editorial reconstruction HP840G7/article1 fromreviewedsheet; sourcephotos unresolved. No generated photo-real mockup imported asclient evidence. Case-listing-de.txt authoredGerman, notoriginalbotoutput; detail caption явно указывает это.

Scene original output complete fromfirstpaint. Один entrysignal splits to2 branches, endpoints correspondrealrects; resizecancels oldflights. Short horizontal route ondesktop; mobile source thenoutputs vertical. Не имитировать отправкуфото, publishing ad,IDsearch,stockstates или новыеботменю.

Материалы кейса: основной ряд copy/схема выровнен по началу; details вынесен отдельным полным рядом под ним. При open/close основные блоки сохраняют взаимное положение. Без scrollIntoView на toggle. Полный немецкий текст, вход и таблица компактной сеткой desktop, одной колонкой mobile. Native details/summary, Escape и возврат фокуса; сохранить честную краткую подпись примера, техническую provenance оставить в отчёте.
  
Preview содержит Telegram input reconstruction, German fulltext, file list и table row; missingphoto не скрывать правду. Photos только approved originals matchingorder. Доmaterialready локальная illustrationplaceholder допустима с ограничением в отчёте; для production нельзя выдавать её за настоящиеclientphotos. Без ложной «позже добавим» action наpublishedсайте.

## 5. Финал A

One continuouspanel: compact3horizontalstages→outcome+conditions→divider→portrait+contact. #process уначалаэтапов, #contact уконтактногоприглашения. Не B sidebyside, не прежниеlarge cards+extra workcanvas.

Fullstage descriptionsSPEC. Удалить все мини-схемы под тремя этапами: исходники/карта процесса, данные/результат, проверки/исправления. Сохранить основные описания, результат разбора, условия и контакт.

Contact stronger visualweight: divider gap40–48desktop/24–32mobile, H2≈38–44desktop/28–32mobile, inputmin56desktop/52mobile. Не cramped narrowfield nexttooversizedbutton: broadfield,buttonbelow. Readablecaption/placeholder. Photo crop≈160×180desktop/88×88mobile, исходное лицо; отдельная Avatar-soft-background-v1.png дляreview, не вырезать изreference. Фото требуетпринятиявладельцем, не применять saturationwholeimage.

Primary Conversion дословноSPEC. Candidatecaption наA-v2 DRAFT доcomposerverification; actualcaption остаётся «Подготовим первое сообщение. Отправите его сами в Telegram.» Визуальныйref не отменяетgate. Form/photo/CTA неподвижны и interactivesразу.

Этапы без отдельного контроллера и «Повторить этапы». Desktop: однократное мягкое появление с задержкой 200–300ms между этапами. Mobile: каждый этап появляется при входе в видимую область, без обязательного ожидания чтения. Reduced motion — сразу полный контент; форма, фото и CTA неподвижны.

## 6. Общие entrances и mobile

EachareaafterHero softonceentry: heading y12–16opacity.65→1/450–550ms; panel y18–24opacity.55→1/600–700ms; delay≤120ms. Mobile y8–12/400–500ms. Еслиalreadyvisible,onrestore,deepanchor илиrapidscroll — fullcontent без waits. Не скрывать доJS, notre-hide onreturn. Initial usefulsequence послеentry, не allmotionsimultaneous. Contact usablealways. Numericguidesadjustable.

Mobile ordering:
Hero copy→CTA→compact source/result→selectors.
Tasks heading→compactselector→explanation→source→result→progress/replay/stop; не ten talllabels.
Casecopy→input→materials→sheet.
Finalstage rows→outcome/conditions→portrait/title→optionalfield→CTA.
No horizontaloverflow; no whole-desktopscale; copyreadable≥14,data smallmeta≥12, mainbody16. Сохраняетсяmobilemenuabove scenes.

## 7. Engineering invariants

Source modules existingVite/vanilla,Three,GSAP,Lenis. Lockfile unchanged,dependencies noinstall/update. Data separatedfromstyle/motion. OneGSAPticker, LenisautoRaf:false, WebGL lazydynamicimport separatefromform/menu. Initialreduced noGPUdownload, noJSfulltext+directTelegram.

Immutable seededgeometry; uniforms only; desktopDPR≤1.5/mobile≤1; mobile updatecap30. Render outsideHero/hidden stopped viaobserver, no getBoundingClientRect everyframe. No independent perpetualRAF; noallocateinrenderloop, highcostanimatedblur/shadow.
 
BFCachepersistedpagehide suspendwithoutdispose, pageshowrestore;normalexitresourcesdisposed/listenersremoved. Handlecontextloss/loadfail viaCSSfallback. Stage/task/Hero ownrunId/timeline cleanup; selection,hidden,reduced,offscreen,resize canceltransients and no staleresults. pause retainsuserintent.

Keep existinghashed assets/immutablecache,buildpipeline and formdraftbuilder. Не редактировать minifiedgeneratedassets вручную. Productionexport/push notcurrentdocumenttask, separatelyassignedonly. Не заявлять60fps,conversionlift илиallTelegramclients basedonheadlesssoftwareGPU.

## 8. Acceptance

Screenshots1440×900,1280×720,1024,768×1024,430,390×844,375×812,360,320. Fullpageandsectionshots +shortmotioncapture. CompareownHTMLto4currentreferences. Propercopy/datavalues,allareasvisible,nevergeneratedphotoasreal.

KeyboardTab/Enter/Space/Escape,focus,menus,selectors,preview,optionalfield,draftURL bothtemplates. Motionrapidreplay/selection,hold/pausehiddenreturn/offscreenresize/reduced toggle,counts noleakedclones/timers,≤1activetask. H1exactreverse. NoJS/WebGLoff/importfail. Capturecomputedcontrast;nooverflow orconsoleerrors.

ProveHero rendererframesstopoffscreen andGPUchunknotrequestedinitialreduced. VerifyunchangedPrimarytemplatesandfixedheader/progress. Physicaldevices/Safari/performance/messagingcomposer stillOPEN unlessactuallytested. Never send realmessages inchecks.

Тексты и немецкая редакция APPROVED. Оригинальные фото и разрешения остаются OPEN; локальная текстовая реконструкция допустима в назначенном brief. Отчёт: изменённые файлы, проверки, непроверенное и OPEN. Без watch, установки зависимостей или публикации вне отдельного назначения.


## 9. Утверждённое управление — уточнение MAIN 03.10.2026

- Hero: шесть примеров/около 6s; задачи: десять/около 15s. Desktop и mobile автоматически идут по кругу.
- В каждой области одна небольшая доступная кнопка остановки/продолжения, без оформления плеера. Вкладка, включая активную, запускает повтор. В задачах дополнительно «Повторить пример» и дорожка самого прохода.
- Hover/focus удерживает только автопереход, запущенный проход завершается. При выходе после завершения дать спокойное чтение (Hero 1,5s; задачи 5s), затем продолжить; если проход ещё идёт, не сбрасывать его прогресс.
- Ручной выбор плавно отменяет предыдущую timeline, запускает выбранную и удерживает полный результат до явного продолжения. Остановка текущего прохода показывает полный итог; продолжение запускает его заново с автосменой. Не оставлять полупрозрачный остановленный кадр.
- Hidden/offscreen сохраняют выбор и пользовательскую паузу, отменяют незавершённую timeline и показывают итог; без catch-up. Возврат запускает новый проход только без пользовательской паузы.
- Семантический полный текст остаётся в HTML, никаких live-объявлений печатаемых букв, накопления узлов или дублирующих таймеров. На touch нет зависшего hover; декоративные эффекты проще, сценарий тот же. Reduced motion: полный статичный итог и ручной выбор.
- Workspace glow только fine pointer, один наружный мягкий слой; mobile/reduced без cursor glow.

Для текущего ограниченного назначения MAIN: одна сборка после правок и короткий просмотр изменённых областей на 1440/390. Предыдущую полную матрицу из раздела 8 не повторять. Новые публикация, commit/push и зависимости не разрешены.

## 10. Актуальная точечная доводка — APPROVED

references/BUILDER-NIMBUS-FINAL-POLISH.md включён MAIN как supporting implementation brief. Он уточняет размеры Hero, видимость сферы, расположение раскрываемых материалов и компактность финала; актуальные уточнения заменяют прежние геометрические ориентиры при конфликте.

Hero: desktop min-block-size около100svh, border-box; arrow28–40px от низа; задачи не видны на первом высоком desktop viewport. Контент не обрезается, короткие/узкие экраны растут естественно. Никаких snap/pin. Данные карточек ближе к заголовку, без вертикального центрирования в чрезмерно большом пустом пространстве.

Финал: цель760–820px на wide desktop с сохранением copy; panel padding24–32, divider/contact24–28, портрет128–144px, H2 этапов34–38px одной строкой только если помещается. На mobile не пытаться уместить все этапы и форму в одну высоту экрана. Сохранить field56/52px и font16.

Новые проверки ограничены1440×900 и390×844, с дополнительной короткой высотой лишь при дефекте. Не применять раздел8 как требование заново повторить полную матрицу. Заметность сферы оценивать в обычном motion, не только reduced screenshots.
