'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const dictionaries = {
    ru: ['Ещё больше возможностей','Язык лаборатории','Переводится этот дополнительный раздел. Исходные страницы проекта остаются на английском.','О PixelForge','Мы вместе изучаем игры.','Читать дальше','Наша команда делится стратегиями, строит миры и помогает новичкам найти приключение.','Ваше приветствие','Имя игрока','Поприветствовать','Показать время','Факты об играх','Загрузить случайный факт','Новости команды','Загрузить ещё','Демо асинхронной формы','Публичный тестовый API JSONPlaceholder. Используйте выдуманные данные. Демо POST не отправляет письмо и не сохраняет сообщение.','Сообщение','Отправить демо','Сбросить'],
    kk: ['Ойын мүмкіндіктері','Зертхана тілі','Осы қосымша бөлім аударылады. Жобаның бастапқы беттері ағылшын тілінде қалады.','PixelForge туралы','Біз ойындарды бірге зерттейміз.','Толығырақ','Біздің топ стратегиялармен бөліседі, әлемдер құрады және жаңа ойыншыларға көмектеседі.','Сәлемдесу','Ойыншы аты','Сәлемдесу','Уақытты көрсету','Ойын деректері','Кездейсоқ деректі жүктеу','Топ жаңалықтары','Тағы жүктеу','Асинхронды форма үлгісі','JSONPlaceholder ашық тест API қызметі. Ойдан шығарылған деректерді қолданыңыз. Демо POST хат жібермейді және хабарламаны сақтамайды.','Хабарлама','Демо жіберу','Тазарту']
  };
  const keys = ['title','language','languageNote','story','intro','read','detail','welcome','name','greet','clock','facts','fact','news','load','contact','demo','message','send','reset'];
  const english = {};
  document.querySelectorAll('[data-i18n]').forEach(el => { english[el.dataset.i18n] = el.textContent; });
  $('language').addEventListener('change', event => {
    let dictionary;
    // All three languages use an explicit switch, as required by the language option.
    switch (event.target.value) {
      case 'ru': dictionary = Object.fromEntries(keys.map((key,i) => [key,dictionaries.ru[i]])); break;
      case 'kk': dictionary = Object.fromEntries(keys.map((key,i) => [key,dictionaries.kk[i]])); break;
      default: dictionary = english;
    }
    $('extra-lab').lang = event.target.value;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = dictionary[el.dataset.i18n]; });
  });
  $('read-more').addEventListener('click', () => {
    const expanded = $('read-more').getAttribute('aria-expanded') !== 'true';
    $('more-story').hidden = !expanded;
    $('more-story').style.display = expanded ? 'block' : 'none';
    $('read-more').setAttribute('aria-expanded', String(expanded));
  });
  function timeGreeting(hour) {
    switch (true) {
      case hour < 12: return 'Good morning';
      case hour < 18: return 'Good afternoon';
      default: return 'Good evening';
    }
  }
  $('greeting-form').addEventListener('submit', event => {
    event.preventDefault();
    const name = $('greeting-name').value.trim();
    $('personal-greeting').textContent = name ? `${timeGreeting(new Date().getHours())}, ${name}!` : 'Please enter a player name.';
  });
  $('show-time').addEventListener('click', () => { $('time-result').textContent = new Date().toLocaleTimeString(); });
  async function getJSON(url, options = {}) {
    const response = await fetch(url, {...options, signal: AbortSignal.timeout(10000)});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }
  let previousFact = -1;
  $('fetch-fact').addEventListener('click', async () => {
    $('fetch-fact').disabled = true;
    $('fact-result').textContent = 'Loading…';
    try {
      const facts = await getJSON('data/facts.json');
      let index = Math.floor(Math.random() * facts.length);
      if (index === previousFact) index = (index + 1) % facts.length;
      previousFact = index;
      $('fact-result').textContent = facts[index];
    } catch { $('fact-result').textContent = 'Could not load facts. Run the local HTTP server and try again.'; }
    finally { $('fetch-fact').disabled = false; }
  });
  let posts = [], category = 'all';
  function renderNews() {
    let visible;
    switch (category) {
      case 'games': visible = posts.filter(post => post.category === 'games'); break;
      case 'tech': visible = posts.filter(post => post.category === 'tech'); break;
      default: visible = posts;
    }
    $('news-feed').replaceChildren();
    for (const post of visible) {
      const article = document.createElement('article');
      const heading = document.createElement('h4');
      const body = document.createElement('p');
      heading.textContent = post.title;
      body.textContent = post.body;
      article.append(heading,body);
      $('news-feed').append(article);
    }
    $('news-status').textContent = `${visible.length} posts shown.`;
    document.querySelectorAll('[data-feed]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.feed === category)));
  }
  document.querySelectorAll('[data-feed]').forEach(button => button.addEventListener('click', () => { category = button.dataset.feed; renderNews(); }));
  $('load-posts').addEventListener('click', async () => {
    $('load-posts').disabled = true;
    $('news-status').textContent = 'Loading…';
    try {
      const allPosts = await getJSON('data/posts.json');
      posts = allPosts.slice(0,posts.length + 2);
      renderNews();
      if (posts.length === allPosts.length) $('load-posts').textContent = 'All posts loaded';
      else $('load-posts').disabled = false;
    } catch { $('news-status').textContent = 'Could not load posts. Start the HTTP server and retry.'; $('load-posts').disabled = false; }
  });
  function contactCallback(error, data) {
    $('contact-feedback').textContent = error ? 'Request failed. Check your connection and try again. No success was confirmed.' : `Demo POST accepted (ID ${data.id}). No email was sent; the test API does not persist this message.`;
  }
  $('async-contact').addEventListener('submit', async event => {
    event.preventDefault();
    if (!$('async-name').value.trim() || $('async-message').value.trim().length < 5) {
      $('contact-feedback').textContent = 'Enter a name and a message of at least 5 non-edge-space characters.';
      return;
    }
    const buttons = $('async-contact').querySelectorAll('button');
    buttons.forEach(button => { button.disabled = true; });
    $('contact-feedback').textContent = 'Sending demo…';
    try {
      const result = await getJSON('https://jsonplaceholder.typicode.com/posts', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:$('async-name').value.trim(),body:$('async-message').value.trim(),userId:1})});
      contactCallback(null,result);
    } catch (error) { contactCallback(error); }
    finally { buttons.forEach(button => { button.disabled = false; }); }
  });
  $('reset-contact').addEventListener('click', () => {
    $('async-contact').reset();
    $('async-contact').querySelectorAll('input,textarea').forEach(input => { input.value = ''; });
    $('contact-feedback').textContent = 'Form cleared.';
  });
})();
