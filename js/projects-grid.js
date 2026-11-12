(function () {
  var list = document.getElementById('project-list');
  var pagination = document.getElementById('project-pagination');
  if (!list || !pagination) return;
  var perPage = 4;
  var currentPage = 1;
  var projects = [];
  var defaultCover = 'img/hero-home.png';

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function render() {
    var pageCount = Math.ceil(projects.length / perPage);
    var start = (currentPage - 1) * perPage;
    list.innerHTML = projects.slice(start, start + perPage).map(function (p, i) {
      return '<a class="project-card reveal in" href="project.html?slug=' + encodeURIComponent(p.slug) + '">' +
        '<div class="project-media"><img src="' + escapeHtml(p.image || defaultCover) + '" alt="' + escapeHtml(p.title) + '" onerror="this.onerror=null;this.src=\'' + defaultCover + '\'"><span class="status">' + escapeHtml(p.tag) + '</span></div>' +
        '<div class="project-body"><h3>' + escapeHtml(p.title) + '</h3><div class="sub">' + escapeHtml(p.date) + '</div><p>' + escapeHtml(p.description) + '</p><span class="project-card-more">查看详情 →</span></div></a>';
    }).join('');

    pagination.innerHTML = '<button type="button" data-page="prev" ' + (currentPage === 1 ? 'disabled' : '') + '>上一页</button>' +
      Array.from({ length: pageCount }, function (_, i) { return '<button type="button" data-page="' + (i + 1) + '" class="' + (currentPage === i + 1 ? 'active' : '') + '" aria-label="第 ' + (i + 1) + ' 页">' + (i + 1) + '</button>'; }).join('') +
      '<button type="button" data-page="next" ' + (currentPage === pageCount ? 'disabled' : '') + '>下一页</button>';
  }

  pagination.addEventListener('click', function (event) {
    var button = event.target.closest('button[data-page]');
    if (!button || button.disabled) return;
    var requested = button.getAttribute('data-page');
    if (requested === 'prev') currentPage--;
    else if (requested === 'next') currentPage++;
    else currentPage = Number(requested);
    render();
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
  });

  fetch('contents/projects/projects.json').then(function (response) {
    if (!response.ok) throw new Error();
    return response.json();
  }).then(function (data) {
    projects = data.slice().sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
    render();
  }).catch(function () {
    list.innerHTML = '<p class="project-list-error">项目列表暂时无法读取，请通过本地静态网站地址打开。</p>';
  });
})();
