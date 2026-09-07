/* 小小接线生 · 共享交互 */
(function () {
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* 分段页签：容器[data-seg] 内 button[data-segbtn=x] 控制 section[data-segpage=x] */
  $$('[data-seg]').forEach(function (seg) {
    seg.addEventListener('click', function (e) {
      var b = e.target.closest('[data-segbtn]');
      if (!b) return;
      var root = seg.parentElement;
      $$('[data-segbtn]', seg).forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      $$('[data-segpage]', root).forEach(function (p) {
        p.classList.toggle('on', p.getAttribute('data-segpage') === b.getAttribute('data-segbtn'));
      });
      if (typeof window.onSegChange === 'function') window.onSegChange();
    });
  });

  /* 猜一猜：.guess 内点选 .guess-opt */
  $$('.guess').forEach(function (g) {
    g.addEventListener('click', function (e) {
      var b = e.target.closest('.guess-opt');
      if (!b) return;
      $$('.guess-opt', g).forEach(function (x) { x.classList.remove('picked'); });
      b.classList.add('picked');
    });
  });

  /* 步骤点击标记完成 */
  $$('ol.steps').forEach(function (ol) {
    ol.addEventListener('click', function (e) {
      var li = e.target.closest('li');
      if (li) li.classList.toggle('done');
    });
  });

  /* 需要持久化的复选框：<input type=checkbox data-persist="唯一id"> */
  var store = null;
  try { store = window.localStorage; store.getItem('__t'); } catch (e) { store = null; }
  $$('input[type=checkbox][data-persist]').forEach(function (cb) {
    var k = 'xiaoxiao:' + cb.getAttribute('data-persist');
    if (store && store.getItem(k) === '1') {
      cb.checked = true;
      var li0 = cb.closest('li'); if (li0) li0.classList.add('off');
    }
    cb.addEventListener('change', function () {
      if (store) { try { cb.checked ? store.setItem(k, '1') : store.removeItem(k); } catch (e) {} }
      var li = cb.closest('li');
      if (li && cb.hasAttribute('data-shop')) li.classList.toggle('off', cb.checked);
      if (typeof window.onCheckChange === 'function') window.onCheckChange();
    });
    /* 采购清单语义：勾选=家里有（划掉，不计价） */
    if (cb.hasAttribute('data-shop')) {
      var li2 = cb.closest('li'); if (li2 && cb.checked) li2.classList.add('off');
    }
  });
})();
