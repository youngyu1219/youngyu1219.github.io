(function () {
  var list = document.getElementById('project-list');
  var pagination = document.getElementById('project-pagination');
  if (!list || !pagination) return;

  var perPage = 3;
  var currentPage = 1;
  var projects = [];
  var defaultCover = 'img/hero-home.png';

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function readProjectDetail(project) {
    return fetch(project.markdown, { cache: 'no-cache' }).then(function (response) {
      if (!response.ok) throw new Error('Project detail unavailable');
      return response.text();
    }).then(function (markdown) {
      var heading = markdown.match(/^#\s+(.+)$/m);
      if (heading) project.title = heading[1].trim();
      var image = markdown.match(/!\[[^\]]*\]\(([^\s)]+)(?:\s+[^)]*)?\)/);
      if (image && image[1]) {
        try { project.image = new URL(image[1], document.baseURI).href; }
        catch (_) { project.image = image[1]; }
      } else {
        project.image = defaultCover;
      }
      return project;
    }).catch(function () {
      project.image = defaultCover;
      return project;
    });
  }

  function render() {
    var pageCount = Math.ceil(projects.length / perPage);
    var start = (currentPage - 1) * perPage;
    list.innerHTML = projects.slice(start, start + perPage).map(function (project) {
      return '<a class="project-card reveal in" href="project.html?slug=' + encodeURIComponent(project.slug) + '">' +
        '<div class="project-media"><img src="' + escapeHtml(project.image || defaultCover) + '" alt="' + escapeHtml(project.title) + '" onerror="this.onerror=null;this.src=\'' + defaultCover + '\'"><span class="status">' + escapeHtml(project.tag) + '</span></div>' +
        '<div class="project-body"><h3>' + escapeHtml(project.title) + '</h3><div class="sub">' + escapeHtml(project.date) + '</div><p>' + escapeHtml(project.description) + '</p><span class="project-card-more">查看详情 →</span></div></a>';
    }).join('');

    pagination.innerHTML = '<button type="button" data-page="prev" ' + (currentPage === 1 ? 'disabled' : '') + '>上一页</button>' +
      Array.from({ length: pageCount }, function (_, index) {
        var page = index + 1;
        return '<button type="button" data-page="' + page + '" class="' + (currentPage === page ? 'active' : '') + '" aria-label="第 ' + page + ' 页">' + page + '</button>';
      }).join('') +
      '<button type="button" data-page="next" ' + (currentPage === pageCount ? 'disabled' : '') + '>下一页</button>';
  }

  pagination.addEventListener('click', function (event) {
    var button = event.target.closest('button[data-page]');
    if (!button || button.disabled) return;
    var requestedPage = button.getAttribute('data-page');
    if (requestedPage === 'prev') currentPage--;
    else if (requestedPage === 'next') currentPage++;
    else currentPage = Number(requestedPage);
    render();
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
  });

  fetch('contents/projects/projects.json', { cache: 'no-cache' }).then(function (response) {
    if (!response.ok) throw new Error('Project list unavailable');
    return response.json();
  }).then(function (data) {
    projects = data.slice().sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
    return Promise.all(projects.map(readProjectDetail));
  }).then(render).catch(function () {
    list.innerHTML = '<p class="project-list-error">项目列表暂时无法读取，请通过本地静态网站地址打开。</p>';
  });
})();
