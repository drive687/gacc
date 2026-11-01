/* GACC 档案库 · 声音控制
 * 1) 全局点击反馈音效
 * 2) 按 <body data-page-id> 调度背景音乐
 *    进页面即尝试自动播放；若被浏览器自动播放策略拦截，则在第一次点击/触摸时自动响起。
 */
(function () {
  'use strict';

  var AUDIO_DIR = 'assets/audio/';

  // ---- 点击反馈音效 ----
  var click = new Audio(AUDIO_DIR + 'ui-click.mp3');
  click.preload = 'auto';

  function playClick() {
    try {
      click.currentTime = 0;
      var p = click.play();
      if (p && typeof p.catch === 'function') { p.catch(function () {}); }
    } catch (e) {}
  }

  // ---- 背景音乐 ----
  function resolvePageId() {
    var id = document.body ? document.body.getAttribute('data-page-id') : '';
    if (id) return id;
    var last = location.pathname.split('/').pop() || '';
    return last.replace(/\.html?$/i, '') || 'index';
  }

  var bgm = new Audio(AUDIO_DIR + 'bgm-' + resolvePageId() + '.mp3');
  bgm.loop = true;
  bgm.preload = 'auto'; // 预加载，以便尽快响起

  var started = false;

  function setOn(btn, on) {
    if (!btn) return;
    if (on) {
      btn.classList.add('is-on');
      btn.setAttribute('aria-pressed', 'true');
      btn.setAttribute('aria-label', '关闭背景音乐');
    } else {
      btn.classList.remove('is-on');
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', '开启背景音乐');
    }
  }

  function armAutoPlay(btn) {
    function go() {
      if (started || !bgm.paused) { started = true; setOn(btn, true); return; }
      var p = null;
      try { p = bgm.play(); } catch (e) { p = null; }
      if (p && typeof p.then === 'function') {
        p.then(function () { started = true; setOn(btn, true); }).catch(function () {});
      } else {
        started = true; setOn(btn, true);
      }
    }
    ['click', 'touchstart', 'keydown'].forEach(function (ev) {
      document.addEventListener(ev, go, { once: true, passive: true });
    });
  }

  function tryAutoPlay(btn) {
    if (started || !bgm.paused) { started = true; setOn(btn, true); return; }
    var p = null;
    try { p = bgm.play(); } catch (e) { p = null; }
    var onOk = function () { started = true; setOn(btn, true); };
    if (p && typeof p.then === 'function') {
      p.then(onOk).catch(function () { armAutoPlay(btn); });
    } else {
      onOk();
    }
  }

  function toggleBgm(btn) {
    if (bgm.paused) {
      var p = null;
      try { p = bgm.play(); } catch (e) { p = null; }
      if (p && typeof p.then === 'function') {
        p.then(function () { started = true; setOn(btn, true); }).catch(function () {});
      } else {
        started = true; setOn(btn, true);
      }
    } else {
      bgm.pause();
      started = false;
      setOn(btn, false);
    }
  }

  function injectToggle() {
    var inner = document.querySelector('.topbar-inner');
    var classification = document.querySelector('.classification');
    if (!inner || !classification) return null;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sound-toggle';
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', '开启背景音乐');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>' +
        '<g class="wave">' +
          '<path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>' +
          '<path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>' +
        '</g>' +
      '</svg>' +
      '<span class="sound-toggle-label">环境音</span>';

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      playClick();
      toggleBgm(btn);
    });

    var right = document.createElement('div');
    right.className = 'topbar-right';
    right.appendChild(classification);
    right.appendChild(btn);
    inner.appendChild(right);

    return btn;
  }

  document.addEventListener('click', playClick);

  function init() {
    var btn = injectToggle();
    if (btn) { tryAutoPlay(btn); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();