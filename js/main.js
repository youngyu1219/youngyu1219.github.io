/* =========================================================
   唐梓萌 · 个人站  ·  交互脚本
   - 导航：滚动变色 / 移动端抽屉 / 当前页高亮
   - 首屏滚动出场动画（IntersectionObserver）
   - 首页精选轮播（自动播放 / 圆点 / 左右键 / 触摸滑动）
   - 回到顶部
   ========================================================= */
(function () {
    'use strict';

    var body = document.body;
    var nav = document.querySelector('.nav');
    var solidAlways = body.classList.contains('nav-solid');

    var dateLabel = document.getElementById('current-date');
    if (dateLabel) {
        dateLabel.textContent = new Intl.DateTimeFormat('sv-SE').format(new Date());
    }

    var dateLabel = document.getElementById('current-date');
    if (dateLabel) {
        dateLabel.textContent = new Intl.DateTimeFormat('sv-SE').format(new Date());
    }

    /* ---------- 导航滚动变色 ---------- */
    function onScrollNav() {
        if (!nav) return;
        if (solidAlways) {
            nav.classList.add('solid');
        } else if (window.scrollY > 60) {
            nav.classList.add('solid');
        } else {
            nav.classList.remove('solid');
        }
    }
    window.addEventListener('scroll', onScrollNav, { passive: true });
    onScrollNav();

    /* ---------- 移动端抽屉 ---------- */
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (toggle && links) {
        toggle.addEventListener('click', function () {
            toggle.classList.toggle('open');
            links.classList.toggle('open');
        });
        links.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                toggle.classList.remove('open');
                links.classList.remove('open');
            });
        });
    }

    /* ---------- 当前页高亮 ---------- */
    var path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (a) {
        var href = (a.getAttribute('href') || '').split('/').pop();
        if (href === path) a.classList.add('active');
    });

    /* ---------- 滚动出场 ---------- */
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && reveals.length) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('in');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('in'); });
    }

    function initCarousel() {
        var carousel = document.querySelector('.carousel');
        if (carousel) {
            var track = carousel.querySelector('.carousel-track');
            var slides = Array.prototype.slice.call(carousel.querySelectorAll('.slide'));
            var dotsWrap = carousel.querySelector('.carousel-dots');
            var prevBtn = carousel.querySelector('.carousel-btn.prev');
            var nextBtn = carousel.querySelector('.carousel-btn.next');
            var index = 0;
            var timer = null;
            var total = slides.length;
    
            // 生成圆点
            if (dotsWrap) {
                slides.forEach(function (_, i) {
                    var b = document.createElement('button');
                    b.setAttribute('aria-label', '第 ' + (i + 1) + ' 张');
                    if (i === 0) b.classList.add('active');
                    b.addEventListener('click', function () { goTo(i); restart(); });
                    dotsWrap.appendChild(b);
                });
            }
            var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.children) : [];
    
            function goTo(i) {
                index = (i + total) % total;
                track.style.transform = 'translateX(' + (-index * 100) + '%)';
                slides.forEach(function (s, k) { s.classList.toggle('is-active', k === index); });
                dots.forEach(function (d, k) { d.classList.toggle('active', k === index); });
            }
            function next() { goTo(index + 1); }
            function prev() { goTo(index - 1); }
            function start() { timer = setInterval(next, 5200); }
            function stop() { clearInterval(timer); }
            function restart() { stop(); start(); }
            function trigger(dir) { dir > 0 ? next() : prev(); restart(); }
    
            if (nextBtn) nextBtn.addEventListener('click', function () { trigger(1); });
            if (prevBtn) prevBtn.addEventListener('click', function () { trigger(-1); });
    
            carousel.addEventListener('mouseenter', stop);
            carousel.addEventListener('mouseleave', start);
    
            // 触摸滑动
            var startX = 0, endX = 0;
            carousel.addEventListener('touchstart', function (e) {
                startX = e.changedTouches[0].clientX; stop();
            }, { passive: true });
            carousel.addEventListener('touchend', function (e) {
                endX = e.changedTouches[0].clientX;
                var dx = endX - startX;
                if (Math.abs(dx) > 45) { trigger(dx < 0 ? 1 : -1); } else { start(); }
            }, { passive: true });
    
            // 键盘
            document.addEventListener('keydown', function (e) {
                if (e.key === 'ArrowRight') trigger(1);
                if (e.key === 'ArrowLeft') trigger(-1);
            });
    
            goTo(0);
            start();
        }
    }
    document.addEventListener('featured-ready', initCarousel);
    if (document.getElementById('featured-projects') && document.getElementById('featured-projects').children.length) initCarousel();

    /* ---------- 回到顶部 ---------- */
    var topBtn = document.createElement('button');
    topBtn.className = 'to-top';
    topBtn.setAttribute('aria-label', '回到顶部');
    topBtn.innerHTML = '↑';
    document.body.appendChild(topBtn);
    topBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', function () {
        if (window.scrollY > 700) topBtn.classList.add('show');
        else topBtn.classList.remove('show');
    }, { passive: true });

    /* ---------- 页内锚点平滑滚动（补充 CSS） ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var id = a.getAttribute('href');
            if (id.length > 1) {
                var target = document.querySelector(id);
                if (target) {
                    e.preventDefault();
                    var top = target.getBoundingClientRect().top + window.scrollY - 70;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }
            }
        });
    });
})();
