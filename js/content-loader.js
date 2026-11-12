/* Markdown-style text driven homepage. Edit the files under contents/ to update page copy. */
(function () {
    var files = {
        home: 'contents/home.txt',
        awards: 'contents/awards.txt',
        experience: 'contents/experience.txt',
        mentoring: 'contents/mentoring.txt',
        publications: 'contents/publications.txt',
        tools: 'contents/tools.txt',
        news: 'contents/news.txt'
    };

    function loadText(path) {
        return fetch(path).then(function (response) {
            if (!response.ok) throw new Error('Unable to load ' + path);
            return response.text();
        });
    }

    function renderMarkdown(name, elementId) {
        return loadText(files[name]).then(function (markdown) {
            var target = document.getElementById(elementId);
            if (target) target.innerHTML = marked.parse(markdown);
        }).catch(function () {
            var target = document.getElementById(elementId);
            if (target) target.innerHTML = '<p>内容暂时无法读取，请通过静态网站地址打开。</p>';
        });
    }

    function loadConfig() {
        return loadText('contents/config.txt').then(function (text) {
            var config = jsyaml.load(text) || {};
            if (config.title) document.title = config.title;
            document.querySelectorAll('[data-config]').forEach(function (element) {
                var key = element.getAttribute('data-config');
                if (Object.prototype.hasOwnProperty.call(config, key)) element.textContent = config[key];
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        loadConfig();
        Object.keys(files).forEach(function (name) {
            renderMarkdown(name, name + '-md');
        });
    });
})();
