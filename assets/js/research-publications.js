/* Data-driven catalogue; intentionally independent of the template's jQuery plugins. */
(function () {
  'use strict';

  var catalogue = document.querySelector('[data-research-catalogue]');
  if (!catalogue) return;

  var list = catalogue.querySelector('[data-research-results]');
  var status = catalogue.querySelector('[data-research-status]');
  var empty = catalogue.querySelector('[data-research-empty]');
  var controls = catalogue.querySelector('[data-research-controls]');
  var search = catalogue.querySelector('input[type="search"]');
  var buttons = catalogue.querySelectorAll('[data-research-filter]');
  var retry = catalogue.querySelector('[data-research-retry]');
  var records = [];
  var selectedType = 'all';
  var typeLabels = {
    journal: 'Journal Article', conference: 'Conference Paper', patent: 'Patent',
    standard: 'Technical Standard', article: 'Newsletter Article', thesis: 'Master’s Thesis'
  };

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function safeUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      var url = new URL(value);
      return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
    } catch (error) {
      return null;
    }
  }

  function externalLink(url, label, context) {
    var link = element('a', 'research-source', label + ' ↗');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', label + (context ? ' for ' + context : '') + ' (opens in a new tab)');
    return link;
  }

  function renderRecord(record) {
    var article = element('article', 'research-work');
    article.dataset.researchId = record.id || '';
    var year = element('div', 'research-year', record.year || 'Undated');
    article.appendChild(year);
    var body = element('div', 'research-work-body');
    body.appendChild(element('p', 'research-type', typeLabels[record.type] || 'Research Work'));
    body.appendChild(element('h3', '', record.title || 'Untitled research work'));
    var metadata = [record.patentNumber, record.patentType, record.venue, record.citation].filter(Boolean);
    if (metadata.length) body.appendChild(element('p', 'research-venue', metadata.join(' · ')));
    if (record.authors) body.appendChild(element('p', 'research-venue', record.authors));
    if (record.publicationDate && record.publicationDate !== record.grantDate) {
      body.appendChild(element('p', 'research-venue', 'Published: ' + formatDate(record.publicationDate)));
    }
    if (record.type === 'patent' && record.patentStatus) {
      body.appendChild(element('p', 'research-patent-status',
        (record.statusSource || 'Google Patents') + ': ' + record.patentStatus +
        (record.grantDate ? ' · Grant date: ' + formatDate(record.grantDate) : '')));
    }
    if (record.summary) body.appendChild(element('p', 'research-summary', record.summary));
    if (Array.isArray(record.keywords) && record.keywords.length) {
      var keywords = element('ul', 'research-keywords');
      keywords.setAttribute('aria-label', 'Research topics');
      record.keywords.filter(Boolean).forEach(function (keyword) { keywords.appendChild(element('li', '', keyword)); });
      body.appendChild(keywords);
    }
    var url = safeUrl(record.url);
    if (url) body.appendChild(externalLink(url, record.urlLabel || 'Source Record', record.title));
    article.appendChild(body);
    return article;
  }

  function formatDate(value) {
    var date = new Date(value + 'T00:00:00Z');
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
    });
  }

  function update() {
    var terms = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    var matches = records.filter(function (record) {
      var haystack = [record.title, record.year, record.venue, record.citation, record.summary,
        record.publicationDate, record.sourceDate, record.patentNumber, record.patentType, record.patentStatus,
        typeLabels[record.type], (record.keywords || []).join(' ')].join(' ').toLowerCase();
      var matchesType = selectedType === 'all' || record.type === selectedType ||
        (selectedType === 'article' && record.type === 'thesis');
      return matchesType &&
        terms.every(function (term) { return haystack.includes(term); });
    });
    var fragment = document.createDocumentFragment();
    matches.forEach(function (record) { fragment.appendChild(renderRecord(record)); });
    list.replaceChildren(fragment);
    empty.hidden = matches.length > 0;
    status.textContent = 'Showing ' + matches.length + ' of ' + records.length + ' works';
    buttons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.researchFilter === selectedType));
    });
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      selectedType = button.dataset.researchFilter;
      update();
    });
  });
  search.addEventListener('input', update);
  search.addEventListener('search', update);
  retry.addEventListener('click', load);

  async function load() {
    status.textContent = 'Loading research catalogue…';
    retry.hidden = true;
    empty.hidden = true;
    list.setAttribute('aria-busy', 'true');
    try {
      var response = await fetch(catalogue.dataset.source);
      if (!response.ok) throw new Error('Catalogue request failed');
      var data = await response.json();
      if (!Array.isArray(data.records)) throw new Error('Invalid catalogue data');
      records = data.records.filter(function (record) { return record && typeof record === 'object'; });
      records.sort(function (a, b) {
        // Use verified full dates where available; undated records remain last.
        var dateA = a.grantDate || a.publicationDate || a.sourceDate || (a.year ? a.year + '-01-01' : '');
        var dateB = b.grantDate || b.publicationDate || b.sourceDate || (b.year ? b.year + '-01-01' : '');
        return dateB.localeCompare(dateA);
      });
      var orcidUrl = safeUrl(data.profiles && data.profiles.orcidUrl);
      var orcidSlot = document.querySelector('[data-research-orcid]');
      if (orcidSlot) {
        orcidSlot.replaceChildren();
        if (orcidUrl) orcidSlot.appendChild(externalLink(orcidUrl, 'ORCID'));
        orcidSlot.hidden = !orcidUrl;
      }
      controls.hidden = false;
      update();
    } catch (error) {
      status.textContent = 'The research catalogue could not be loaded. Please try again, or explore the research profiles below.';
      retry.hidden = false;
    } finally {
      list.setAttribute('aria-busy', 'false');
    }
  }

  load();
})();
