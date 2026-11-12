/* Static moments: edit the entries below to update this page. */
(function () {
    var entries = [
        { date: '2026-11-11', text: '欢迎来到我的个人主页。这里会记录学习、项目和生活里的小片段。', image: '' },
        { date: '2026-10-20', text: '把想法认真记下来，灵感和进步就都有迹可循。', image: '' }
    ];
    var feed = document.getElementById('feed');
    var esc = function (s) {
        return String(s || '').replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    };
    document.querySelectorAll('#notice, #adminBar, #composer, #loginModal').forEach(function (el) { el.remove(); });
    if (!entries.length) {
        feed.innerHTML = '<p style="text-align:center;color:var(--ink-faint);font-family:var(--font-serif)">还没有动态，欢迎常来看看。</p>';
        return;
    }
    entries.forEach(function (entry) {
        var card = document.createElement('article');
        card.className = 'moment-card reveal in';
        card.innerHTML = '<div class="moment-head"><div class="m-avatar">唐</div><div><div class="moment-name">唐梓萌</div><div class="moment-time">' + esc(entry.date) + '</div></div></div>' +
            '<div class="moment-text">' + esc(entry.text) + '</div>' +
            (entry.image ? '<div class="moment-img"><img src="' + esc(entry.image) + '" alt="动态图片" loading="lazy"></div>' : '');
        feed.appendChild(card);
    });
})();
