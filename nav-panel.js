/**
 * Left navigation panel for Surface Evolver docs.
 * RTD-style sidebar with full-text search, grouped menu, and breadcrumbs.
 */
(function() {
  /* === Inject CSS if missing === */
  if (!document.querySelector('link[href*="evdoc-style"]')) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'evdoc-style.css';
    document.head.appendChild(link);
  }

  /* === Navigation items (from evolver.htm TOC) === */
  var NAV_ITEMS = [
    { label: '概述',                         file: 'intro.htm',      anchor: 'overview' },
    { label: '获取与安装',                    file: 'install.htm' },
    { label: '命令行选项',                    file: 'general.htm',    anchor: 'options' },
    { label: '教程与示例',                    file: 'tutorial.htm' },
    { label: '几何元素与属性',                 file: 'elements.htm' },
    { label: '表面模型',                      file: 'model.htm' },
    { label: '能量',                         file: 'energies.htm' },
    { label: '约束与边界',                    file: 'constrnt.htm' },
    { label: '命名量与方法',                  file: 'quants.htm' },
    { label: '语法',                         file: 'syntax.htm' },
    { label: '数据文件',                      file: 'datafile.htm' },
    { label: '表面初始化',                    file: 'general.htm',    anchor: 'initialization' },
    { label: '图形',                         file: 'graphics.htm' },
    { label: '命令语言',                      file: 'commands.htm' },
    { label: '图形模式命令',                  file: 'graphics.htm',   anchor: 'graphics-commands' },
    { label: 'Hessian 矩阵、特征值与特征向量', file: 'eigentut.htm' },
    { label: '错误处理',                      file: 'general.htm',    anchor: 'error-handling' },
    { label: '中断执行',                      file: 'general.htm',    anchor: 'interrupts' },
    { label: '示例命令脚本',                  file: 'scripts.htm' },
    { label: '调试',                         file: 'debugging.htm' },
    { label: '性能分析',                      file: 'profiling.htm' },
    { label: '提示与技巧',                    file: 'hints.htm' },
    { label: '已知问题',                      file: 'general.htm',    anchor: 'bugs' },
    { label: '参考文献',                      file: 'biblio.htm' },
    { label: '通讯简报',                      file: 'general.htm',    anchor: 'newsletters' },
  ];

  var currentFile = location.pathname.split('/').pop().split('?')[0].split('#')[0];

  /* Get page title */
  var h1 = document.querySelector('h1');
  var pageTitle = h1 ? h1.textContent.trim() : document.title.replace('Surface Evolver ', '').replace('Surface Evolver', '');

  /* Find which section the current page belongs to */
  var currentSection = '';
  for (var i = 0; i < NAV_ITEMS.length; i++) {
    if (NAV_ITEMS[i].file === currentFile && !NAV_ITEMS[i].anchor) {
      currentSection = NAV_ITEMS[i].label;
      break;
    }
    if (NAV_ITEMS[i].file === currentFile && NAV_ITEMS[i].anchor) {
      currentSection = NAV_ITEMS[i].label;
    }
  }

  /* Build sidebar HTML */
  var sidebarHTML =
    '<div class="wy-nav-side">' +
      '<div class="wy-side-scroll">' +
        '<div class="wy-side-nav-search">' +
          '<a href="evolver.htm">Surface Evolver</a>' +
          '<div class="search">' +
            '<input type="text" placeholder="搜索文档" aria-label="搜索文档" />' +
          '</div>' +
        '</div>' +
        '<div class="search-results"></div>' +
        '<div class="wy-menu wy-menu-vertical" role="navigation">' +
          '<p class="caption"><span class="caption-text">文档目录</span></p>' +
          '<ul>' +
            NAV_ITEMS.map(function(item) {
              var href = item.anchor ? item.file + '#' + item.anchor : item.file;
              var isActive = currentFile === item.file;
              return '<li><a href="' + href + '"' + (isActive ? ' class="active"' : '') + '>' + item.label + '</a></li>';
            }).join('') +
          '</ul>' +
        '</div>' +
      '</div>' +
    '</div>';

  /* Breadcrumb: left = 首页 > section, right = 索引 */
  var breadcrumbLeft =
    '<ul>' +
      '<li><a href="evolver.htm">首页</a></li>' +
      (currentSection ? '<li>' + currentSection + '</li>' : '') +
    '</ul>';
  var breadcrumbRight =
    '<div class="wy-breadcrumbs-aside">' +
      '<a href="index.htm">索引</a>' +
    '</div>';

  /* Build content wrapper */
  var contentWrap =
    '<section class="wy-nav-content-wrap">' +
      '<nav class="wy-nav-top" aria-label="Mobile navigation">' +
        '<i class="fa fa-bars"></i>' +
        '<a href="evolver.htm">Surface Evolver</a>' +
      '</nav>' +
      '<div class="wy-nav-content">' +
        '<div class="rst-content">' +
          '<nav class="wy-breadcrumbs" aria-label="breadcrumbs">' +
            breadcrumbLeft +
            breadcrumbRight +
          '</nav>' +
          '<hr/>' +
          '<div role="main">';

  var contentEnd =
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>';

  var overlay = '<div class="nav-overlay"></div>';

  /* === DOM Restructuring === */
  var body = document.body;
  var bodyHTML = body.innerHTML;

  /* Remove script tags to prevent re-execution */
  bodyHTML = bodyHTML.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

  /* Build new body */
  body.innerHTML =
    '<div class="wy-grid-for-nav">' +
      sidebarHTML +
      contentWrap +
      bodyHTML +
      contentEnd +
    '</div>' +
    overlay;

  /* === Mobile toggle === */
  var navSide = document.querySelector('.wy-nav-side');
  var navOverlay = document.querySelector('.nav-overlay');
  var faBars = document.querySelector('.fa-bars');

  if (faBars) {
    faBars.addEventListener('click', function() {
      navSide.classList.toggle('open');
      navOverlay.classList.toggle('open');
    });
  }
  if (navOverlay) {
    navOverlay.addEventListener('click', function() {
      navSide.classList.remove('open');
      navOverlay.classList.remove('open');
    });
  }

  /* === Full-text Search (pre-built index) === */
  var searchInput = document.querySelector('.wy-side-nav-search input[type="text"]');
  var searchResults = document.querySelector('.search-results');
  var menuVertical = document.querySelector('.wy-menu-vertical');

  /* Load pre-built search index via dynamic script tag (works with file://) */
  function loadSearchIndex() {
    if (window.__SEARCH_DATA) return Promise.resolve(window.__SEARCH_DATA);
    return new Promise(function(resolve) {
      var script = document.createElement('script');
      script.src = 'search-data.js';
      script.onload = function() { resolve(window.__SEARCH_DATA || {}); };
      script.onerror = function() { resolve({}); };
      document.head.appendChild(script);
    });
  }

  function getSectionLabel(file) {
    for (var i = 0; i < NAV_ITEMS.length; i++) {
      if (NAV_ITEMS[i].file === file) return NAV_ITEMS[i].label;
    }
    return file;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function doSearch(query) {
    if (!query || query.length < 2) {
      searchResults.innerHTML = '';
      searchResults.style.display = '';
      menuVertical.style.display = '';
      return;
    }

    loadSearchIndex().then(function(data) {
      var q = query.toLowerCase();
      var results = [];
      var files = Object.keys(data);

      for (var i = 0; i < files.length; i++) {
        var f = files[i];
        var text = data[f].toLowerCase();
        var idx = text.indexOf(q);
        if (idx === -1) continue;

        var start = Math.max(0, idx - 40);
        var end = Math.min(text.length, idx + query.length + 60);
        var context = (start > 0 ? '...' : '') +
          data[f].substring(start, end).replace(/\s+/g, ' ').trim() +
          (end < text.length ? '...' : '');

        var safeContext = escapeHtml(context);
        var safeQuery = escapeHtml(query);
        safeContext = safeContext.replace(
          new RegExp(safeQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
          '<mark>$&</mark>'
        );

        results.push({
          file: f,
          section: getSectionLabel(f),
          context: safeContext
        });

        if (results.length >= 15) break;
      }

      if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">未找到匹配结果</div>';
      } else {
        searchResults.innerHTML = results.map(function(r) {
          return '<div class="search-result-item">' +
            '<a href="' + r.file + '">' + r.section + '</a>' +
            '<span class="sr-context">' + r.context + '</span>' +
          '</div>';
        }).join('');
      }
      searchResults.style.display = '';
      menuVertical.style.display = 'none';
    });
  }

  if (searchInput) {
    var debounceTimer = null;
    searchInput.addEventListener('input', function() {
      var val = this.value;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function() { doSearch(val); }, 300);
    });
  }

})();
