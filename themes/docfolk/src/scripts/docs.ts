const root = document.querySelector<HTMLElement>('[data-docs-root]');

if (root) {
  const base = root.dataset.base || '';
  const copyLabel = root.dataset.copyLabel || 'Copy code';
  const copiedLabel = root.dataset.copiedLabel || 'Copied';
  const copyError = root.dataset.copyError || 'Could not copy. Select and copy the text instead.';
  const liveStatus = root.querySelector<HTMLElement>('[data-copy-status]');
  let statusTimer: number | undefined;
  function announce(message: string) {
    if (!liveStatus) return;
    clearTimeout(statusTimer);
    liveStatus.textContent = message;
    liveStatus.className = 'copy-feedback';
    statusTimer = window.setTimeout(() => {
      liveStatus.className = 'copy-status sr-only';
      liveStatus.textContent = '';
    }, 6000);
  }

  const resetTimers = new WeakMap<HTMLButtonElement, number>();
  const originalLabels = new WeakMap<HTMLButtonElement, string>();

  async function copy(button: HTMLButtonElement, getText: () => Promise<string>) {
    const label = button.querySelector('span') || button;
    if (!originalLabels.has(button)) originalLabels.set(button, label.textContent || copyLabel);
    clearTimeout(resetTimers.get(button));
    button.disabled = true;
    try {
      if (!navigator.clipboard) throw new Error('Clipboard is unavailable');
      // Start the clipboard operation in the click event, preserving Safari's user activation.
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard.write) {
        await navigator.clipboard.write([new ClipboardItem({
          'text/plain': getText().then((text) => new Blob([text], { type: 'text/plain' })),
        })]);
      } else {
        await navigator.clipboard.writeText(await getText());
      }
      label.textContent = copiedLabel;
      announce(copiedLabel);
    } catch {
      label.textContent = originalLabels.get(button) || copyLabel;
      announce(copyError);
    } finally {
      button.disabled = false;
      resetTimers.set(button, window.setTimeout(() => {
        label.textContent = originalLabels.get(button) || copyLabel;
      }, 2200));
    }
  }

  root.querySelectorAll('[data-company-select], [data-locale-select]').forEach((select) => {
    if (!(select instanceof HTMLSelectElement)) return;
    select.addEventListener('change', () => {
      if (select.value.startsWith('/') && !select.value.startsWith('//')) window.location.assign(select.value);
    });
  });

  const themeToggle = root.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  const colorPreference = window.matchMedia('(prefers-color-scheme: dark)');
  let explicitTheme: string | null = null;
  try { explicitTheme = localStorage.getItem('docfolk-theme'); } catch { /* Preferences remain session-local if storage is unavailable. */ }

  function applyTheme(dark: boolean) {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    if (!themeToggle) return;
    const label = dark ? themeToggle.dataset.lightLabel : themeToggle.dataset.darkLabel;
    themeToggle.setAttribute('aria-label', label || (dark ? 'Light mode' : 'Dark mode'));
    themeToggle.title = themeToggle.getAttribute('aria-label') || '';
  }

  applyTheme(explicitTheme === 'dark' || (explicitTheme !== 'light' && colorPreference.matches));
  if (themeToggle) {
    themeToggle.disabled = false;
    themeToggle.addEventListener('click', () => {
      const dark = document.documentElement.dataset.theme !== 'dark';
      explicitTheme = dark ? 'dark' : 'light';
      applyTheme(dark);
      try { localStorage.setItem('docfolk-theme', explicitTheme); } catch { /* The current page still switches themes. */ }
    });
  }
  colorPreference.addEventListener('change', (event) => {
    if (explicitTheme !== 'dark' && explicitTheme !== 'light') applyTheme(event.matches);
  });

  const sidebar = root.querySelector<HTMLDetailsElement>('[data-sidebar]');
  const desktop = window.matchMedia('(min-width: 1024px)');
  if (sidebar) {
    sidebar.open = desktop.matches;
    desktop.addEventListener('change', (event) => { sidebar.open = event.matches; });
    sidebar.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !desktop.matches && sidebar.open) {
        sidebar.open = false;
        sidebar.querySelector('summary')?.focus();
      }
    });
  }

  root.querySelectorAll<HTMLButtonElement>('[data-copy-url]').forEach((button) => {
    button.disabled = false;
    button.addEventListener('click', () => {
      void copy(button, async () => {
        const response = await fetch(button.dataset.copyUrl || '', { credentials: 'omit', headers: { Accept: 'text/markdown' } });
        if (!response.ok) throw new Error('Markdown could not load');
        return response.text();
      });
    });
  });

  const promptButton = root.querySelector<HTMLButtonElement>('[data-copy-prompt]');
  const promptSource = root.querySelector<HTMLElement>('[data-integration-prompt]');
  if (promptButton && promptSource) {
    promptButton.disabled = false;
    promptButton.addEventListener('click', () => { void copy(promptButton, async () => promptSource.textContent || ''); });
  }

  root.querySelectorAll<HTMLPreElement>('.prose pre').forEach((pre) => {
    const code = pre.querySelector('code');
    if (!code) return;
    const language = [...code.classList].find((name) => name.startsWith('language-'))?.slice(9) || '';
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    const toolbar = document.createElement('div');
    toolbar.className = 'code-toolbar';
    const languageLabel = document.createElement('span');
    languageLabel.className = 'code-language';
    languageLabel.textContent = language;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy';
    button.textContent = copyLabel;
    button.setAttribute('aria-label', language ? `${copyLabel} · ${language}` : copyLabel);
    button.addEventListener('click', () => { void copy(button, async () => code.textContent || ''); });
    toolbar.appendChild(languageLabel);
    toolbar.appendChild(button);
    pre.parentNode?.insertBefore(wrapper, pre);
    wrapper.appendChild(toolbar);
    wrapper.appendChild(pre);
    pre.tabIndex = 0;
  });
  root.querySelectorAll<HTMLTableElement>('.prose table').forEach((table) => { table.tabIndex = 0; });
  root.querySelectorAll<HTMLElement>('.diagram-canvas').forEach((canvas) => {
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'region');
    canvas.setAttribute('aria-label', canvas.querySelector('img')?.alt || 'Diagram');
  });

  const tocLinks = [...root.querySelectorAll<HTMLAnchorElement>('[data-toc-link]')];
  const tocHeadings = tocLinks.map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1)))).filter((heading): heading is HTMLElement => Boolean(heading));
  if (tocHeadings.length > 0) {
    let ticking = false;
    const updateToc = () => {
      const readingLine = desktop.matches ? 140 : 36;
      let active = tocHeadings[0];
      for (const heading of tocHeadings) {
        if (heading.getBoundingClientRect().top <= readingLine) active = heading;
        else break;
      }
      for (const link of tocLinks) {
        if (link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
      ticking = false;
    };
    // One frame per scroll; no layout mutation until all heading positions are read.
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(updateToc); }
    }, { passive: true });
    updateToc();
  }

  interface SearchPage {
    title: string;
    description: string;
    doc_key: string;
    category: string;
    method: string;
    path: string;
    titleText: string;
    metadataText: string;
    bodyText: string;
  }
  const dialog = root.querySelector<HTMLDialogElement>('[data-search-dialog]');
  const input = root.querySelector<HTMLInputElement>('#search-input');
  const resultList = root.querySelector<HTMLUListElement>('#search-results');
  const searchStatus = root.querySelector<HTMLElement>('[data-search-status]');
  const retry = root.querySelector<HTMLButtonElement>('[data-search-retry]');
  const openButton = root.querySelector<HTMLButtonElement>('[data-search-open]');
  const closeButton = root.querySelector<HTMLButtonElement>('[data-search-close]');
  let searchPages: SearchPage[] | undefined;
  let pendingSearch: Promise<void> | undefined;
  let previousFocus: HTMLElement | null = null;
  let debounceTimer: number | undefined;
  const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase(document.documentElement.lang);

  function renderSearch() {
    if (!input || !resultList || !searchStatus || !dialog || !searchPages) return;
    const tokens = normalize(input.value.trim()).split(/\s+/u).filter(Boolean);
    const ranked: { page: SearchPage; score: number }[] = [];
    for (const page of searchPages) {
      let score = 0;
      let matches = true;
      for (const token of tokens) {
        if (page.titleText.includes(token)) score += 8;
        else if (page.metadataText.includes(token)) score += 4;
        else if (page.bodyText.includes(token)) score += 1;
        else { matches = false; break; }
      }
      if (matches) ranked.push({ page, score });
    }
    ranked.sort((a, b) => b.score - a.score);
    const results = ranked.slice(0, 30);
    const fragment = document.createDocumentFragment();
    for (const { page } of results) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = `${base}/${encodeURIComponent(page.doc_key)}`;
      const context = document.createElement('span');
      context.className = 'search-result-context';
      context.textContent = page.category;
      const title = document.createElement('span');
      title.className = 'search-result-title';
      if (page.method) {
        const badge = document.createElement('span');
        badge.className = 'method-badge';
        badge.dataset.method = page.method.toUpperCase();
        badge.textContent = page.method.toUpperCase();
        title.appendChild(badge);
      }
      const titleText = document.createElement('span');
      titleText.textContent = page.title;
      title.appendChild(titleText);
      const description = document.createElement('span');
      description.className = 'search-result-description';
      description.textContent = page.description;
      link.appendChild(context);
      link.appendChild(title);
      link.appendChild(description);
      item.appendChild(link);
      fragment.append(item);
    }
    resultList.replaceChildren(fragment);
    searchStatus.textContent = results.length
      ? `${dialog.dataset.resultsLabel || 'Search results'}: ${results.length}${ranked.length > results.length ? ` / ${ranked.length}` : ''}`
      : dialog.dataset.empty || 'No matching pages.';
  }

  async function loadSearch() {
    if (!dialog || !searchStatus || !resultList || !retry) return;
    if (searchPages) { renderSearch(); return; }
    if (pendingSearch) return pendingSearch;
    retry.hidden = true;
    resultList.replaceChildren();
    searchStatus.textContent = dialog.dataset.loading || 'Loading…';
    dialog.setAttribute('aria-busy', 'true');
    pendingSearch = (async () => {
      try {
        const response = await fetch(`${base}/search.json`, { credentials: 'omit', headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('Search index could not load');
        const data: unknown = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid search index');
        searchPages = data.map((entry: unknown) => {
          if (typeof entry !== 'object' || entry === null) throw new Error('Invalid search entry');
          const row = entry as Record<string, unknown>;
          if (typeof row.title !== 'string' || typeof row.doc_key !== 'string') throw new Error('Invalid search entry');
          const description = typeof row.description === 'string' ? row.description : '';
          const category = typeof row.category === 'string' ? row.category : '';
          const method = typeof row.method === 'string' ? row.method : '';
          const path = typeof row.path === 'string' ? row.path : '';
          return {
            title: row.title, doc_key: row.doc_key, description, category, method, path,
            titleText: normalize(row.title),
            metadataText: normalize(`${description} ${category} ${method} ${path}`),
            bodyText: normalize(typeof row.body === 'string' ? row.body : ''),
          };
        });
        renderSearch();
      } catch {
        searchPages = undefined;
        searchStatus.textContent = dialog.dataset.error || 'Search could not load.';
        retry.hidden = false;
      } finally {
        pendingSearch = undefined;
        dialog.removeAttribute('aria-busy');
      }
    })();
    return pendingSearch;
  }

  function openSearch() {
    if (!dialog || !input || dialog.open) return;
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    input.focus();
    void loadSearch();
  }

  if (dialog && input && resultList && openButton) {
    openButton.disabled = false;
    const shortcut = root.querySelector<HTMLElement>('[data-search-shortcut]');
    if (shortcut) shortcut.textContent = /Macintosh|iPhone|iPad/u.test(navigator.userAgent) ? '⌘ K' : 'Ctrl K';
    openButton.addEventListener('click', openSearch);
    closeButton?.addEventListener('click', () => { dialog.close(); });
    retry?.addEventListener('click', () => { void loadSearch(); });
    dialog.addEventListener('close', () => {
      clearTimeout(debounceTimer);
      if (previousFocus?.isConnected) previousFocus.focus();
    });
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(renderSearch, 120);
    });
    input.form?.addEventListener('submit', (event) => {
      event.preventDefault();
      clearTimeout(debounceTimer);
      renderSearch();
      resultList.querySelector<HTMLAnchorElement>('a')?.click();
    });
    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        dialog.close();
        return;
      }
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      if (document.activeElement !== input && !resultList.contains(document.activeElement)) return;
      event.preventDefault();
      clearTimeout(debounceTimer);
      if (document.activeElement === input) renderSearch();
      const links = [...resultList.querySelectorAll<HTMLAnchorElement>('a')];
      if (!links.length) return;
      const current = links.findIndex((link) => link === document.activeElement);
      if (event.key === 'ArrowDown') links[(current + 1) % links.length]?.focus();
      else if (current === 0) input.focus();
      else links[current < 0 ? links.length - 1 : current - 1]?.focus();
    });
    document.addEventListener('keydown', (event) => {
      if ((event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (dialog.open) dialog.close();
        else openSearch();
      }
    });
  }
}

export {};
