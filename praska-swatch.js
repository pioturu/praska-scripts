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

  function slug(s){
    return String(s).toLowerCase()
      .replace(/ą/g,'a').replace(/ć/g,'c').replace(/ę/g,'e').replace(/ł/g,'l')
      .replace(/ń/g,'n').replace(/ó/g,'o').replace(/ś/g,'s').replace(/ź/g,'z').replace(/ż/g,'z')
      .replace(/\s+/g,'-').trim();
  }

  function imgFor(groupLabel, value){
    if (/sklejk|plywood/i.test(groupLabel)) return ASSET_BASE + 'sklejka/' + slug(value) + '.jpg';
    if (/futr|\bfur\b/i.test(groupLabel)) return ASSET_BASE + encodeURIComponent(value) + '.jpg';
    return ASSET_BASE + slug(value) + '.jpg';
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

  // Sprawdza REALNY stan pola (nie wygląd) — czy natywny select/radio,
  // na który zapisujemy wybór, faktycznie ma ustawioną wartość. Używane
  // przez naszą własną walidację poniżej, niezależną od tego, czy
  // walidacja Shopera poprawnie widzi wizualnie ukryte pola.
  function entryHasValue(entry){
    if (entry.kind === 'radio'){
      return entry.radios.some(function(r){ return r.checked; });
    }
    var els = [...document.getElementsByName(entry.name)];
    var input = els.find(function(e){ return e.tagName === 'INPUT'; });
    return !!(input && input.value);
  }
  var requiredChecks = [];

  // ============================================================
  // TŁUMACZENIA: NAJPIERW próbujemy przeczytać je z mostu wypisanego
  // przez Twig (element #psw-i18n-bridge z atrybutami data-*) — to
  // realne tłumaczenia Shopera z pliku Tłumaczenia JSON. Jeśli mostu
  // nie ma (np. Twig się jeszcze nie wyrenderował / inny mechanizm),
  // spadamy na wbudowaną tabelę zapasową — więc działa tak czy inaczej.
  // ============================================================
  var I18N_FALLBACK = {
    pl: { choose: 'wybierz', showFabricCatalog: 'POKAŻ KATALOG TKANIN', showPlywoodCatalog: 'POKAŻ KATALOG SKLEJKI' },
    en: { choose: 'choose', showFabricCatalog: 'SHOW FABRIC CATALOG', showPlywoodCatalog: 'SHOW PLYWOOD CATALOG' },
    de: { choose: 'wählen', showFabricCatalog: 'STOFFKATALOG ANZEIGEN', showPlywoodCatalog: 'SPERRHOLZKATALOG ANZEIGEN' },
    fr: { choose: 'choisir', showFabricCatalog: 'VOIR LE CATALOGUE DE TISSUS', showPlywoodCatalog: 'VOIR LE CATALOGUE DE CONTREPLAQUÉ' },
    it: { choose: 'scegli', showFabricCatalog: 'MOSTRA CATALOGO TESSUTI', showPlywoodCatalog: 'MOSTRA CATALOGO COMPENSATO' },
    nl: { choose: 'kiezen', showFabricCatalog: 'TOON STOFFENCATALOGUS', showPlywoodCatalog: 'TOON MULTIPLEXCATALOGUS' },
    cs: { choose: 'vybrat', showFabricCatalog: 'ZOBRAZIT KATALOG LÁTEK', showPlywoodCatalog: 'ZOBRAZIT KATALOG PŘEKLIŽKY' }
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
    return label.replace(/^\*?\s*(materia[lł]|tkanina|fabric|material)\s*/i, '').trim();
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

    wrappers.forEach(function(w){
      var label = w.getAttribute('validation-name-label') || '';
      var hsel = w.querySelector('h-select');
      if (!hsel) return;
      var name = hsel.getAttribute('control-name');
      var entry = { kind: 'select', name: name, label: label, el: w };

      if (/futr|\bfur\b/i.test(label)) groups.fur.push(entry);
      else if (/tkanin|materia|fabric|material/i.test(label)) groups.material.push(entry);
      else if (/sklejk|plywood/i.test(label)) groups.plywood.push(entry);
      else if (/strona|\bside\b/i.test(label)) groups.side.push(entry);
      else if (/rozmiar|średnic|srednic|wymiar|\bsize\b/i.test(label)) groups.size.push(entry);
      else return;

      w.classList.add('psw-hidden-native');
    });

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
        var item = makeSwatchItem(imgFor(g.label, o.text), null, caption, function(){
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

    function renderTabbedSection(entries, fallbackHeading, catalogUrl){
      if (!entries.length) return;
      var wrap = document.createElement('div'); wrap.className = 'psw-group';
      var labelEl = document.createElement('div'); labelEl.className = 'psw-label';
      var groupHeading = entries.length === 1
        ? entries[0].label
        : ((entries[0].label.match(/tkanina|materia[lł]|fabric|material/i) || [fallbackHeading])[0]);
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
      if (required){
        requiredChecks.push({ label: groupHeading, isSatisfied: function(){ return entries.some(entryHasValue); }, scrollTarget: wrap });
      }
    }

    renderTabbedSection(groups.material, 'Materiał', 'https://catalogues.praska.shop/96d6646d5f.html');
    renderTabbedSection(groups.fur, 'Futro');

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

  // ============================================================
  // WŁASNA WALIDACJA "DODAJ DO KOSZYKA".
  //
  // Powód: nasze pola ukrywamy techniką "visually hidden" (1x1px,
  // przycięte) — natywna walidacja Shopera prawdopodobnie sprawdza
  // nie tylko "czy pole ma wartość", ale też "czy jest realnie
  // widoczne", i pomija w ten sposób nasze ukryte pola nawet gdy są
  // oznaczone jako wymagane (*). Efekt: dało się dodać produkt do
  // koszyka bez wybrania wymaganego wariantu.
  //
  // Ta warstwa nie zgaduje wewnętrznej logiki Shopera — sprawdza
  // REALNY stan (entryHasValue) każdej zarejestrowanej wymaganej
  // grupy i blokuje kliknięcie, jeśli czegoś brakuje, niezależnie
  // od przyczyny, dla której natywna walidacja tego nie złapała.
  // ============================================================
  var ADD_TO_CART_PATTERN = /dodaj do koszyka|add to cart|in den warenkorb|ajouter au panier|aggiungi al carrello|toevoegen aan winkelwagen|přidat do košíku/i;

  function flashMissing(target){
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.add('psw-missing');
    setTimeout(function(){ target.classList.remove('psw-missing'); }, 2400);
  }

  document.addEventListener('click', function(e){
    var btn = e.target.closest ? e.target.closest('button, a') : null;
    if (!btn || !ADD_TO_CART_PATTERN.test(btn.textContent || '')) return;
    if (!requiredChecks.length) return; // nic do sprawdzenia (np. produkt bez naszych grup)

    var firstMissing = requiredChecks.find(function(c){ return !c.isSatisfied(); });
    if (firstMissing){
      e.preventDefault();
      e.stopImmediatePropagation();
      flashMissing(firstMissing.scrollTarget);
    }
  }, true); // capture: łapiemy PRZED natywnym handlerem Shopera

  if (document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', maybeRebuild); }
  else { maybeRebuild(); }

})();
