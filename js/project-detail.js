(function () {
  var target = document.getElementById('project-content');
  var slug = new URLSearchParams(location.search).get('slug');
  if (!target || !slug || !/^[a-z0-9-]+$/.test(slug)) {
    if (target) target.innerHTML = '<p>未找到这个项目，请返回精选项目列表。</p>';
    return;
  }
  fetch('contents/projects/projects.json').then(function (r) { if (!r.ok) throw new Error(); return r.json(); }).then(function (projects) {
    var project = projects.find(function (item) { return item.slug === slug; });
    if (!project) throw new Error();
    document.title = project.title + ' · YOUNG GIS';
    return fetch(project.markdown).then(function (r) { if (!r.ok) throw new Error(); return r.text(); }).then(function (markdown) {
      target.innerHTML = marked.parse(markdown);
      var firstHeading = target.querySelector('h1');
      if (firstHeading) firstHeading.setAttribute('tabindex', '-1');
    });
  }).catch(function () { target.innerHTML = '<p>项目内容暂时无法读取，请通过本地静态网站地址打开。</p>'; });
})();
