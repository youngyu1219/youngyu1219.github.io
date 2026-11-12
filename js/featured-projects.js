(function () {
  var track = document.getElementById('featured-projects');
  if (!track) return;
  var defaultCover = 'img/hero-home.png';

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  fetch('contents/projects/projects.json').then(function (r) {
    if (!r.ok) throw new Error('Project list unavailable');
    return r.json();
  }).then(function (projects) {
    return Promise.all(projects.map(function (project) {
      return fetch(project.markdown).then(function (r) {
        if (!r.ok) return '';
        return r.text();
      }).catch(function () { return ''; }).then(function (markdown) {
        var match = markdown.match(/!\[[^\]]*\]\(([^\s)]+)(?:\s+[^)]*)?\)/);
        project.cover = match && match[1] ? match[1] : defaultCover;
        return project;
      });
    }));
  }).then(function (projects) {
    track.innerHTML = projects.map(function (p, i) {
      return '<a class="slide' + (i === 0 ? ' is-active' : '') + '" href="project.html?slug=' + encodeURIComponent(p.slug) + '">' +
        '<img src="' + escapeHtml(p.cover) + '" alt="' + escapeHtml(p.title) + '" onerror="this.onerror=null;this.src=\'' + defaultCover + '\'">' +
        '<div class="slide-mask"><span class="slide-tag">' + escapeHtml(p.tag) + '</span><h3>' + escapeHtml(p.title) + '</h3><p>' + escapeHtml(p.description) + '</p><span class="slide-more">查看项目详情 →</span></div></a>';
    }).join('');
    document.dispatchEvent(new Event('featured-ready'));
  }).catch(function () {
    track.innerHTML = '<p>精选项目暂时无法读取，请通过本地静态网站地址打开。</p>';
  });
})();
