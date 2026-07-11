/* Elysium Minecraft Server
   Version: 2.7.0
   Второй этап реструктуризации:
   JavaScript и данные страниц вынесены из index.html.
*/

const sections = {"java":{"id":"java","title":"Elysium Java","badge":"☕ Java направление","lead":"Эти правила действуют для всех игроков Java-направления с момента регистрации на сервере. Играйте честно, уважайте других игроков, соблюдайте требования Администрации и не создавайте проблем проекту.","accent":"java","stats":[["Честная игра","без читов, X-Ray, макросов, автокликеров и запрещённых модов"],["Проверки","администрация может вызвать игрока на проверку"],["TPS","стабильность сервера — общая ответственность"],["Ban","тяжёлые нарушения караются блокировкой и снятием привилегий"]],"buttons":[["← На главную","home"],["Перейти к Bedrock →","bedrock-rules"],["Правила чата →","chat-rules"]],"important":"Правила могут изменяться без уведомления. Спасибо за игру на Elysium Java!","groups":[["🛡️","Свод №1 — Безопасность и честная игра","Скины, аккаунты, стороннее ПО, помехи игрокам и порча мира.",[["1.0","Скины 18+","Запрещено использование скинов, содержащих материалы 18+.","Кик → Тюрьма на 30 минут.","warn"],["1.1","Взлом и кража данных","Запрещены попытки взлома аккаунтов, кража данных и обман игроков с целью получения доступа к их учётным записям.","Перманентная блокировка (в тяжелых случаях — по IP) + снятие привилегий.","ban"],["1.2","Стороннее ПО и ресурспаки","Запрещено использование стороннего ПО: читов, макросов, автокликеров. Запрещены ресурспаки и модификации: X-Ray любого вида, X-ray модификации любого вида, Fullbright модификации любого вида, а также любые программы, изменяющие игровой процесс.","Блокировка по IP навсегда + снятие привилегий.","ban"],["1.3","Помеха игровому процессу","Запрещено намеренно мешать игровому процессу других игроков.","Тюрьма до 50 минут.","jail"],["1.4","Постройки и биомы","Запрещено строительство нецензурных сооружений и намеренная порча биомов.","Тюрьма на 15 минут → Блокировка на 1 день (1440 минут).","warn"]]],["💬","Свод №2 — Общение и поведение","Передача аккаунтов, чат, оскорбления, администрация и провокации.",[["1.5","Передача аккаунтов","Запрещена передача, продажа, обмен или розыгрыш игровых аккаунтов.","Блокировка (в тяжелых случаях — по IP) навсегда + снятие привилегий.","ban"],["1.6","Оскорбления, угрозы, флуд и спам","Запрещены оскорбления, унижения, угрозы, флуд и спам.","Тюрьма на 20 минут.","jail"],["1.7","Оскорбления родственников","Запрещены оскорбления родственников игроков.","Блокировка на 3 дня (4320 минут).","ban"],["1.8","Оскорбление администрации","Запрещено оскорбительное отношение к Администрации сервера.","Тюрьма на 15 минут.","jail"],["1.9","Провокации против проекта","Запрещены намеренные провокации и деструктивные высказывания в адрес проекта.","Кик → Блокировка на 1 день (1440 минут).","warn"]]],["⚖️","Свод №3 — Реклама, администрация и спорные ситуации","Реклама, требования администрации, провокации, попрошайничество и обсуждение действий администрации.",[["2.0","Реклама","Запрещена реклама сторонних проектов, ресурсов и серверов Minecraft.","Тюрьма на 60 минут.","jail"],["2.1","Игнорирование администрации","Запрещено игнорирование требований Администрации.","Тюрьма на 10 минут → Кик → Тюрьма на 60 минут.","warn"],["2.2","Провокация наказания","Запрещено намеренно провоцировать выдачу наказания.","Кик → Блокировка на 720 минут.","warn"],["2.3","Выпрашивание","Запрещено выпрашивание доната, материальных ценностей или помощи у Администрации.","Тюрьма на 10 минут → Кик → Блокировка на 60 минут.","warn"],["2.4","Обсуждение действий администрации","Публичное обсуждение действий Администрации допускается только в предусмотренных разделах проекта.","Кик → Тюрьма на 3 часа (180 минут).","warn"],["2.5","Выдача себя за администрацию","Запрещено выдавать себя за представителя Администрации.","Кик → Блокировка на 1 день (1440 минут).","ban"]]],["⚙️","Свод №4 — Производительность сервера","Мы работаем на однопоточном ядре. Стабильность TPS — общая ответственность.",[["2.6","Лаг-машины","Запрещено строительство лаг-машин и сооружений, вызывающих просадки TPS.","Тюрьма на 30 минут → Кик → Блокировка аккаунта (в тяжелых случаях — по IP) на 3 дня (4320 минут).","ban"],["2.7","Воронки и лишний дроп","Большое количество воронок (hoppers) в механизмах обязаны быть закрыты компостерами сверху. Весь лишний дроп с ферм должен автоматически уничтожаться.","Предупреждение → Принудительный снос механизма.","warn"],["2.8","Мега-фермы в одном регионе","Запрещено концентрировать несколько мега-ферм в одном регионе (16x16 чанков). Разносите постройки по миру.","Предупреждение → Принудительный перенос/снос.","warn"]]],["🚫","Свод №5 — Запрещённые моды и проверки","Дополнение к пункту 1.2: список запрещённых модов, проверка игрока и отказ от предоставления данных.",[["2.9","Запрещённые моды","Ссылаясь на пункт (1.2), запрещено использование модов: авто-тотем модификации любого вида; модификации, выполняющие действия за игрока; ИИ, принтер и так далее; чит-модификации любого вида; AFKPeace; Aristois; AutoSwitch; ArmorPoser и его аналоги; Baritone; Bedrock Miner; Better PVP все версии; BetterClicker; Bridging Mod; ClientCommands; CMDCam; Elytra Utilities; FindMe; FreeCam; Impact; Inertia; Inventory Plus; InvMove; ItemSwapper; Jello; LavaClearView; Librarian Trade Finder; MultiConnect; NoFog; SeedCracker; Sigma; Gamma; Trajectory Preview; Tweakeroo; Wall-Jump; Wurst. Вместо NoFog используйте Sodium Extra или OptiFine.","Блокировка по IP навсегда + снятие привилегий.","ban"],["3.0","Вызов на проверку","Каждый сотрудник сервера Elysiumjava, будь то Администратор или Модератор, имеет полное право вызвать игрока сервера на проверку специальной командой заморозки игрока в связи с подозрениями на нарушение игроком пунктов правил: [1.2] - [2.9].","Проверка проводится по требованию сотрудника сервера.","info"],["3.1","Демонстрация экрана и файлов","Каждый сотрудник сервера Elysiumjava, будь то Администратор или Модератор, имеет полное право потребовать от игрока включить демонстрацию экрана и показать файлы клиента Minecraft, рабочий стол, папки с файлами игрока на устройстве и клиенте. Если игрок отказывается предоставить доступ к просмотру данных, следует наказание из пункта [3.2].","Обязательное выполнение требования администрации.","info"],["3.2","Отказ от проверки","В случае отказа игроком в предоставлении данных на демонстрации экрана сотруднику сервера.","Тюрьма на 60 минут, далее в случае повторного отказа от предоставления данных → Блокировка навсегда + снятие привилегий.","ban"],["3.3","Неуважение к сотрудникам сервера","Неуважительное отношение к сотрудникам сервера ElysiumJava project, независимо от того, являются ли они Модератором или Администратором, запрещено.","Тюрьма на 10 минут → Кик → Блокировка.","jail"]]],["🧩","Свод №6 — Дюпы, баги и общие положения","Дюпы, баги, действие правил и право администрации принимать решения по ситуации.",[["3.4","Дюпы и ошибки сервера","Запрещено дюпать предметы и использовать ошибки сервера для получения преимуществ.","Блокировка аккаунта / IP на 60 лет + удаление всех надюпанных предметов.","ban"],["3.5","Использование и сокрытие багов","Запрещено использование, распространение и сокрытие багов сервера.","Тюрьма на 60 минут + дополнительная блокировка на 1 день.","ban"],["3.6","Общие положения","Данный свод правил действует для всех игроков с момента регистрации на сервере. Игрок обязан соблюдать правила сервера и выполнять требования Администрации. Администрация вправе применять наказания за нарушения, не описанные напрямую в правилах. Администрация оставляет за собой право принимать решения исходя из ситуации.","Обязательно к соблюдению.","info"]]]]},"bedrock":{"id":"bedrock","title":"Elysium Bedrock","badge":"🟩 Bedrock направление","lead":"Эти правила действуют на всех пользователей Bedrock-направления с момента регистрации аккаунта на сервере.","accent":"bedrock","stats":[["IP/CID","тяжёлые нарушения могут караться по IP/CID"],["Команды","админ-команды нельзя использовать без причины"],["Чат","без оскорблений, спама, рекламы и провокаций"],["TPS","лаг-постройки и вред серверу запрещены"]],"buttons":[["← На главную","home"],["Перейти к Java →","java-rules"],["Правила чата →","chat-rules"]],"important":"Данный свод правил может корректироваться в течение времени Создателем сервер проекта. Незнание правил не освобождает от ответственности. Спасибо за игру на Elysium Bedrock!","groups":[["🛡️","Свод №1 — Игровые правила","Скины, аккаунты, читы, телепорты, команды и помехи игровому процессу.",[["1.0","18+ скины","Запрещено использование 18+ скинов.","кик ➝ блокировка игрового аккаунта на 60 минут.","warn"],["1.1","Взлом и получение данных","Запрещена попытка взлома, взлом пользователя, а также намеренный обман игроков с целью получить их данные от аккаунта.","блокировка игрового аккаунта по IP/CID навсегда + снятие.","ban"],["1.2","Сторонние программы","Запрещено использование сторонних программ ( Софт-Читов. ), ( Макросов ), ( Модов ), ( Автокликера ) и т.п. для облегчения или изменения игрового процесса, включая PVP-режим Драг-Клика.","блокировка игрового аккаунта по IP/CID на ( 60 Лет. ) / ( 31536000 минут ) + снятие.","ban"],["1.3","TPA/TP для убийства","Запрещена телепортация к игроку или к себе с целью его убийства - ( /tpa - /tp ).","блокировка игрового аккаунта на ( День. ) 1440 минут ➝ снятие.","ban"],["1.4","Команды без корректной причины","Запрещено использование команд /ban, /banip, /bancid, /pardon, /pardon-ip, /pardoncid, /kill, /kick, /mute, /jail, /tphere, /freeze, без корректных, соответствующих причин, сроков.","блокировка игрового аккаунта на ( 3 Дня. ) 4320 минут ➝ снятие.","ban"],["1.5","Помеха игровому процессу","Запрещено создавать помеху игровому процессу: игнорирование требований покинуть регион, намеренно препятствовать игрокам взаимодействовать с игровыми механиками сервера.","тюрьма на 30 минут: ➝ блокировка игрового аккаунта на ( 3 Часа. ) 180 минут.","jail"],["1.6","Нецензурные постройки и порча биомов","Запрещено (строительство нецензурных построек) и (намеренная порча) биомов сервера.","кик ➝ блокировка игрового аккаунта на ( День. ) 1440 минут ➝ снятие.","warn"],["1.7","Передача аккаунта","Запрещено передавать, продавать, обменивать, разыгрывать аккаунт кому-либо.","блокировка игрового аккаунта по IP/CID на ( 60 Лет. ) / ( 31536000 минут ) + снятие.","ban"]]],["💬","Свод №2 — Правила в чате","Общение игроков, родные, администрация, проект и реклама.",[["1.8","Оскорбления, угрозы, спам и флуд","Запрещено оскорблять игроков проекта, использовать слова оскорбительного характера, унижать честь и достоинство, ущемлять в правах игроков, угрожать, спамить, флудить в любых проявлениях.","блокировка игрового аккаунта на 60 минут.","jail"],["1.9","Упоминание родных","Запрещено упоминание родных игрока в оскорбительной, провокационной, унизительной форме.","мут на 60 минут.","warn"],["2.0","Оскорбление администрации","Запрещено оскорбительное отношение к Администрации сервера.","тюрьма на 15 минут: ➝ блокировка игрового аккаунта на ( 3 Часа. ) 180 минут.","jail"],["2.1","Негатив в сторону проекта","Запрещено в негативной форме высказываться по поводу сервера, в сторону проекта.","кик ➝ блокировка игрового аккаунта на ( День. ) 1440 минут ➝ снятие.","warn"],["2.2","Реклама сторонних ресурсов","Запрещено рекламировать, призывать перейти на сторонний ресурс.","блокировка игрового аккаунта по IP/CID на ( 60 Лет. ) / ( 31536000 минут ) + снятие.","ban"],["2.3","Игнорирование администрации","Запрещено игнорирование требований Администрации сервера.","кик ➝ блокировка игрового аккаунта на 720 минут + снятие.","warn"],["2.4","Выпрашивание наказания","Запрещено выпрашивать наказание без какого либо нарушения правил.","кик ➝ блокировка игрового аккаунта на 720 минут + снятие.","warn"],["2.5","Попрошайничество доната","Запрещено попрошайничество доната и реальных ценностей у Администрации сервера.","тюрьма на 30 минут: ➝ блокировка игрового аккаунта на ( 3 Часа. ) 180 минут.","jail"],["2.6","Публичная критика администрации","Запрещена публичная критика, оспаривание действий Администрации проекта.","кик ➝ блокировка игрового аккаунта на ( 3 Часа. ) 180 минут.","warn"],["2.7","Выдача себя за администрацию","Запрещено выдавать себя за Администрацию сервера.","кик ➝ блокировка игрового аккаунта на ( День. ) 1440 минут ➝ снятие.","ban"],["2.8","Обман на игровые ценности","Запрещено обманывать на вещи, игровую валюту, постройки, игровые ценности.","тюрьма на 60 минут.","jail"]]],["⚙️","Свод №3 — Правила о вреде серверу","Лаг-постройки, дюпы, баги и вред серверу.",[["2.9","Лаг-постройки","Запрещено строительство Лаг-Построек / Построек вызывающих лаги у игроков и падения TPS сервера.","блокировка игрового аккаунта по IP/CID на ( 3 Дня. ) 4320 минут ➝ снятие.","ban"],["3.0","Дюп предметов","Запрещено дюпать предметы, игровые ценности багами или сторонними программами.","блокировка игрового аккаунта по IP/CID на ( День. ) 1440 минут ➝ снятие + удаление надюпанного.","ban"],["3.1","Баги и недоработки","Запрещено использование любых багов сервера, недоработок проекта, игрового клиента, а также их распространение, нанесение вреда серверу в своих целях, будь то намеренных, или же случайных.","блокировка игрового аккаунта на ( 3 Часа. ) 180 минут. ➝ снятие + блокировка игрового аккаунта по IP/CID на ( День. ) 1440 минут.","ban"]]],["📌","Свод №4 — Общие правила","Общие положения Bedrock-направления.",[["3.2","Действие правил","Данный свод правил действует на всех пользователей с момента регистрации аккаунта на сервере.","Обязательно к соблюдению.","info"],["3.3","Требования администрации","Игроки обязаны соблюдать предписания данных правил и выполнять требования Администрации.","Обязательно к соблюдению.","info"],["3.4","Непрямые нарушения","Администратор вправе наказать игрока по причине не указанной в настоящих правилах только при веской на то причине.","Решение по ситуации.","info"],["3.5","Решение администрации","Администрация проекта, вправе наказывать игроков на свое усмотрение, имеет право выдавать различные наказания за нарушения игроков, в связи с определенной ситуациией случая описанной в правилах.","Решение по ситуации.","info"]]]]},"chat":{"id":"chat","title":"Telegram / Discord","badge":"💬 Правила чата","lead":"Общие правила общения в Telegram и Discord проекта Elysium. Они действуют для всех участников чатов и серверных площадок проекта.","accent":"chat","stats":[["TG / Discord","общие правила для чатов проекта"],["Варн","предупреждения действуют навсегда"],["Бан","за тяжёлые нарушения"],["ЛС","апелляции и спорные ситуации"]],"buttons":[["← На главную","home"]],"important":"Запомни: незнание правил не освобождает от ответственности. При возникновении спорных ситуаций окончательное слово остаётся за Администрацией.","groups":[["🌟","Свод №1 — Чат и общение","Общение участников, уважение и запрет травли.",[["1.0","Оскорбления, угрозы и травля","Запрещены намеренные формы оскорблений, унижение чести и достоинства, угрозы, травля. Также запрещены чрезмерный буллинг и систематический троллинг в адрес участников или Администрации.","Пред. / Варн. — Навсегда.","warn"],["1.1","Провокационные упоминания","Запрещено упоминание психотропных веществ, суицидальных наклонностей, наркотических веществ, а также родных и близких участников в явном негативном, оскорбительном или провокационном ключе.","Пред. / Варн. — Навсегда.","warn"]]],["📸","Свод №2 — Медиа и контент","Медиа, 18+ материалы, шок-контент и чрезмерная нецензурная лексика.",[["1.2","Материалы 18+ и шок-контент","Запрещена публикация материалов сексуального характера (18+), шок-контента, насилия, жестокости и прочих подобных материалов.","Бан. — Навсегда.","ban"],["1.3","Чрезмерная нецензурная лексика","Запрещено чрезмерное использование нецензурной лексики, включая обходы и подобные формы.","На усмотрение Администрации / Модерации.","jail"]]],["⏰","Свод №3 — Флуд и спам","Сообщения без смысла, спам, капс, стикеры, эмодзи и команды бота.",[["1.4","Флуд и спам","Запрещены сообщения без смысла (флуд), а также многократная отправка одинаковых или схожих сообщений (спам).","Пред. / Варн. — Навсегда.","warn"],["1.5","CAPS LOCK, стикеры и эмодзи","Запрещено злоупотребление CAPS LOCK, чрезмерное использование стикеров, эмодзи или команд бота, мешающее общению.","Пред. / Варн. — Навсегда.","warn"]]],["🗨️","Свод №4 — Оффтоп","Массовые обсуждения не по теме проекта.",[["1.6","Массовый оффтоп","Запрещены массовые обсуждения, не относящиеся к проекту Elysium. Сервер, обновления и связанные игры разрешены. Остальное — по ситуации.","Пред. / Варн. — Навсегда.","warn"]]],["🔗","Свод №5 — Реклама и ссылки","Реклама сторонних проектов и вредоносные ссылки.",[["1.7","Реклама","Запрещена реклама сторонних проектов, серверов, каналов, товаров или услуг без согласования с Администрацией.","Бан. — Навсегда.","ban"],["1.8","Вредоносные ссылки","Строго запрещена публикация вредоносных ссылок, фишинговых сайтов, ресурсов с читами или эксплойтами.","Бан. — Навсегда.","ban"]]],["🧠","Свод №6 — Дезинформация","Ложная информация о проекте и обман участников.",[["1.9","Ложная информация","Запрещено намеренное распространение ложной информации о проекте Elysium, Администрации и обновлениях.","Пред. / Варн. — Навсегда.","warn"],["2.0","Обман участников","Запрещён любой обман участников с целью получения выгоды, данных аккаунта или других ценностей.","Бан. — Навсегда.","ban"]]],["🛡️","Свод №7 — Взаимодействие с администрацией","Уважение к администрации, апелляции и стикеры.",[["2.1","Неуважение к администрации","Запрещено оскорбление и неуважение к Администрации и модерации.","Пред. / Варн. — Навсегда.","warn"],["2.2","Оспаривание решений","Запрещено публичное оспаривание решений Администрации или модерации в конфликтной форме. Для подачи апелляций обращайтесь в ЛС.","Пред. / Варн. — Навсегда.","warn"],["2.3","Нецелесообразные стикеры","Запрещена отправка стикеров, 18+ наборов, материалов нецелесообразного, угнетающего человека или аморального характера.","Пред. / Варн. — Навсегда.","warn"]]]]}};

    sections.java.buttons = [["← Назад", "rules"], ["Перейти к Bedrock →", "bedrock-rules"], ["Правила чата →", "chat-rules"]];
    sections.bedrock.buttons = [["← Назад", "rules"], ["Перейти к Java →", "java-rules"], ["Правила чата →", "chat-rules"]];
    sections.chat.buttons = [["← Назад", "rules"]];

    const app = document.getElementById("app");

    function escapeHTML(value) {
      return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    function ruleCard(rule) {
      const [num, title, text, punishment, level] = rule;
      return `
        <article class="rule-card ${escapeHTML(level)}">
          <div class="rule-top">
            <div class="rule-num">${escapeHTML(num)}</div>
            <h3>${escapeHTML(title)}</h3>
          </div>
          <p>${escapeHTML(text)}</p>
          <div class="punishment"><span>➤</span> ${escapeHTML(punishment)}</div>
        </article>
      `;
    }

    function groupBlock(group) {
      const [icon, title, desc, rules] = group;
      return `
        <section class="rule-group">
          <div class="group-head">
            <div class="group-kicker">${escapeHTML(icon)} Elysium Rules</div>
            <h2>${escapeHTML(title)}</h2>
            <p>${escapeHTML(desc)}</p>
          </div>
          <div class="cards">
            ${rules.map(ruleCard).join("")}
          </div>
        </section>
      `;
    }

    function statsBlock(stats) {
      return stats.map(([title, desc]) => `
        <div class="stat">
          <strong>${escapeHTML(title)}</strong>
          <span>${escapeHTML(desc)}</span>
        </div>
      `).join("");
    }

    function buttonsBlock(buttons) {
      return buttons.map(([label, target]) => `
        <button class="back-btn" type="button" data-target="${escapeHTML(target)}">${escapeHTML(label)}</button>
      `).join("");
    }

    function elysiumView() {
      return `
        <main id="elysiumView" class="view">
          <section class="site-page site-hero">
            <div class="site-inner">
              <div class="hero-front">
                <h1><span>Elysium</span><br>Minecraft Server</h1>
              <p class="lead">
                Главная страница проекта Elysium. Здесь собраны старт игры, правила, способы поддержки
                и важные ссылки для игроков Java и Bedrock направлений.
              </p>

              <div class="social-dock" aria-label="Социальные сети Elysium">
                <span class="social-label">Сообщество</span>
                <a class="social-link telegram" href="https://t.me/elysiummcbe" target="_blank" rel="noopener noreferrer" title="Telegram Elysium" aria-label="Telegram Elysium">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M21.8 4.4c.3-1.3-.8-1.8-1.9-1.4L2.7 9.6c-1.2.5-1.2 1.2-.2 1.5l4.4 1.4 1.7 5.2c.2.6.1.8.7.8.5 0 .7-.2 1-.5l2.4-2.3 5 3.7c.9.5 1.5.2 1.8-.9l3.2-15.1ZM7.6 12.1l10.1-6.4c.5-.3.9-.1.5.2L9.6 13.7l-.3 3.1-1.7-4.7Z"/>
                  </svg>
                </a>
                <a class="social-link discord" href="https://discord.gg/AFTPbpSN7X" target="_blank" rel="noopener noreferrer" title="Discord Elysium" aria-label="Discord Elysium">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M20.3 4.4A16.3 16.3 0 0 0 16.3 3l-.2.4c-.2.4-.4.8-.5 1.1a15.2 15.2 0 0 0-7.2 0c-.2-.4-.3-.8-.6-1.2L7.7 3a16.3 16.3 0 0 0-4 1.4C1.2 8.1.6 11.7.9 15.2a16.5 16.5 0 0 0 5 2.5l.7-1.1.4-.7a10.6 10.6 0 0 1-1.6-.8l.4-.3a11.8 11.8 0 0 0 12.4 0l.4.3a10.6 10.6 0 0 1-1.6.8l.4.7.7 1.1a16.5 16.5 0 0 0 5-2.5c.4-4.1-.7-7.6-2.8-10.8ZM8.6 13.6c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm6.8 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z"/>
                  </svg>
                </a>
              </div>


              <div class="hero-actions">
                <button class="scroll-down-btn" type="button" data-scroll-target=".home-grid" aria-label="Перейти к разделам">
                  <span>К разделам</span>
                  <span class="scroll-arrow">↓</span>
                </button>
              </div>
              </div>

              <div class="home-grid">
                <article class="home-card start-card">
                  <div class="icon">🚀</div>
                  <h2>Начать играть</h2>
                  <p>
                    IP сервера, инструкция входа и быстрый старт для Java и Bedrock игроков.
                    Всё нужное для подключения собрано в одном месте.
                  </p>
                  <button class="main-btn green" type="button" data-target="elysium-start">Открыть START →</button>
                </article>

                <article class="home-card">
                  <div class="icon">📃</div>
                  <h2>Правила проекта</h2>
                  <p>
                    Все правила в одном месте: Java, Bedrock и Telegram / Discord.
                    Разделы открываются отдельными быстрыми ссылками.
                  </p>
                  <button class="main-btn" type="button" data-target="rules">Открыть правила →</button>
                </article>

                <article class="home-card">
                  <div class="icon">💎</div>
                  <h2>Поддержка сервера</h2>
                  <p>
                    Поддержка помогает оплачивать сервер, развивать проект и поддерживать инфраструктуру.
                    Это добровольно и не обязательно для игры.
                  </p>
                  <button class="main-btn orange" type="button" data-target="donate">Поддержать проект →</button>
                </article>
              </div>

              <section class="team-section">
                <div class="team-head">
                  <div>
                    <h2>Команда Elysium</h2>
                    <p>Лица проекта, которые отвечают за сервер, развитие и порядок внутри сообщества.</p>
                  </div>
                  <div class="team-note">Состав будет пополняться</div>
                </div>

                <div class="staff-grid staff-pair-strip" aria-label="Команда Elysium">
                  <article class="staff-card">
                    <div class="staff-avatar">
                      <img src="data:image/webp;base64,UklGRkQQAABXRUJQVlA4IDgQAABwiQCdASqAAYABPmEwkkakIyGhqFQooIAMCWkD3a8Foz1L4zGpgOkn5NZQ/8JvwuieYR6y/Qf936Sc1D9aXYfQY/sfrH/5fnV+sRL6KLV6SxNYSxfClcDTol01vkrTootXpLE1iAaSq+wWwTSHLItqKD/DxmxeRxx+8SAOLq2mIY1AsTWDyx56w/ywiDIM3zI0wlMAkZzOVI/T8NbVOYaOHeRGa1mXCLv8laW4i1cxr/IcuRYwkwJcwTwrTwPEYVvtjlJ4qa1QefMB5omZUg1U8lIuBpxitSCGWu27w22pShItg7y9dvqfC8eKyitKKTlEJOuBRSfrEB9cEpunNLamLvJ7EPxoumuBnW2hkRPPl+QYaXbyws/OeIb+63siH+TfRsqd215gb3dG1wkl04Jap9QN/JKyCviEshMx87jTIT8+63yFTGaQq7lTzW4GK/TMACNJA/1reGiJ37AqoCU2jmUJ6ndE/SX/AIcY7nssKYZS9tNwxUnaw5orWBO5ivXWnPX4ZQxiUcqNHSvCtaDv9leBYXpPXbsUtZP6v7TkUnNiHmiJLPgEgkyf+zKBZJrnwUpepbuXTWvlScVTeuX76BmiPXGVd9g5ccjcBCiB7iSRlA4fxf3B9yN0HD4KVr6SOWAx27D3vSIDTfJFwh2ij9iFCmavu924B3J9QC0KUP6jUU0i+E2GPQhxa3wT5UQ5511GGFe3Xk5tpidOoA4SjOA7YCgeJgN17sf6C7KGDDSMjH0NIVi559D8QKZwX+63PjlX0xMQH53iOYYBDAxUlA8KjuENYN7SW8ZjM/0S7yl9qQbYueg7GauBY760WlFnmfZYJmbXdtQ/RCN71/32Uz6U13pBlMOnRWIur0U+lBV7hAwGatJzxPQgh4YOdP6RNWdKqFkgkaOfb9w8lnkPHQLtMn7uEK9cHUb67AaKnD6I+05W4x7HwHINIbMGavTO0kPpA8YKVt9qmW8JJIL04pCnRa7lCaiQzyX2IKMATdmNCWSsOCrczLZ7SddTQOJiAQir6GfDicvlmlUEcozMb9HuyFehhWFVVIrqijJo/VJ6w/aElgE+dxFzvuTzb3JkfDvWQRKiR05J0wfw14AYjdv5zcBLfBarwyIi49D0w9S0fAOqO2iIX1ZGgYPnsAqH3Zu08FFkebV+nBBuuVWUmh64DD86fA1L191rKsCZTWUtY2GeOD3L+I7++pFBkVwHTPubSijR21XEkJwuaSVxQvDeNsLhP79Vxq8ZyTzv6jEWGCRkLQSMSOe6qVsQDCbhOZ43i2jnypCqJUvLojF8n4Vlv/VBZv2AqEniuW/tqULqDGGINiOfIkngNEjpZpwrBIKjwNcshSMnWDROxOo/K6MQ2v/QqoS5lxSRp5+PPEoHsVcji3D+rVHTCrXXAKkM355RDWkOTs5v6zrn5tdrl/CoVLxW9i9JfXkNvSALP+F3YPBGaoZAetL2Bbl0ClxjLj2AAP767Z2zwAANcAAA/S712YrWr5dkBNsfpZtmfrDo/2DpWTL0dWsiPFDafKcaDIzUjs3ksuwMAio/GEIesszEEWH+GRsA7cUQdAMyIeMIGVH5w9a9lCd50RnqBQPCuEZFc0oiUSxogf7gNkd2OxjgeKruXWH8VfiJetdP7yiRWwscu+1uMderO6KfVFqj471kpDxI9h0U5t8NjSxK9JK+Ai1XXlx94I1o/Xxf+f0CAB7/XPtdoV+o1nSWOjt2ncNBWZi4REEMdmNwAzezthlhg4G9Cez7LzuwWzJTlqtJ0PRE1MLtH7/Z3jhGakxb/2FCnJwcLiP9gLEfU15/5kif9nFHgXwr9x5SYyS1xW9Ba0zdM4tqlRLjTu16vANwymaSdlF7kS2mxfBqaz0mxtJG4J8Q34Qcm9prBxo86mfGsHBMEn7+JPAsBrTCSxRh85MhzDM9B+ZQggEact5bnzUtpM5c0a36Q3rEQ7Oy39oUGMnULX+vSTiwx+HHxmxUtMgPm/dR6CkUt37TwFsKSJ3YnpI3T35tiITNpR0lPLqVT4w4v5HzNT6ChTlFOhBTTaIBZJVOxtDScJALx62pp/OK/epEXB5QtOanWGIqhDTIietndzXh4gKII6YkH81Xsuff6ha5lczZ2xOU9PhLXFIK36w10j80yz4ikA7ZxA9jshkrbTJLG7hViypij7CaZa6ApGeWgnnadcIT4ltRwQsAW2F61BhmFzCEHiSrUUNYqEa2Rt78WabrH9I5C756qDA4z1bUPWz6QS3xS9GKO5LqHqMPzCRGzaaWC0PdZcJZPtQzzN+MDOB43Uy8gBZsaR6PYjyu/TbEIUifOJpA1jr6E87Uhtmdm4YNJZo7DgkIDDSVJNkd1UW8PlFICKlCsVRnKWuorzqyHvI3/q9f6ba2Ve1v0AKD+wbv/hSZMvmp0dhXpPVPNLakH2zF3rRU/NBLisn5jXRX9f/KIQjzMrJ6uTYZ9tGxxdsx+BWvHeEwZIoBeRlJgJ5MpNG4YoUFJe2jblXgL517JiTJT5nu/XnzoEhXsc8Wj/4/9Fvys1TOEuTuGKnUj8ppcXsn3jHc8/1QCxUWqwEZEO+K7SsbGA5PBteZOpjkYs8VSf1KUO4V3j/bM2yPrByUQdcqLbhwHDSPZOI9qIkD6QyQTSWsdZJ7eXYo8tHUbWKRe5ud1tFTCDDdKtgAppnIeByTDAr+HdNJH9XH7SHESJaOb0I5fGKkrEYvE/WMaQL7Q/xCatW81HfvihWjtofeIikygvqzIr+xQ6WQX5+kMfx4WCYvVNZx6hlJj1JsaiVCBe83fD7NtYkzVU+On7Zu71SqT/G4vc/f08rtBPu6Ge7cW7WnMHHCFPSVEfIBIxbMhHB2PS4BD0U6ps+cVWoP8WVzRxYl1IxC+PvNIg1Ngv3Y5N28dnD+pGHA45OQabtnu9eoS7Q74INbX0NOKWmnX+5vwCHmcEXZFNdhu0u+/IfvesOdJtPGBi/hAz/3DnfK9783G6UDwkMecHHLLm/coMzw0PHk03w+OmkA+CK7USD9q5IzdTV3zQ11cFpaHqdh+65LvQiORgvlf8ZNHEc/apxQyf/XMmGelL7nT5Kx9O02IOpy1SaMsE+DABfM3v27cwMAyosuHClfr38GTFOqsCk7IfHFT+NY8qRVNv0nNtWef3WUt7ilxYkc7seRrRh+7AlqEYxPZQZSRVLRszz7EJbsv0UBcTM6FJ1Js77DtzwidH0C813r/EySsN65KcoT/PgYe7oNviGwgT0XEtkLkxdUi1zUaEMssPkccbLCddCLcY/ZCvwEzbQO65HmGev8L83qiowgjSYs5AIr9bgCEDVPaE9NOfuI33jd5wB+zLRCMXJ387Goo5Gkf+1OoscApkC3QE0qBzC2nYs9A0oqSmClNc3IIVgoeVGeVBc8mOaPGGKzp+Dsgy1nGEoXKUgwnx8lUbB8mUIUyOiwU3wCUzaEMDAqMfTA5vt/JX4qfHKhpC3DkA3apSFnRDjS1bkVl8P018FKVLNUvFN9nHDJVFtkjzbfLaf1o5fTty0V/JS2fMpsNiKqYXQcjQFmwuWxEBJs/dvtxTzQDUueVO0qQiprzETq5H29KlRf1XoHk8CdDKVXfNCwFd/CUE5vNR79hmru+K/t+4u0RY9VJl1Xv9rP3+db79ayAODYUKhJyDj73/5wH1PBrBCNxxBp1yuLfQgqXJSWFL0l1GqD+rmw314QXY87Xtr39/qjXVeC/fIqsvliDE+DB6vrLF8JTD7GRoUtNzQ8olvlCTtW3NHTnF3UiefU6Pc+gPjdbUTR0Cv6ubnTQnakEbMSpY8qeCD3Zg9Y8Qcr+KPJ2KHlCgSD53+avgUI9k9wbtBf9RJIIJ0IGCDnZpbQiQqA1YYdRJCpSynxwqCDIBEC8BIuqN7jXsp1wi3JJd0c+DR9P7c1YRBnDH6ckAjPtTxUFfOKgS/e+eCAMqt7Ms/r4RpatnQzycXoDZjOQu09gR7rZoO1AJivk23a90MsrcX4Fv8SD14mbaGhYrWq9G6aX43HB4mYfVxWs2R/+KlFYxySd3/aBYKsNbFWp6P7+tSh/lDHQeM4d73MqemCd6xYsWBvVFYkrIvh1JPmqYZKRA6rkqFQeMU85yqdvXx+Lno+WJiZZqGmmL/evLCKMctEN3GoC1aa1UcFX6PtwkVi8R8xovBV5imwr8lraZQImMl7lT2Lg/3V9jORE7bhBEBDw6CRFB+lnd7OjaXyZu7k+AhHwLXOOZF6kF8qfpPMARWyew2wGEVXFMLh50bKHbH3++E+CKLK3PSoXSLJGTcT8YgHf+tn2OUNnoK7zF4VmZi0igF3qYUSghnKh900lEtcNFpDk6lBTDtj1rZgtr9T8tKF6/VCYht+wPxcvKWQP46WT07rs/Yr7XH2cpE+tErwHUAVNHp2qhZSOJOAZHzTzZ3ecC6arBo7nceK3O72rhDZtM7nBHXXD+Rdpf419/7fCF3sJxbQyoYYV5hTJ3KpCG//f4Eb+z0p7mqoviC68j1C4/ZoKrJQhBo0K1GL3aK/54FSeS/ux6GH6XapAvaNgmx6zKLwLkt6E2//p0yNbydHzEX/K+k/9BJGYV85CBd3uiRS0s6CkKwjXe2755T5G/hfHn/9FvE3yFRIeXBuuAjHF3nzcAQS6Dal/tArScVJaGUgBrv9I3TbZ7sE9f+ZGHOugze3jh++now/y97XkOG2NQ0u5+Tt42uj2N07cWZcH6xT/yTypoAZIWCFegN9WJQwoIirbazZma6g7Z1EWDab03oYHRjHzAxz9SROG2GS8NOatOZqu98NwOJftVDNqo6SI33Z4RCE0EGt16NJCEvjWoyPD8fbSh8is7EwQp7Dsi6K5jKcO46tDYSOaDBWlYoKsWBMbE+/9e+TuTzFhtd/6sVH5B6OzwAdl7Kx9AXNf58+76IxLrJ2h/qtNRGyrGwRQJTTGd/K1WuVYgQBRmT0X7Km+vEoU0xEIdx0Lh1vBDhWufltlxk9vztxzroPi2uRCDe+biVY/BxRza+XlEKG+A1wf2IBqao7mjQsHzzjrlvIys0gzx+OWTB2127BjG57QagQ9OrlS9bAjbjBfGxqlLAnR/JlOdlrkhmUENnhJsYX3n5HF+mr0IzopiqlSmjyJ0pcTTRVlQdHXTIvDmMNwG+x8rhpN7/531S2Q72uIrNyTsjaUGWrVLwObZaVUBS6cafoM7lrI4hh4CI2uB08TEzymh+3qGSH3O79lAfHsJUiQ3r4OYvE1Km1Ly53tu4OA5zBdvKFgEczLw6ZG85T2vvrt7xUmo8FsfEV0sK9lLSVrUkukprvWWuFXLtmVUJfpwAgG8VzdssaHxtw4lEOh3jppXzLgOZGTzpCP1QcaZp7mR2fPAxMIKqv//eE9j2k3fS7q+UgmFotVilkpkVVboHe2v35yl3r073Bl1HfTZvBRWW7+Odyakojo/cyPrWH+e/J8W26qEQXRKo5AOEk6QOlK2i5i59Heu27awjaTPVRBzRUl/hoDWl5TwZyjjCawwC/62xLQLwRBFwdkZP6AAA=" alt="HikaruAL" draggable="false" oncontextmenu="return false;">
                    </div>
                    <div class="staff-info">
                      <div class="staff-role">👑 Создатель проекта</div>
                      <h3>HikaruAL</h3>
                      <p>Создатель Elysium и главный человек проекта.</p>
                      <div class="staff-quote">Он же Годжо Сатору.</div>
                    </div>
                  </article>

                  <article class="staff-card">
                    <div class="staff-avatar">
                      <img src="data:image/webp;base64,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" alt="Onelsey" draggable="false" oncontextmenu="return false;">
                    </div>
                    <div class="staff-info">
                      <div class="staff-role">🛡️ Главный Администратор</div>
                      <h3>Onelsey</h3>
                      <p>Главный Администратор Elysium, сайт, правила и оформление проекта.</p>
                      <div class="staff-quote">Он же по вечерам Джон Уик.</div>
                    </div>
                  </article>

                  <article class="staff-card">
                    <div class="staff-avatar">
                      <img src="data:image/webp;base64,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" alt="Soul" draggable="false" oncontextmenu="return false;">
                    </div>
                    <div class="staff-info">
                      <div class="staff-role">🧱 Модератор</div>
                      <h3>Soul</h3>
                      <p>Модератор Elysium и Bedrock-строитель масштабных японских сооружений.</p>
                      <div class="staff-quote">Он же архитектор японских крыш.</div>
                    </div>
                  </article>
                </div>
              </section>

            </div>
          </section>
        </main>
      `;
    }

    function rulesView() {
      return `
        <main id="rulesView" class="view">
          <section class="home">
            <div class="home-inner">
              <div class="badge">📃 Официальные правила сервера</div>
              <h1><span>Elysium Rules</span><br>Выберите раздел</h1>
              <p class="lead">
                Правила разделены на три направления: Java, Bedrock и общий чат Telegram / Discord.
                Выберите нужный раздел, чтобы открыть полный свод правил.
              </p>

              <div class="choice-grid">
                <article class="choice java">
                  <div class="icon">☕</div>
                  <h2>Elysium Java</h2>
                  <p>Правила Java-направления: честная игра, чат, администрация, TPS, лаг-машины, баги и дюпы.</p>
                  <button class="choice-btn" type="button" data-target="java-rules">Открыть Java правила →</button>
                </article>

                <article class="choice bedrock">
                  <div class="icon">🟩</div>
                  <h2>Elysium Bedrock</h2>
                  <p>Правила Bedrock-направления: IP/CID, команды, TPA/TP, чат, вред серверу и общие положения.</p>
                  <button class="choice-btn" type="button" data-target="bedrock-rules">Открыть Bedrock правила →</button>
                </article>

                <article class="choice chat">
                  <div class="icon">💬</div>
                  <h2>Telegram / Discord</h2>
                  <p>Общие правила чата Elysium: общение, медиа, флуд, оффтоп, реклама, дезинформация и взаимодействие с администрацией.</p>
                  <button class="choice-btn" type="button" data-target="chat-rules">Открыть правила чата →</button>
                </article>
              </div>

              <div class="hero-actions">
                <button class="main-btn secondary" type="button" data-target="elysium">← На главную</button>
              </div>
            </div>
          </section>
        </main>
      `;
    }


    function startView() {
      return `
        <main id="startView" class="view">
          <section class="site-page">
            <div class="back-row">
              <button class="back-btn" type="button" data-target="elysium">← На главную</button>
            </div>

            <section class="page-hero">
              <div>
                <div class="badge">🚀 Elysium START</div>
                <h1><span>Начать</span><br>игру</h1>
                <p class="lead">
                  Выберите платформу и подключайтесь к серверу. Java уже доступна по домену,
                  Bedrock-направление пока оставлено как заготовка под будущий запуск.
                </p>
              </div>

              <aside class="hero-card">
                <h2>Перед входом</h2>
                <div class="notice">
                  Перед началом игры ознакомьтесь с правилами проекта. Читы, X-Ray,
                  запрещённые моды и деструктивное поведение приводят к наказаниям.
                </div>
              </aside>
            </section>

            <div class="start-grid">
              <article class="connect-card java">
                <div class="icon">☕</div>
                <h2>Java Edition</h2>
                <p>Основной вход для игроков Java. Достаточно указать домен сервера.</p>

                <div class="server-box">
                  <div class="server-line">
                    <span>Адрес сервера</span>
                    <code>elysiumjava.ru</code>
                  </div>
                </div>

                <ol class="steps">
                  <li>Откройте Minecraft Java Edition.</li>
                  <li>Перейдите в «Сетевая игра».</li>
                  <li>Нажмите «Добавить сервер».</li>
                  <li>Вставьте адрес <b>elysiumjava.ru</b>.</li>
                </ol>

                <div class="start-actions">
                  <button class="main-btn green" type="button" data-copy="elysiumjava.ru">Скопировать IP</button>
                  <button class="main-btn secondary" type="button" data-target="java-rules">Правила Java →</button>
                </div>
              </article>

              <article class="connect-card bedrock">
                <div class="icon">🟩</div>
                <h2>Bedrock Edition</h2>
                <p>Bedrock-направление пока готовится. Адрес и порт будут указаны отдельно.</p>

                <div class="server-box">
                  <div class="server-line">
                    <span>Адрес сервера</span>
                    <code class="masked">********</code>
                  </div>
                  <div class="server-line">
                    <span>Порт</span>
                    <code class="masked">*****</code>
                  </div>
                </div>

                <ol class="steps">
                  <li>Откройте Minecraft Bedrock Edition.</li>
                  <li>Перейдите в «Серверы».</li>
                  <li>Нажмите «Добавить сервер».</li>
                  <li>Введите адрес и порт, когда они появятся.</li>
                </ol>

                <div class="start-actions">
                  <button class="main-btn disabled" type="button" disabled>Скоро</button>
                  <button class="main-btn secondary" type="button" data-target="bedrock-rules">Правила Bedrock →</button>
                </div>
              </article>
            </div>

            <section class="start-note">
              <b>Подсказка:</b> если сайт открыт с телефона, IP можно скопировать кнопкой выше,
              а затем вставить его в поле адреса сервера в Minecraft. Для Bedrock порт обязателен,
              поэтому пока он скрыт до запуска направления.
            </section>

            <footer class="footer">
              <b>Elysium START</b> — Minecraft Server<br>
              © 2026 Elysium. Все права защищены.
            </footer>
          </section>
        </main>
      `;
    }

    function donateView() {
      return `
        <main id="donateView" class="view">
          <section class="site-page">
            <div class="back-row">
              <button class="back-btn" type="button" data-target="elysium">← На главную</button>
            </div>

            <section class="page-hero">
              <div>
                <div class="badge">💎 Поддержка проекта</div>
                <h1><span>Поддержать</span><br>Elysium</h1>
                <p class="lead">
                  Поддержка помогает оплачивать сервер, хостинг, развитие и техническую часть проекта.
                  Выберите удобный способ ниже.
                </p>
              </div>

              <aside class="hero-card">
                <h2>Важно</h2>
                <div class="notice">
                  Поддержка добровольная. Перед оплатой внимательно проверяйте ссылку и способ оплаты.
                  Все спорные вопросы лучше уточнять у администрации проекта.
                </div>
              </aside>
            </section>

            <div class="donate-grid">
              <article class="donate-card">
                <div class="icon">🛒</div>
                <h2>EasyDonate</h2>
                <p>
                  Основная страница доната. Подходит для покупки доступных товаров,
                  привилегий или поддержки через магазин сервера.
                </p>
                <a class="main-btn green" href="https://elys1um.easydonate.ru/" target="_blank" rel="noopener noreferrer" data-transfer-node="EasyDonate">
                  Открыть EasyDonate →
                </a>
              </article>

              <article class="donate-card">
                <div class="icon">⚡</div>
                <h2>Временный способ</h2>
                <p>
                  Дополнительный способ поддержки через DALink / DonationAlerts.
                  Можно использовать временно, если основной способ неудобен.
                </p>
                <a class="main-btn orange" href="https://dalink.to/elysiumjava" target="_blank" rel="noopener noreferrer" data-transfer-node="Альтернативная оплата">
                  Открыть DALink →
                </a>
              </article>
            </div>

            <section class="important">
              <h2>⚠ Безопасность</h2>
              <p>
                Используйте только официальные ссылки с этого сайта. Если кто-то отправляет другой адрес
                от имени проекта — лучше перепроверить у администрации.
              </p>
            </section>

            <footer class="footer">
              <b>Elysium Donate</b> — поддержка проекта<br>
              © 2026 Elysium. Все права защищены.<br>
              Копирование и использование материалов без разрешения запрещено.
            </footer>
          </section>
        </main>
      `;
    }

    function sectionView(key) {
      const s = sections[key];

      return `
        <main id="${escapeHTML(key)}View" class="view">
          <section class="rules-page">
            <div class="back-row">
              ${buttonsBlock(s.buttons)}
            </div>

            <section class="page-hero">
              <div>
                <h1><span>${escapeHTML(s.title)}</span><br>Правила сервера</h1>
                <p class="lead">${escapeHTML(s.lead)}</p>
              </div>

              <aside class="hero-card">
                <h2>Коротко о главном</h2>
                <div class="stats">
                  ${statsBlock(s.stats)}
                </div>
                <div class="notice">
                  Незнание правил не освобождает от ответственности. В спорных ситуациях окончательное слово остаётся за Администрацией.
                </div>
              </aside>
            </section>

            ${s.groups.map(groupBlock).join("")}

            <section class="important">
              <h2>⚠ Важно</h2>
              <p>${escapeHTML(s.important)}</p>
            </section>

            <footer class="footer">
              <b>${escapeHTML(s.title)}</b> — Minecraft Server<br>
              © 2026 Elysium. Все права защищены.<br>
              Копирование и использование материалов без разрешения запрещено.
            </footer>
          </section>
        </main>
      `;
    }

    const routeAliases = {
      "elysium": "elysium",
      "home": "elysium",
      "rules": "rules",
      "elysium-start": "start",
      "java-rules": "java",
      "bedrock-rules": "bedrock",
      "chat-rules": "chat",
      "java": "java",
      "bedrock": "bedrock",
      "chat": "chat",
      "donate": "donate",
      "support": "donate"
    };

    const routeHashes = {
      "elysium": "elysium",
      "rules": "rules",
      "start": "elysium-start",
      "java": "java-rules",
      "bedrock": "bedrock-rules",
      "chat": "chat-rules",
      "donate": "donate"
    };

    function normalizeRoute(target) {
      return routeAliases[String(target || "elysium").replace("#", "").toLowerCase()] || "elysium";
    }


    function initStaffCarousel() {
      document.querySelectorAll(".staff-carousel").forEach((carousel) => {
        if (carousel.dataset.dragReady === "true") return;
        carousel.dataset.dragReady = "true";

        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        carousel.addEventListener("pointerdown", (event) => {
          isDown = true;
          startX = event.clientX;
          scrollLeft = carousel.scrollLeft;
          carousel.classList.add("dragging");
          carousel.setPointerCapture(event.pointerId);
        });

        carousel.addEventListener("pointermove", (event) => {
          if (!isDown) return;
          const delta = event.clientX - startX;
          carousel.scrollLeft = scrollLeft - delta;
        });

        function stopDrag(event) {
          if (!isDown) return;
          isDown = false;
          carousel.classList.remove("dragging");

          try {
            carousel.releasePointerCapture(event.pointerId);
          } catch (error) {}
        }

        carousel.addEventListener("pointerup", stopDrag);
        carousel.addEventListener("pointercancel", stopDrag);
        carousel.addEventListener("pointerleave", stopDrag);
      });
    }




    function initIntroScrollLock() {
      if (window.__elysiumIntroScrollLockReady === true) return;
      window.__elysiumIntroScrollLockReady = true;

      const shouldBlock = () => document.body.classList.contains("homepage-intro-locked");

      const block = (event) => {
        if (!shouldBlock()) return;
        event.preventDefault();
      };

      window.addEventListener("wheel", block, { passive: false });
      window.addEventListener("touchmove", block, { passive: false });

      window.addEventListener("keydown", (event) => {
        if (!shouldBlock()) return;

        const blockedKeys = [
          "ArrowDown",
          "ArrowUp",
          "PageDown",
          "PageUp",
          "Home",
          "End",
          " "
        ];

        if (blockedKeys.includes(event.key)) {
          event.preventDefault();
        }
      }, { passive: false });
    }

    function markIntroButtonUsed(options = {}) {
      const view = document.querySelector("#elysiumView");
      const hero = view?.querySelector(".hero-front");
      const actions = view?.querySelector(".hero-actions");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const useGlitch = options.glitch === true && !reducedMotion && hero && window.__elysiumIntroUsed !== true;

      window.__elysiumIntroUsed = true;

      const finish = () => {
        document.body.classList.remove("homepage-intro-locked");
        view?.classList.remove("intro-scroll-locked");

        actions?.classList.add("intro-hidden");
        hero?.classList.remove("glitching");
        hero?.classList.add("intro-used");

        if (typeof options.after === "function") {
          options.after();
        }
      };

      if (!view) {
        finish();
        return;
      }

      if (useGlitch) {
        hero.classList.add("glitching");
        window.setTimeout(finish, 620);
        return;
      }

      finish();
    }

    function applyIntroButtonState() {
      const view = document.querySelector("#elysiumView");

      if (!view) {
        document.body.classList.remove("homepage-intro-locked");
        return;
      }

      if (window.__elysiumIntroUsed === true) {
        document.body.classList.remove("homepage-intro-locked");
        view.classList.remove("intro-scroll-locked");
        view.querySelector(".hero-actions")?.classList.add("intro-hidden");
        view.querySelector(".hero-front")?.classList.add("intro-used");
        return;
      }

      document.body.classList.add("homepage-intro-locked");
      view.classList.add("intro-scroll-locked");
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    function initHomepageMotion() {
      initIntroScrollLock();
      applyIntroButtonState();

      document.querySelectorAll("[data-scroll-target]").forEach((button) => {
        if (button.dataset.scrollReady === "true") return;
        button.dataset.scrollReady = "true";

        button.addEventListener("click", () => {
          const target = document.querySelector(button.dataset.scrollTarget);
          if (!target) return;

          markIntroButtonUsed({
            glitch: true,
            after: () => {
              target.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                block: "start"
              });
            }
          });
        });
      });

      const items = document.querySelectorAll("#elysiumView .home-card, #elysiumView .team-section, #elysiumView .staff-card");

      if (!items.length) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
        items.forEach((item) => item.classList.add("is-visible"));
        return;
      }

      items.forEach((item, index) => {
        item.classList.add("reveal-item");
        item.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
      });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px"
      });

      items.forEach((item) => observer.observe(item));
    }


    try {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
    } catch (error) {}

    window.__elysiumCurrentRoute = null;
    window.__elysiumRenderBusy = false;
    window.__elysiumRenderCooldownUntil = 0;

    function setRenderCooldown(ms = 520) {
      window.__elysiumRenderCooldownUntil = Date.now() + ms;

      document.querySelectorAll("[data-target]").forEach((button) => {
        button.classList.add("is-cooling");
        button.disabled = true;
      });

      window.setTimeout(() => {
        document.querySelectorAll("[data-target]").forEach((button) => {
          button.classList.remove("is-cooling");
          button.disabled = false;
        });
      }, ms);
    }





    function initPerformanceMode() {
      if (window.__elysiumPerformanceReady === true) return;
      window.__elysiumPerformanceReady = true;

      const params = new URLSearchParams(location.search);
      if (params.has("fullfx")) {
        document.body.classList.remove("low-power-mode");
        return;
      }

      const forcedLow = params.has("lowfx");
      const memory = navigator.deviceMemory || 8;
      const cores = navigator.hardwareConcurrency || 8;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

      const getGpuName = () => {
        try {
          const canvas = document.createElement("canvas");
          const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
          if (!gl) return "";
          const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
          if (!debugInfo) return "";
          return String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "").toLowerCase();
        } catch (error) {
          return "";
        }
      };

      const gpu = getGpuName();
      const weakGpuMarkers = ["radeon hd","radeon r2","radeon r3","radeon r4","radeon r5","intel hd graphics 2000","intel hd graphics 2500","intel hd graphics 3000","intel hd graphics 4000","intel hd graphics 4400","intel hd graphics 4600","mali-400","mali-450","mali-t720","mali-t760","adreno 3","adreno 4","powervr sgx"];
      const weakGpu = weakGpuMarkers.some((marker) => gpu.includes(marker));

      if (forcedLow || reducedMotion || weakGpu || memory <= 4 || cores <= 4 || coarsePointer) {
        document.body.classList.add("low-power-mode");
      }
    }

    function initExternalTransfer() {
      document.querySelectorAll("[data-transfer-node]").forEach((link) => {
        if (link.dataset.transferReady === "true") return;
        link.dataset.transferReady = "true";

        link.addEventListener("click", (event) => {
          event.preventDefault();
          const href = link.getAttribute("href");
          if (!href) return;
          runExternalTransfer(href, link.dataset.transferNode || "External Node");
        });
      });
    }

    function runExternalTransfer(url, nodeName) {
      let screen = document.querySelector(".transfer-screen");

      if (!screen) {
        screen = document.createElement("div");
        screen.className = "transfer-screen";
        screen.innerHTML = `
          <div class="transfer-box" role="dialog" aria-modal="true" aria-label="Переход на внешний узел">
            <div class="transfer-head">
              <div class="transfer-title">
                <b>ELYSIUM TRANSFER NODE</b>
                <span>Внешний маршрут оплаты</span>
              </div>
              <div class="transfer-status"><span class="loader"></span></div>
            </div>
            <div class="transfer-body">
              <div class="transfer-node">
                <span>Целевой узел</span>
                <code class="transfer-url"></code>
              </div>
              <div class="transfer-lines">
                <div class="transfer-line" data-step="0">&gt; подготовка защищённого перехода...</div>
                <div class="transfer-line" data-step="1">&gt; проверка узла оплаты...</div>
                <div class="transfer-line" data-step="2">&gt; маршрут подтверждён ✓</div>
                <div class="transfer-line" data-step="3">&gt; выполняется перемещение...</div>
              </div>
              <div class="transfer-progress"><span></span></div>
              <button class="transfer-cancel" type="button">Отменить переход</button>
            </div>
          </div>
        `;
        document.body.appendChild(screen);
      }

      const status = screen.querySelector(".transfer-status");
      const urlBox = screen.querySelector(".transfer-url");
      const progress = screen.querySelector(".transfer-progress span");
      const cancel = screen.querySelector(".transfer-cancel");
      const lines = Array.from(screen.querySelectorAll(".transfer-line"));

      let cancelled = false;
      let timers = [];
      const cleanupTimers = () => {
        timers.forEach((timer) => window.clearTimeout(timer));
        timers = [];
      };
      const close = () => {
        cancelled = true;
        cleanupTimers();
        screen.classList.remove("active");
      };

      cancel.onclick = close;
      urlBox.textContent = nodeName;
      progress.style.width = "0%";
      status.className = "transfer-status";
      status.innerHTML = '<span class="loader"></span>';
      lines.forEach((line) => line.classList.remove("active", "ok"));
      screen.classList.add("active");

      [
        { delay: 130, width: "23%", index: 0 },
        { delay: 620, width: "52%", index: 1 },
        { delay: 1120, width: "78%", index: 2, ok: true },
        { delay: 1540, width: "100%", index: 3 }
      ].forEach((step) => {
        timers.push(window.setTimeout(() => {
          if (cancelled) return;
          lines[step.index]?.classList.add("active");
          if (step.ok) {
            lines[step.index]?.classList.add("ok");
            status.className = "transfer-status ok";
            status.innerHTML = "✓";
          }
          progress.style.width = step.width;
        }, step.delay));
      });

      timers.push(window.setTimeout(() => {
        if (cancelled) return;
        const opened = window.open(url, "_blank", "noopener,noreferrer");
        if (!opened) {
          location.href = url;
          return;
        }
        screen.classList.remove("active");
      }, 2050));
    }

    function initAmbientEffects(routeKey) {
      const isAmbientRoute = routeKey === "elysium" || routeKey === "start";
      document.body.classList.toggle("ambient-route", isAmbientRoute);

      if (!isAmbientRoute || window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      let glow = document.querySelector(".cursor-glow");

      if (!glow) {
        glow = document.createElement("div");
        glow.className = "cursor-glow";
        document.body.appendChild(glow);
      }

      if (window.__elysiumGlowReady === true) return;
      window.__elysiumGlowReady = true;

      let raf = 0;
      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;

      const update = () => {
        raf = 0;
        document.documentElement.style.setProperty("--glow-x", x + "px");
        document.documentElement.style.setProperty("--glow-y", y + "px");
      };

      window.addEventListener("pointermove", (event) => {
        if (!document.body.classList.contains("ambient-route")) return;

        x = event.clientX;
        y = event.clientY;

        if (!raf) {
          raf = window.requestAnimationFrame(update);
        }
      }, { passive: true });
    }

    function initCopyButtons() {
      document.querySelectorAll("[data-copy]").forEach((button) => {
        if (button.dataset.copyReady === "true") return;
        button.dataset.copyReady = "true";

        const originalText = button.textContent;

        button.addEventListener("click", async () => {
          const value = button.dataset.copy || "";
          if (!value) return;

          try {
            if (navigator.clipboard && window.isSecureContext) {
              await navigator.clipboard.writeText(value);
            } else {
              const textarea = document.createElement("textarea");
              textarea.value = value;
              textarea.setAttribute("readonly", "");
              textarea.style.position = "fixed";
              textarea.style.left = "-9999px";
              document.body.appendChild(textarea);
              textarea.select();
              document.execCommand("copy");
              textarea.remove();
            }

            button.textContent = "Скопировано ✓";
            showCopyToast("IP скопирован: " + value);

            window.setTimeout(() => {
              button.textContent = originalText;
            }, 1400);
          } catch (error) {
            button.textContent = "Не скопировалось";
            showCopyToast("Не удалось скопировать автоматически");

            window.setTimeout(() => {
              button.textContent = originalText;
            }, 1400);
          }
        });
      });
    }

    function showCopyToast(text) {
      let toast = document.querySelector(".copy-toast");

      if (!toast) {
        toast = document.createElement("div");
        toast.className = "copy-toast";
        document.body.appendChild(toast);
      }

      toast.textContent = text;
      toast.classList.add("show");

      window.clearTimeout(window.__elysiumCopyToastTimer);
      window.__elysiumCopyToastTimer = window.setTimeout(() => {
        toast.classList.remove("show");
      }, 1600);
    }

    function render(target, updateHash = true, options = {}) {
      initPerformanceMode();
      const key = normalizeRoute(target);
      const now = Date.now();

      if (window.__elysiumRenderBusy === true) return;

      if (!options.force && now < window.__elysiumRenderCooldownUntil) return;

      if (!options.force && updateHash && key === window.__elysiumCurrentRoute) {
        setRenderCooldown(420);
        return;
      }

      window.__elysiumRenderBusy = true;
      setRenderCooldown(options.initial === true ? 260 : 520);

      document.body.classList.remove("homepage-intro-locked");

      if (key === "elysium") {
        app.innerHTML = elysiumView();
      } else if (key === "rules") {
        app.innerHTML = rulesView();
      } else if (key === "start") {
        app.innerHTML = startView();
      } else if (key === "donate") {
        app.innerHTML = donateView();
      } else {
        app.innerHTML = sectionView(key);
      }

      window.__elysiumCurrentRoute = key;

      document.querySelectorAll("[data-target]").forEach((button) => {
        button.addEventListener("click", (event) => {
          event.preventDefault();
          render(button.dataset.target);
        });
      });

      initHomepageMotion();
      initCopyButtons();
      initAmbientEffects(key);
      initExternalTransfer();

      if (updateHash) {
        const nextHash = "#" + routeHashes[key];

        if (location.hash !== nextHash) {
          history.pushState(null, "", nextHash);
        }
      }

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: options.initial === true ? "auto" : "smooth"
      });

      window.setTimeout(() => {
        window.__elysiumRenderBusy = false;
      }, 90);
    }

    function fromHash() {
      const hash = location.hash.replace("#", "").toLowerCase();
      return normalizeRoute(hash || "elysium");
    }

    initPerformanceMode();

    window.addEventListener("popstate", () => render(fromHash(), false, { force: true }));

    window.addEventListener("pageshow", () => {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
    });

    render(fromHash(), false, { initial: true, force: true });
