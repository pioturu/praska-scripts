/* PRASKA — swatch enhancement dla Nooko. Ten plik zyje na GitHub Gist,
   nie w polu Custom JS Shopera (ktore okazalo sie cache'owac tresc
   osobno per wersja jezykowa strony). Edytuj TEN plik, zeby zaktualizowac
   dzialanie na WSZYSTKICH jezykach naraz. */

(function(){
  var css = "/* PRASKA — style dla próbek wariantów na nowym szablonie (Nooko) */\n.psw-root{ margin:1.5rem 0; font-family:'Source Sans 3',sans-serif; color:#3D3A35; }\n.psw-root .psw-group{ margin-bottom:1.8rem; }\n.psw-root .psw-label{ font-size:.78rem; letter-spacing:.06em; text-transform:uppercase; margin-bottom:.8rem; display:flex; justify-content:space-between; gap:1rem; }\n.psw-root .psw-label b{ text-transform:none; letter-spacing:0; color:#6B7B5A; font-weight:600; }\n:where(.psw-req){ color:#B3453A; font-weight:600; } /* fallback gdyby .color-primary-500 nie było zdefiniowane globalnie — :where() zeruje specyficzność, więc realny kolor marki (jeśli istnieje) i tak wygrywa */\n\n.psw-root .psw-tabs{ display:flex; overflow-x:auto; -webkit-overflow-scrolling:touch; border:1px solid #EAE5DC; width:max-content; max-width:100%; margin-bottom:1rem; }\n.psw-root .psw-tabs button{ flex:none; background:none; border:none; padding:.65rem 1.2rem; font-size:.85rem; font-family:inherit; cursor:pointer; opacity:.5; transition:all .25s ease; border-radius:0 !important; white-space:nowrap; }\n.psw-root .psw-tabs button.active{ background:#F5F0E8; opacity:1; }\n\n.psw-root .psw-row{ display:flex; gap:.8rem; flex-wrap:wrap; }\n.psw-root .psw-item{ display:flex; flex-direction:column; align-items:center; width:64px; }\n.psw-root .psw-swatch{\n  width:55px; height:55px; border:1px solid #EAE5DC; padding:0; cursor:pointer;\n  position:relative; border-radius:0 !important; overflow:hidden; transition:transform .2s ease;\n  background:#C9C2B4;\n}\n.psw-root .psw-swatch:hover{ transform:translateY(-2px); }\n.psw-root .psw-swatch.active{ outline:2px solid #3D3A35; outline-offset:2px; }\n.psw-root .psw-swatch img{ width:100%; height:100%; object-fit:cover; display:block; }\n.psw-root .psw-cap{ font-size:.62rem; text-align:center; margin-top:.35rem; color:#7A6552; line-height:1.15; }\n\n.psw-root .psw-chip{ background:none; border:1px solid #EAE5DC; padding:.6rem 1.2rem; font-size:.85rem; font-family:inherit; cursor:pointer; transition:all .25s ease; border-radius:0 !important; }\n.psw-root .psw-chip.active{ background:#6B7B5A; color:#F5F0E8; border-color:#6B7B5A; }\n\n.psw-root .psw-catalog{\n  display:inline-block; margin-top:1rem; font-size:.75rem; letter-spacing:.08em; text-transform:uppercase;\n  color:#6B7B5A; text-decoration:none; border-bottom:1px solid #8A9A7B; padding-bottom:2px;\n}\n.psw-root .psw-catalog:hover{ color:#3D3A35; border-color:#3D3A35; }\n\n/* hover-preview — tylko urządzenia z realną myszką */\n@media (hover:hover) and (pointer:fine){\n  #psw-preview{\n    position:fixed; z-index:9999; display:none; pointer-events:none;\n    background:#FDFBF7; border:1px solid #3D3A35; padding:1rem;\n    box-shadow:0 12px 28px -12px rgba(61,58,53,.35); align-items:center; gap:1rem; max-width:400px;\n  }\n  #psw-preview.show{ display:flex; }\n  #psw-preview .psw-preview-swatch{ width:125px; height:125px; flex:none; border:1px solid #EAE5DC; overflow:hidden; }\n  #psw-preview .psw-preview-swatch img{ width:100%; height:100%; object-fit:cover; }\n  #psw-preview .psw-preview-text{ font-size:.9rem; line-height:1.3; }\n  #psw-preview .psw-preview-family{ display:block; color:#6B7B5A; font-size:.7rem; letter-spacing:.06em; text-transform:uppercase; margin-bottom:.2rem; }\n}\n\n.psw-hidden-native{ position:absolute !important; width:1px !important; height:1px !important; overflow:hidden !important; clip:rect(0,0,0,0) !important; white-space:nowrap !important; }\n";
  if (!document.getElementById('psw-gist-style')){
    var st = document.createElement('style');
    st.id = 'psw-gist-style';
    st.textContent = css;
    document.head.appendChild(st);
  }
})();

/* PRASKA — próbki tkanin/kolorów dla NOWEGO SZABLONU (Nooko / h-select).

   BEZPIECZNIK KIERUNKOWY: ten skrypt jest napisany specjalnie pod Nooko
   i celowo NIC NIE ROBI na starym szablonie (obecna produkcja praska.shop).
   Jeśli kiedyś oba szablony będą działać równolegle, ten plik i
   "module41-JS.js" (stary szablon) mogą bezpiecznie siedzieć w tym samym
   globalnym polu Custom JS — każdy z nich sam rozpoznaje, gdzie jest,
   i odpala się tylko we właściwym miejscu.

   Mechanizm sterowania h-select zweryfikowany na żywo (klik w h-option
   realnie ustawia wartość i odświeża UI komponentu — potwierdzone
   dwukrotnie na produkcie HUGO na szablonie Nooko).

   Zdjęcia: URL liczy się algorytmicznie ze slugu nazwy opcji —
   potwierdzone na 34/34 realnych kolorach tkanin w sklepie. */
(function(){

  // BEZPIECZNIK 1: uruchom się WYŁĄCZNIE na Nooko (obecność h-select).
  // Stary szablon nie ma tego elementu — tam ten skrypt nic nie robi.
  // BEZPIECZNIK 1: uruchom się WYŁĄCZNIE na Nooko. Sprawdzamy obecność
  // faktycznych komponentów wariantów (select-variant-option LUB
  // radio-variant-option) — NIE samego <h-select>, bo ten może
  // pochodzić z zupełnie innego widgetu na stronie (np. przełącznika
  // waluty) i nie musi istnieć wcale, jeśli produkt ma WYŁĄCZNIE
  // opcje typu radio (np. tylko "Rozmiar" + "Futro", bez żadnego
  // select-variant-option) — dokładnie taki przypadek uciął tu
  // wcześniej całe działanie skryptu.
  if (!document.querySelector('select-variant-option, radio-variant-option')) return;

  // BEZPIECZNIK 2: wyłącznik testowy — dopóki nie dodasz ?pswtest=1 do
  // adresu, skrypt nic nie robi nawet na Nooko. Ustaw na false, gdy
  // Nooko wejdzie na produkcję i chcesz włączyć na stałe dla wszystkich.
  var ASSET_BASE = 'https://praska.shop/userdata/public/assets/warianty/';

  function slug(s){
    return String(s).toLowerCase()
      .replace(/ą/g,'a').replace(/ć/g,'c').replace(/ę/g,'e').replace(/ł/g,'l')
      .replace(/ń/g,'n').replace(/ó/g,'o').replace(/ś/g,'s').replace(/ź/g,'z').replace(/ż/g,'z')
      .replace(/\s+/g,'-').trim();
  }

  // Fabric (DOT/LINCOLN/RAFA/PATTERN) i sklejka mają czysto algorytmiczną
  // konwencję ze slugiem — różni je tylko podfolder. FUTRO ma odrębną,
  // dosłowną konwencję (WIELKIE LITERY, spacje, bez sluga), potwierdzoną
  // na 10/10 realnych kolorów w sklepie.
  function imgFor(groupLabel, value){
    if (/sklejk|plywood/i.test(groupLabel)) return ASSET_BASE + 'sklejka/' + slug(value) + '.jpg';
    if (/futr|\bfur\b/i.test(groupLabel)) return ASSET_BASE + encodeURIComponent(value) + '.jpg';
    return ASSET_BASE + slug(value) + '.jpg';
  }

  function combineLabel(family, text){
    if (!family) return text;
    // unikamy duplikacji, gdy nazwa koloru zaczyna się tym samym słowem
    // (słowami), którym kończy się nazwa rodziny — np. rodzina "FUTRO
    // FLUFFY" + kolor "FLUFFY MLECZNY" nie powinno dać "FLUFFY FLUFFY".
    var famWords = family.toUpperCase().split(/\s+/);
    var textWords = text.toUpperCase().split(/\s+/);
    var overlap = 0;
    for (var i = 1; i <= Math.min(famWords.length, textWords.length); i++){
      if (famWords.slice(-i).join(' ') === textWords.slice(0, i).join(' ')) overlap = i;
    }
    if (overlap > 0){
      var rest = text.split(/\s+/).slice(overlap).join(' ');
      return rest ? (family + ' ' + rest) : family;
    }
    return family + ' ' + text;
  }

  function isRequired(entries){
    return entries.some(function(e){
      return e.el.getAttribute('required') === 'true' || e.el.hasAttribute('requiredingroup');
    });
  }
  function labelHtml(text, required){
    return (required ? '<span class="color-primary-500 psw-req">*</span> ' : '') + text;
  }

  // ============================================================
  // TŁUMACZENIA WŁASNEGO TEKSTU SKRYPTU (placeholder, linki do katalogów).
  // To NIE dotyczy nazw opcji/kolorów ze Shopera (to osobna sprawa,
  // patrz komentarz przy klasyfikacji niżej) — tylko tekstu, który
  // sami generujemy.
  //
  // DOPISYWANIE NOWEGO JĘZYKA: dodaj jeden wpis niżej z kodem języka
  // (dokładnie taki, jaki zwraca document.documentElement.lang na danej
  // wersji strony — sprawdź w konsoli: document.documentElement.lang).
  // Nic więcej nie trzeba zmieniać — reszta kodu korzysta z t().
  // ============================================================
  var I18N = {
    pl: { choose: 'wybierz', showFabricCatalog: 'POKAŻ KATALOG TKANIN', showPlywoodCatalog: 'POKAŻ KATALOG SKLEJKI' },
    en: { choose: 'choose', showFabricCatalog: 'SHOW FABRIC CATALOG', showPlywoodCatalog: 'SHOW PLYWOOD CATALOG' },
    de: { choose: 'wählen', showFabricCatalog: 'STOFFKATALOG ANZEIGEN', showPlywoodCatalog: 'SPERRHOLZKATALOG ANZEIGEN' },
    fr: { choose: 'choisir', showFabricCatalog: 'VOIR LE CATALOGUE DE TISSUS', showPlywoodCatalog: 'VOIR LE CATALOGUE DE CONTREPLAQUÉ' },
    it: { choose: 'scegli', showFabricCatalog: 'MOSTRA CATALOGO TESSUTI', showPlywoodCatalog: 'MOSTRA CATALOGO COMPENSATO' },
    nl: { choose: 'kiezen', showFabricCatalog: 'TOON STOFFENCATALOGUS', showPlywoodCatalog: 'TOON MULTIPLEXCATALOGUS' },
    cs: { choose: 'vybrat', showFabricCatalog: 'ZOBRAZIT KATALOG LÁTEK', showPlywoodCatalog: 'ZOBRAZIT KATALOG PŘEKLIŽKY' }
    // UWAGA: kod czeskiego to "cs" (ISO 639-1 język), NIE "cz" (to kod
    // kraju) — document.documentElement.lang zwróci "cs", więc klucz
    // musi być "cs", inaczej wykrywanie po cichu spadnie na angielski.
  };

  var LOCALE = (function(){
    var htmlLang = (document.documentElement.lang || '').toLowerCase().split('-')[0];
    if (htmlLang) return htmlLang;
    var m = window.location.pathname.match(/^\/([a-z]{2})(_[A-Z]{2})?\//);
    return m ? m[1].toLowerCase() : 'pl';
  })();

  // Brak tłumaczenia dla wykrytego języka -> pokazujemy angielski
  // (zrozumiały szerzej niż polski dla obcojęzycznego klienta), a nie po cichu polski.
  function t(key){
    var dict = I18N[LOCALE] || I18N.en;
    return (dict && dict[key]) || I18N.en[key];
  }

  function familyFromLabel(label){
    return label.replace(/^\*?\s*(materia[lł]|tkanina|fabric|material)\s*/i, '').trim();
  }

  // Steruje realnym h-select przez symulację kliknięcia w prawdziwy
  // h-option (dokładnie to, co robi natywny mechanizm strony).
  function setHOption(name, value){
    var els = [...document.getElementsByName(name)];
    var content = els.find(function(e){ return e.tagName === 'H-DROPDOWN-CONTENT'; });
    var input = els.find(function(e){ return e.tagName === 'INPUT'; });
    if (!content) return;
    var opt = [...content.querySelectorAll('h-option')].find(function(o){
      return o.getAttribute('value') === String(value);
    });
    if (opt) opt.click();
    if (input) input.value = value;
  }

  var supportsHover = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var preview;
  function ensurePreview(){
    if (preview) return preview;
    preview = document.createElement('div');
    preview.id = 'psw-preview';
    preview.innerHTML = '<div class="psw-preview-swatch"></div><div class="psw-preview-text"><b class="psw-preview-family"></b><span class="psw-preview-name"></span></div>';
    document.body.appendChild(preview);
    return preview;
  }
  function showPreview(x, y, url, family, name){
    if (!supportsHover) return;
    var p = ensurePreview();
    p.querySelector('.psw-preview-swatch').innerHTML = url ? '<img src="'+url+'" alt="">' : '';
    p.querySelector('.psw-preview-family').textContent = family || '';
    p.querySelector('.psw-preview-name').textContent = name;
    p.style.left = Math.min(x+16, window.innerWidth-420) + 'px';
    p.style.top = Math.min(y+16, window.innerHeight-160) + 'px';
    p.classList.add('show');
  }
  function hidePreview(){ if (preview) preview.classList.remove('show'); }

  function init(){
    var wrappers = [...document.querySelectorAll('select-variant-option')];
    var radioWrappers = [...document.querySelectorAll('radio-variant-option')];
    var groups = { material: [], fur: [], plywood: [], side: [], size: [] };

    wrappers.forEach(function(w){
      var label = w.getAttribute('validation-name-label') || '';
      var hsel = w.querySelector('h-select');
      if (!hsel) return;
      var name = hsel.getAttribute('control-name');
      var entry = { kind: 'select', name: name, label: label, el: w };

      // UWAGA: Materiał i Futro to dwa NIEZALEŻNE wybory na stronie,
      // nie warianty tej samej rzeczy — renderujemy je jako dwie osobne
      // sekcje, każda z własnymi zakładkami i własnym "czyszczeniem".
      //
      // WAŻNE — DOPISYWANIE NOWEGO JĘZYKA (DE/FR/IT/NL/CZ...):
      // Te wzorce dopasowują się do treści `validation-name-label`
      // TAK JAK JEST w Shoperze — nie do aktywnego języka strony. Dopóki
      // Iza/Patryk nie wpiszą tłumaczenia nazwy grupy w Shoperze dla
      // nowego języka, tu nic nie trzeba zmieniać (rozpoznawanie i tak
      // zadziała, bo trafi na tę samą polską/angielską etykietę co dziś).
      // Dopiero GDY faktycznie pojawi się przetłumaczona etykieta
      // (np. niemieckie "Stoff"/"Fell"/"Sperrholz"/"Seite"/"Größe"),
      // dopisz odpowiednie słowo do właściwego wzorca poniżej —
      // te same 4 wzorce występują jeszcze raz kawałek niżej (dla
      // radio-variant-option) i w funkcji imgFor() na górze pliku —
      // zmieniaj wszystkie trzy miejsca razem.
      if (/futr|\bfur\b/i.test(label)) groups.fur.push(entry);
      else if (/tkanin|materia|fabric|material/i.test(label)) groups.material.push(entry);
      else if (/sklejk|plywood/i.test(label)) groups.plywood.push(entry);
      else if (/strona|\bside\b/i.test(label)) groups.side.push(entry);
      else if (/rozmiar|średnic|srednic|wymiar|\bsize\b/i.test(label)) groups.size.push(entry);
      else return; // nieznany typ opcji — zostawiamy nietknięty

      w.classList.add('psw-hidden-native');
    });

    // NOOKO: kolor sklejki/futra bywa osobnym komponentem radio-variant-option,
    // nie select-variant-option — to zwykłe <input type="radio"> w środku,
    // dużo prostsze w obsłudze (natywna wzajemna wyłączność grupy).
    radioWrappers.forEach(function(w){
      var label = w.getAttribute('validation-name-label') || '';
      var radios = [...w.querySelectorAll('input[type="radio"]')];
      if (!radios.length) return;
      var entry = { kind: 'radio', label: label, el: w, radios: radios };

      if (/sklejk|plywood/i.test(label)) groups.plywood.push(entry);
      else if (/futr|\bfur\b/i.test(label)) groups.fur.push(entry);
      else if (/tkanin|materia|fabric|material/i.test(label)) groups.material.push(entry);
      else if (/strona|\bside\b/i.test(label)) groups.side.push(entry);
      else if (/rozmiar|średnic|srednic|wymiar|\bsize\b/i.test(label)) groups.size.push(entry);
      else return;

      w.classList.add('psw-hidden-native');
    });

    if (!groups.material.length && !groups.fur.length && !groups.plywood.length && !groups.side.length && !groups.size.length) return;

    var root = document.createElement('div');
    root.className = 'psw-root';
    var missingImages = [];

    function optionsOf(entry){
      if (entry.kind === 'radio'){
        return entry.radios.map(function(input){
          var lab = document.querySelector('label[for="' + input.id + '"]');
          var nameNode = lab ? [...lab.childNodes].find(function(n){ return n.nodeType === 3 && n.textContent.trim(); }) : null;
          var name = nameNode ? nameNode.textContent.trim() : (lab ? lab.textContent.trim() : input.value);
          var priceEl = lab ? lab.querySelector('.color-neutral-700') : null;
          var price = priceEl ? priceEl.textContent.trim() : '';
          return { value: input.value, text: name, price: price, input: input };
        });
      }
      return [...entry.el.querySelectorAll('h-option')].filter(function(o){
        return o.getAttribute('value');
      }).map(function(o){
        return { value: o.getAttribute('value'), text: o.getAttribute('data-user-value') || o.textContent.trim() };
      });
    }

    function setEntryValue(entry, opt){
      if (entry.kind === 'radio'){
        if (opt && opt.input) opt.input.click();
        return;
      }
      setHOption(entry.name, opt && opt.value !== undefined ? opt.value : opt);
    }

    function makeSwatchItem(url, family, name, onClick){
      var item = document.createElement('div'); item.className = 'psw-item';
      var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'psw-swatch';
      var fullLabel = family ? (family + ' ' + name) : name;
      if (url){
        var img = document.createElement('img');
        img.src = url; img.alt = fullLabel;
        img.onerror = function(){ img.remove(); missingImages.push(fullLabel + '  ->  ' + url); };
        btn.appendChild(img);
      }
      btn.addEventListener('mouseenter', function(e){ showPreview(e.clientX, e.clientY, url, family, name); });
      btn.addEventListener('mousemove', function(e){ showPreview(e.clientX, e.clientY, url, family, name); });
      btn.addEventListener('mouseleave', hidePreview);
      btn.addEventListener('click', onClick.bind(item));
      var cap = document.createElement('div'); cap.className = 'psw-cap'; cap.textContent = fullLabel;
      item.appendChild(btn); item.appendChild(cap);
      return item;
    }

    // rozmiar / strona — proste chipy tekstowe, bez zdjęć
    function addCatalogLink(wrap, url, key){
      var a = document.createElement('a');
      a.className = 'psw-catalog';
      a.href = url; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = t(key);
      wrap.appendChild(a);
    }

    ['side', 'size'].forEach(function(t){
      groups[t].forEach(function(g){
        var wrap = document.createElement('div'); wrap.className = 'psw-group';
        wrap.innerHTML = '<div class="psw-label"><span>' + labelHtml(g.label, isRequired([g])) + '</span></div>';
        var row = document.createElement('div'); row.className = 'psw-row';
        optionsOf(g).forEach(function(o){
          var chip = document.createElement('button');
          chip.type = 'button'; chip.className = 'psw-chip';
          chip.textContent = o.price ? (o.text + ' ' + o.price) : o.text;
          chip.addEventListener('click', function(){
            setEntryValue(g, o);
            row.querySelectorAll('.psw-chip').forEach(function(c){ c.classList.remove('active'); });
            chip.classList.add('active');
          });
          row.appendChild(chip);
        });
        wrap.appendChild(row); root.appendChild(wrap);
      });
    });

    // kolor sklejki — płaska siatka próbek, bez zakładek rodzin
    groups.plywood.forEach(function(g){
      var wrap = document.createElement('div'); wrap.className = 'psw-group';
      wrap.innerHTML = '<div class="psw-label"><span>' + labelHtml(g.label, isRequired([g])) + '</span></div>';
      var row = document.createElement('div'); row.className = 'psw-row';
      optionsOf(g).forEach(function(o){
        var caption = o.price ? (o.text + ' ' + o.price) : o.text;
        var item = makeSwatchItem(imgFor(g.label, o.text), null, caption, function(){
          setEntryValue(g, o);
          row.querySelectorAll('.psw-swatch').forEach(function(x){ x.classList.remove('active'); });
          this.querySelector('.psw-swatch').classList.add('active');
        });
        row.appendChild(item);
      });
      wrap.appendChild(row);
      addCatalogLink(wrap, 'https://catalogues.praska.shop/plywood-colours', 'showPlywoodCatalog');
      root.appendChild(wrap);
    });

    // Materiał i Futro — dwie NIEZALEŻNE sekcje. Ta sama logika renderowania
    // (zakładki rodzin, jeśli grupa ma więcej niż jeden komponent), ale
    // każda sekcja ma własne "czyszczenie" — wybór w jednej nie rusza drugiej.
    function renderTabbedSection(entries, fallbackHeading, catalogUrl){
      if (!entries.length) return;
      var wrap = document.createElement('div'); wrap.className = 'psw-group';
      var labelEl = document.createElement('div'); labelEl.className = 'psw-label';
      var groupHeading = entries.length === 1
        ? entries[0].label
        : ((entries[0].label.match(/tkanina|materia[lł]|fabric|material/i) || [fallbackHeading])[0]);
      // UWAGA: przy kilku alternatywnych rodzinach (DOT/LINCOLN/RAFA/PATTERN)
      // żaden pojedynczy select nie nosi atrybutu required — mimo że sam
      // wybór "któregoś z nich" jest obowiązkowy. Traktujemy więc grupę
      // z więcej niż jedną rodziną jako wymaganą z definicji; dla
      // pojedynczego komponentu (np. samo FUTRO) ufamy realnemu atrybutowi.
      var required = entries.length > 1 ? true : isRequired(entries);
      labelEl.innerHTML = '<span>' + labelHtml(groupHeading, required) + '</span><b class="psw-sel">' + t('choose') + '</b>';
      wrap.appendChild(labelEl);

      var tabsEl = document.createElement('div'); tabsEl.className = 'psw-tabs';
      var rowEl = document.createElement('div'); rowEl.className = 'psw-row';
      var families = entries.map(function(g){ return { name: familyFromLabel(g.label) || g.label, entry: g }; });

      function clearOthers(exceptEntry){
        entries.forEach(function(g){
          if (g === exceptEntry) return;
          if (g.kind === 'select') setHOption(g.name, '');
        });
      }

      function renderFamily(fam){
        rowEl.innerHTML = '';
        optionsOf(fam.entry).forEach(function(o){
          var url = imgFor(fam.name, o.text);
          var baseLabel = combineLabel(fam.name, o.text);
          var fullLabel = o.price ? (baseLabel + ' ' + o.price) : baseLabel;
          var item = makeSwatchItem(url, null, fullLabel, function(){
            clearOthers(fam.entry);
            setEntryValue(fam.entry, o);
            rowEl.querySelectorAll('.psw-swatch').forEach(function(x){ x.classList.remove('active'); });
            item.querySelector('.psw-swatch').classList.add('active');
            wrap.querySelector('.psw-sel').textContent = fullLabel;
          });
          rowEl.appendChild(item);
        });
      }

      families.forEach(function(fam, i){
        var t = document.createElement('button'); t.type = 'button'; t.textContent = fam.name;
        if (i === 0) t.classList.add('active');
        t.addEventListener('click', function(){
          tabsEl.querySelectorAll('button').forEach(function(b){ b.classList.remove('active'); });
          t.classList.add('active');
          renderFamily(fam);
        });
        tabsEl.appendChild(t);
      });
      if (families.length > 1) wrap.appendChild(tabsEl);
      wrap.appendChild(rowEl);
      if (catalogUrl) addCatalogLink(wrap, catalogUrl, 'showFabricCatalog');
      root.appendChild(wrap);
      if (families.length) renderFamily(families[0]);
    }

    renderTabbedSection(groups.material, 'Materiał', 'https://catalogues.praska.shop/collections-fabrics');
    renderTabbedSection(groups.fur, 'Futro');

    var allEntries = groups.material.concat(groups.fur, groups.plywood, groups.side, groups.size);
    var anchor = allEntries[0].el;
    anchor.parentElement.insertBefore(root, anchor);

    if (missingImages.length){
      console.warn('[PRASKA swatch] Brak zdjęcia dla ' + missingImages.length + ' wariantów (widoczny placeholder):\n' + missingImages.join('\n'));
    }
  }

  if (document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', maybeRebuild); }
  else { maybeRebuild(); }

  // Siatka bezpieczeństwa: różne komponenty wariantów (strona/rozmiar/
  // tkanina/sklejka) mogą wyrenderować się w DOM w różnym czasie — np.
  // sklejka bywa dorenderowana z opóźnieniem względem reszty. Zamiast
  // sprawdzać tylko „czy .psw-root już istnieje" (co przestawało działać,
  // gdy TYLKO CZĘŚĆ komponentów była gotowa przy pierwszym uruchomieniu),
  // porównujemy sygnaturę realnie obecnych komponentów i przebudowujemy
  // panel za każdym razem, gdy się zmieni — ignorując niezwiązane zmiany
  // na stronie (np. licznik promocji, czat).
  var lastSignature = null;
  function computeSignature(){
    var all = [...document.querySelectorAll('select-variant-option, radio-variant-option')];
    return all.map(function(w){
      var isSelect = !!w.querySelector('h-select');
      return w.getAttribute('validation-name-label') + ':' + (isSelect ? 'select' : w.querySelectorAll('input[type="radio"]').length);
    }).join('|');
  }
  function maybeRebuild(){
    var sig = computeSignature();
    if (sig === lastSignature) return; // nic się nie zmieniło — nie przebudowujemy bez potrzeby
    lastSignature = sig;
    document.querySelectorAll('.psw-root').forEach(function(r){ r.remove(); });
    init();
  }
  var debounceTimer;
  var pswObserver = new MutationObserver(function(){
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(maybeRebuild, 200);
  });
  pswObserver.observe(document.body, { childList: true, subtree: true });
})();
