/* PRASKA — swatch enhancement dla Nooko, wersja jako natywny moduł Shoper
   (Twig + JS + Konfiguracja JSON + Tłumaczenia JSON), zamiast zewnętrznego
   loadera. Ten plik wklej w pole "JS" nowego modułu własnego. */

(function(){
  var css = "/* PRASKA — style dla próbek wariantów na nowym szablonie (Nooko) */\n.psw-root{ margin:1.5rem 0; font-family:'Source Sans 3',sans-serif; color:#3D3A35; }\n.psw-root .psw-group{ margin-bottom:1.8rem; }\n.psw-root .psw-label{ font-size:.78rem; letter-spacing:.06em; text-transform:uppercase; margin-bottom:.8rem; display:flex; justify-content:space-between; gap:1rem; }\n.psw-root .psw-label b{ text-transform:none; letter-spacing:0; color:#6B7B5A; font-weight:600; }\n:where(.psw-req){ color:#B3453A; font-weight:600; }\n\n.psw-root .psw-tabs{ display:flex; overflow-x:auto; -webkit-overflow-scrolling:touch; border:1px solid #EAE5DC; width:max-content; max-width:100%; margin-bottom:1rem; }\n.psw-root .psw-tabs button{ flex:none; background:none; border:none; padding:.65rem 1.2rem; font-size:.85rem; font-family:inherit; cursor:pointer; opacity:.5; transition:all .25s ease; border-radius:0 !important; white-space:nowrap; }\n.psw-root .psw-tabs button.active{ background:#F5F0E8; opacity:1; }\n\n.psw-root .psw-row{ display:flex; gap:.8rem; flex-wrap:wrap; }\n.psw-root .psw-item{ display:flex; flex-direction:column; align-items:center; width:64px; }\n.psw-root .psw-swatch{\n  width:55px; height:55px; border:1px solid #EAE5DC; padding:0; cursor:pointer;\n  position:relative; border-radius:0 !important; overflow:hidden; transition:transform .2s ease;\n  background:#C9C2B4;\n}\n.psw-root .psw-swatch:hover{ transform:translateY(-2px); }\n.psw-root .psw-swatch.active{ outline:2px solid #3D3A35; outline-offset:2px; }\n.psw-root .psw-swatch img{ width:100%; height:100%; object-fit:cover; display:block; }\n.psw-root .psw-cap{ font-size:.62rem; text-align:center; margin-top:.35rem; color:#7A6552; line-height:1.15; }\n\n.psw-root .psw-chip{ background:none; border:1px solid #EAE5DC; padding:.6rem 1.2rem; font-size:.85rem; font-family:inherit; cursor:pointer; transition:all .25s ease; border-radius:0 !important; }\n.psw-root .psw-chip.active{ background:#6B7B5A; color:#F5F0E8; border-color:#6B7B5A; }\n\n.psw-root .psw-catalog{\n  display:inline-block; margin-top:1rem; font-size:.75rem; letter-spacing:.08em; text-transform:uppercase;\n  color:#6B7B5A; text-decoration:none; border-bottom:1px solid #8A9A7B; padding-bottom:2px;\n}\n.psw-root .psw-catalog:hover{ color:#3D3A35; border-color:#3D3A35; }\n\n@media (hover:hover) and (pointer:fine){\n  #psw-preview{\n    position:fixed; z-index:9999; display:none; pointer-events:none;\n    background:#FDFBF7; border:1px solid #3D3A35; padding:1rem;\n    box-shadow:0 12px 28px -12px rgba(61,58,53,.35); align-items:center; gap:1rem; max-width:400px;\n  }\n  #psw-preview.show{ display:flex; }\n  #psw-preview .psw-preview-swatch{ width:125px; height:125px; flex:none; border:1px solid #EAE5DC; overflow:hidden; }\n  #psw-preview .psw-preview-swatch img{ width:100%; height:100%; object-fit:cover; }\n  #psw-preview .psw-preview-text{ font-size:.9rem; line-height:1.3; }\n  #psw-preview .psw-preview-family{ display:block; color:#6B7B5A; font-size:.7rem; letter-spacing:.06em; text-transform:uppercase; margin-bottom:.2rem; }\n}\n\n.psw-hidden-native{ position:absolute !important; width:1px !important; height:1px !important; overflow:hidden !important; clip:rect(0,0,0,0) !important; white-space:nowrap !important; }\n\n.psw-group.psw-missing{ outline:2px solid #B3453A; outline-offset:6px; transition:outline-color .3s ease; }\n";
  if (!document.getElementById('psw-module-style')){
    var st = document.createElement('style');
    st.id = 'psw-module-style';
    st.textContent = css;
    document.head.appendChild(st);
  }
})();

(function(){

  if (!document.querySelector('select-variant-option, radio-variant-option')) return;

  var ASSET_BASE = 'https://praska.shop/userdata/public/assets/warianty/';

  var IMG_EXTENSIONS = ['jpg', 'jpeg'];

  // ============================================================
  // MAPA option-id -> rola pola.
  //
  // Potwierdzone na żywo (DE/FR/PL/EN): 143, 135, 162, 57, 107.
  // Potwierdzone z tabeli tłumaczeń "A. Labels": 109 (ALOVA), 64
  // (ROZMIAR/SIZE/GRÖSSE), 124 (ŚREDNICA/DIAMETER), 131 (Wymiary/
  // DIMENSIONS), 165 (DŁUGOŚĆ MOSTKA/BRIDGE LENGTH), 149 (Strona
  // lewa lub prawa/LEFT OR RIGHT SIDE).
  //
  // Pola futra — pięć różnych option-id, wszystkie role:'fur', BEZ
  // klucza "family" (Peter: pokazuj surową przetłumaczoną etykietę
  // pola, nie stałe słowo):
  //   123 KOLOR FUTRA / FUR COLOR          — Grupa 21 (MATERIAŁ, admin)
  //   141 FUTRO SZEROKIE PASY / FUR WIDE STRIPES — Grupa 21 (MATERIAŁ, admin)
  //   142 FUTRO / FUR                       — Grupa 32
  //   152 FUTRO / FUR                       — Grupa 35 (SKLEJKA+FUTRO,
  //       tylko admin-side grupowanie; sama opcja to zwykłe pole futra,
  //       bez specjalnej struktury łączonej)
  //   166 FUTRO FLUFFY / FLUFFY FUR         — Grupa 36
  // "Grupa" to wewnętrzna kategoria Shopera do organizacji opcji w
  // panelu admina — nie wpływa na to, jak pole renderuje się na
  // froncie, więc nie ma odzwierciedlenia w kodzie.
  //
  // NIE zmapowane celowo — brak istniejącej "role" dla nich, czekają
  // na decyzję/próbkę:
  //   63  POCHYLNIA / RAMP
  //   75  KOLOR WEWNĄTRZ / INNER COLOR
  //   172 WZÓR / PATTERN — UWAGA: to INNY option-id niż 135
  //       "Materiał PATTERN", nie mylić.
  // ============================================================
  var OPTION_ID_MAP = {
    '143': { role: 'plywood' },
    '135': { role: 'material', family: 'PATTERN' },
    '162': { role: 'material', family: 'DOT' },
    '57':  { role: 'material', family: 'LINCOLN' },
    '107': { role: 'material', family: 'RAFA' },
    '109': { role: 'material', family: 'ALOVA' },
    '64':  { role: 'size' },
    '124': { role: 'size' },
    '131': { role: 'size' },
    '165': { role: 'size' },
    '149': { role: 'side' },
    '123': { role: 'fur' },
    '141': { role: 'fur' },
    '142': { role: 'fur' },
    '152': { role: 'fur' },
    '166': { role: 'fur' }
  };

  var FUR_VALUE_CANONICAL = {
    '524': 'écru',
    '525': 'black',
    '593': 'milky white',
    '617': 'cream 03',
    '618': 'chocolate 17',
    '619': 'khaki 37',
    '620': 'bottle green 39',
    '622': 'cinnamon 56',
    '624': 'turquoise 75',
    '628': 'grey 86',
    '629': 'graphite 90',
    '630': 'black 100',
    '849': 'milky white 01'
  };

  // Usuwa polskie znaki diakrytyczne NIEZALEŻNIE od wielkości liter
  // (celowo bez wymuszania case'u tutaj — to robi slugVariants niżej,
  // osobno dla wariantu małych i wielkich liter).
  function stripDiacritics(s){
    return String(s)
      .replace(/ą/g,'a').replace(/Ą/g,'A')
      .replace(/ć/g,'c').replace(/Ć/g,'C')
      .replace(/ę/g,'e').replace(/Ę/g,'E')
      .replace(/ł/g,'l').replace(/Ł/g,'L')
      .replace(/ń/g,'n').replace(/Ń/g,'N')
      .replace(/ó/g,'o').replace(/Ó/g,'O')
      .replace(/ś/g,'s').replace(/Ś/g,'S')
      .replace(/ź/g,'z').replace(/Ź/g,'Z')
      .replace(/ż/g,'z').replace(/Ż/g,'Z')
      .replace(/\s+/g,' ').trim();
  }

  // ============================================================
  // Repo assetów ma niespójne separatory ORAZ niespójną wielkość
  // liter w nazwach plików. Próbujemy kolejno: myślnik/podkreślnik/
  // spacja małymi literami (obecny standard, większość plików trafia
  // tu za pierwszym-trzecim razem) -> te same trzy separatory
  // WIELKIMI literami (rzadszy przypadek, świadomie na końcu — Peter
  // zaakceptował dodatkowe zapytania sieciowe jako koszt tego
  // podejścia). 6 wariantów nazwy x 2 rozszerzenia = do 12 prób,
  // zanim zdjęcie zostanie uznane za brakujące.
  // ============================================================
  function slugVariants(s){
    var stripped = stripDiacritics(s);
    var lower = stripped.toLowerCase();
    var upper = stripped.toUpperCase();
    var seps = ['-', '_', ' '];
    var variants = [];
    seps.forEach(function(sep){ variants.push(lower.replace(/\s+/g, sep)); });
    seps.forEach(function(sep){ variants.push(upper.replace(/\s+/g, sep)); });
    return variants;
  }

  // Zwraca WSZYSTKIE kandydujące URL-e bazowe (bez rozszerzenia).
  // Sklejka -> podfolder "sklejka/", futro -> podfolder "futra/"
  // (Peter przeniósł tam wszystkie grafiki futra, analogicznie do
  // sklejki), materiał -> bezpośrednio w ASSET_BASE.
  function imgBasesFor(role, value){
    var prefix = ASSET_BASE;
    if (role === 'plywood') prefix += 'sklejka/';
    else if (role === 'fur') prefix += 'futra/';
    return slugVariants(value).map(function(v){ return prefix + v; });
  }

  function combineLabel(family, text){
    if (!family) return text;
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

  function entryHasValue(entry){
    if (entry.kind === 'radio'){
      return entry.radios.some(function(r){ return r.checked; });
    }
    var els = [...document.getElementsByName(entry.name)];
    var input = els.find(function(e){ return e.tagName === 'INPUT'; });
    return !!(input && input.value);
  }
  var requiredChecks = [];

  var I18N_FALLBACK = {
    pl: { choose: 'wybierz', showFabricCatalog: 'POKAŻ KATALOG TKANIN', showPlywoodCatalog: 'POKAŻ KATALOG SKLEJKI', furHeading: 'Futro' },
    en: { choose: 'choose', showFabricCatalog: 'SHOW FABRIC CATALOG', showPlywoodCatalog: 'SHOW PLYWOOD CATALOG', furHeading: 'Fur' },
    de: { choose: 'wählen', showFabricCatalog: 'STOFFKATALOG ANZEIGEN', showPlywoodCatalog: 'SPERRHOLZKATALOG ANZEIGEN', furHeading: 'Fell' },
    fr: { choose: 'choisir', showFabricCatalog: 'VOIR LE CATALOGUE DE TISSUS', showPlywoodCatalog: 'VOIR LE CATALOGUE DE CONTREPLAQUÉ', furHeading: 'Fourrure' },
    it: { choose: 'scegli', showFabricCatalog: 'MOSTRA CATALOGO TESSUTI', showPlywoodCatalog: 'MOSTRA CATALOGO COMPENSATO', furHeading: 'Pelliccia' },
    nl: { choose: 'kiezen', showFabricCatalog: 'TOON STOFFENCATALOGUS', showPlywoodCatalog: 'TOON MULTIPLEXCATALOGUS', furHeading: 'Bont' },
    cs: { choose: 'vybrat', showFabricCatalog: 'ZOBRAZIT KATALOG LÁTEK', showPlywoodCatalog: 'ZOBRAZIT KATALOG PŘEKLIŽKY', furHeading: 'Kožešina' }
  };

  var LOCALE = (function(){
    var htmlLang = (document.documentElement.lang || '').toLowerCase().split('-')[0];
    if (htmlLang) return htmlLang;
    var m = window.location.pathname.match(/^\/([a-z]{2})(_[A-Z]{2})?\//);
    return m ? m[1].toLowerCase() : 'pl';
  })();

  function t(key){
    var bridge = document.getElementById('psw-i18n-bridge');
    if (bridge){
      var attrName = 'data-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
      var val = bridge.getAttribute(attrName);
      if (val) return val;
    }
    var dict = I18N_FALLBACK[LOCALE] || I18N_FALLBACK.en;
    return (dict && dict[key]) || I18N_FALLBACK.en[key];
  }

  function familyFromLabel(label){
    return label.replace(/^\*?\s*(materia[lł]|tkanina|fabric|material|stoff|tissu)\s*/i, '').trim();
  }

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
    requiredChecks = [];
    var wrappers = [...document.querySelectorAll('select-variant-option')];
    var radioWrappers = [...document.querySelectorAll('radio-variant-option')];
    var groups = { material: [], fur: [], plywood: [], side: [], size: [] };

    function classify(entry, label, optionId){
      var mapped = OPTION_ID_MAP[optionId];
      if (mapped){
        entry.family = mapped.family;
        groups[mapped.role].push(entry);
        return true;
      }
      if (/futr|\bfur\b|fell|fourrure/i.test(label)) groups.fur.push(entry);
      else if (/tkanin|materia|fabric|material|stoff|tissu/i.test(label)) groups.material.push(entry);
      else if (/sklejk|plywood|sperrholz|contreplaqu/i.test(label)) groups.plywood.push(entry);
      else if (/strona|\bside\b|seite|côté|cote/i.test(label)) groups.side.push(entry);
      else if (/rozmiar|średnic|srednic|wymiar|\bsize\b|größe|grösse|grosse|breite|durchmesser|taille|diamètre|diametre|largeur/i.test(label)) groups.size.push(entry);
      else return false;
      return true;
    }

    wrappers.forEach(function(w){
      var label = w.getAttribute('validation-name-label') || '';
      var optionId = w.getAttribute('option-id') || '';
      var hsel = w.querySelector('h-select');
      if (!hsel) return;
      var name = hsel.getAttribute('control-name');
      var entry = { kind: 'select', name: name, label: label, el: w };
      if (!classify(entry, label, optionId)) return;
      w.classList.add('psw-hidden-native');
    });

    radioWrappers.forEach(function(w){
      var label = w.getAttribute('validation-name-label') || '';
      var optionId = w.getAttribute('option-id') || '';
      var radios = [...w.querySelectorAll('input[type="radio"]')];
      if (!radios.length) return;
      var entry = { kind: 'radio', label: label, el: w, radios: radios };
      if (!classify(entry, label, optionId)) return;
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

    function makeSwatchItem(baseUrls, family, name, onClick){
      var item = document.createElement('div'); item.className = 'psw-item';
      var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'psw-swatch';
      var fullLabel = family ? (family + ' ' + name) : name;
      var resolvedUrl = null;
      if (baseUrls && baseUrls.length){
        var img = document.createElement('img');
        img.alt = fullLabel;
        var combos = [];
        baseUrls.forEach(function(b){
          IMG_EXTENSIONS.forEach(function(ext){ combos.push(b + '.' + ext); });
        });
        var idx = 0;
        var tryNext = function(){
          if (idx >= combos.length){
            img.remove();
            missingImages.push(fullLabel + '  ->  tried ' + combos.length + ' filename variants, none found (e.g. ' + combos[0] + ')');
            return;
          }
          img.src = combos[idx];
          idx++;
        };
        img.onerror = tryNext;
        img.onload = function(){ resolvedUrl = img.src; };
        tryNext();
        btn.appendChild(img);
      }
      btn.addEventListener('mouseenter', function(e){ showPreview(e.clientX, e.clientY, resolvedUrl, family, name); });
      btn.addEventListener('mousemove', function(e){ showPreview(e.clientX, e.clientY, resolvedUrl, family, name); });
      btn.addEventListener('mouseleave', hidePreview);
      btn.addEventListener('click', onClick.bind(item));
      var cap = document.createElement('div'); cap.className = 'psw-cap'; cap.textContent = fullLabel;
      item.appendChild(btn); item.appendChild(cap);
      return item;
    }

    function addCatalogLink(wrap, url, key){
      var a = document.createElement('a');
      a.className = 'psw-catalog';
      a.href = url; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = t(key);
      wrap.appendChild(a);
    }

    ['side', 'size'].forEach(function(kind){
      groups[kind].forEach(function(g){
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
        if (isRequired([g])){
          requiredChecks.push({ label: g.label, isSatisfied: (function(entry){ return function(){ return entryHasValue(entry); }; })(g), scrollTarget: wrap });
        }
      });
    });

    groups.plywood.forEach(function(g){
      var wrap = document.createElement('div'); wrap.className = 'psw-group';
      wrap.innerHTML = '<div class="psw-label"><span>' + labelHtml(g.label, isRequired([g])) + '</span></div>';
      var row = document.createElement('div'); row.className = 'psw-row';
      optionsOf(g).forEach(function(o){
        var caption = o.price ? (o.text + ' ' + o.price) : o.text;
        var item = makeSwatchItem(imgBasesFor('plywood', o.text), null, caption, function(){
          setEntryValue(g, o);
          row.querySelectorAll('.psw-swatch').forEach(function(x){ x.classList.remove('active'); });
          this.querySelector('.psw-swatch').classList.add('active');
        });
        row.appendChild(item);
      });
      wrap.appendChild(row);
      addCatalogLink(wrap, 'https://catalogues.praska.shop/9498a23bcd.html', 'showPlywoodCatalog');
      root.appendChild(wrap);
      if (isRequired([g])){
        requiredChecks.push({ label: g.label, isSatisfied: (function(entry){ return function(){ return entryHasValue(entry); }; })(g), scrollTarget: wrap });
      }
    });

    function renderTabbedSection(entries, fallbackHeading, catalogUrl, imgRole){
      if (!entries.length) return;
      var wrap = document.createElement('div'); wrap.className = 'psw-group';
      var labelEl = document.createElement('div'); labelEl.className = 'psw-label';
      var groupHeading = entries.length === 1
        ? entries[0].label
        : ((entries[0].label.match(/tkanina|materia[lł]|fabric|material|stoff|tissu/i) || [fallbackHeading])[0]);
      var required = entries.length > 1 ? true : isRequired(entries);
      labelEl.innerHTML = '<span>' + labelHtml(groupHeading, required) + '</span><b class="psw-sel">' + t('choose') + '</b>';
      wrap.appendChild(labelEl);

      var tabsEl = document.createElement('div'); tabsEl.className = 'psw-tabs';
      var rowEl = document.createElement('div'); rowEl.className = 'psw-row';
      var families = entries.map(function(g){ return { name: g.family || familyFromLabel(g.label) || g.label, entry: g }; });

      function clearOthers(exceptEntry){
        entries.forEach(function(g){
          if (g === exceptEntry) return;
          if (g.kind === 'select') setHOption(g.name, '');
        });
      }

      function renderFamily(fam){
        rowEl.innerHTML = '';
        optionsOf(fam.entry).forEach(function(o){
          var imgKey = (imgRole === 'fur' && FUR_VALUE_CANONICAL[o.value]) ? FUR_VALUE_CANONICAL[o.value] : o.text;
          var baseUrls = imgBasesFor(imgRole, imgKey);
          var baseLabel = combineLabel(fam.name, o.text);
          var fullLabel = o.price ? (baseLabel + ' ' + o.price) : baseLabel;
          var item = makeSwatchItem(baseUrls, null, fullLabel, function(){
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
        var tabBtn = document.createElement('button'); tabBtn.type = 'button'; tabBtn.textContent = fam.name;
        if (i === 0) tabBtn.classList.add('active');
        tabBtn.addEventListener('click', function(){
          tabsEl.querySelectorAll('button').forEach(function(b){ b.classList.remove('active'); });
          tabBtn.classList.add('active');
          renderFamily(fam);
        });
        tabsEl.appendChild(tabBtn);
      });
      if (families.length > 1) wrap.appendChild(tabsEl);
      wrap.appendChild(rowEl);
      if (catalogUrl) addCatalogLink(wrap, catalogUrl, 'showFabricCatalog');
      root.appendChild(wrap);
      if (families.length) renderFamily(families[0]);
      if (required){
        requiredChecks.push({ label: groupHeading, isSatisfied: function(){ return entries.some(entryHasValue); }, scrollTarget: wrap });
      }
    }

    renderTabbedSection(groups.material, 'Materiał', 'https://catalogues.praska.shop/96d6646d5f.html', 'material');
    renderTabbedSection(groups.fur, t('furHeading'), null, 'fur');

    var allEntries = groups.material.concat(groups.fur, groups.plywood, groups.side, groups.size);
    var anchor = allEntries[0].el;
    anchor.parentElement.insertBefore(root, anchor);

    if (missingImages.length){
      console.warn('[PRASKA swatch] Brak zdjęcia dla ' + missingImages.length + ' wariantów (widoczny placeholder):\n' + missingImages.join('\n'));
    }
  }

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
    if (sig === lastSignature) return;
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

  var ADD_TO_CART_PATTERN = /dodaj do koszyka|add to cart|in den warenkorb|ajouter au panier|aggiungi al carrello|toevoegen aan winkelwagen|přidat do košíku/i;

  function flashMissing(target){
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.add('psw-missing');
    setTimeout(function(){ target.classList.remove('psw-missing'); }, 2400);
  }

  document.addEventListener('click', function(e){
    var btn = e.target.closest ? e.target.closest('button, a') : null;
    if (!btn || !ADD_TO_CART_PATTERN.test(btn.textContent || '')) return;
    if (!requiredChecks.length) return;

    var firstMissing = requiredChecks.find(function(c){ return !c.isSatisfied(); });
    if (firstMissing){
      e.preventDefault();
      e.stopImmediatePropagation();
      flashMissing(firstMissing.scrollTarget);
    }
  }, true);

  if (document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', maybeRebuild); }
  else { maybeRebuild(); }

})();
