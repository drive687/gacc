/* GACC 档案库 · 内容保护脚本
 * 用于拦截普通访客的右键 / 保存 / 复制 / 查看源码 / 图片拖拽等操作。
 * 说明：属威慑性加固，可阻止普通用户误操作与顺手复制，无法阻止刻意下载。
 */
(function () {
  var MSG = "⚠️ 本档案为 GACC 机密内容，禁止复制、保存或下载。";

  // 轻量提示气泡
  function toast(msg) {
    var div = document.getElementById("gacc-guard-toast");
    if (!div) {
      div = document.createElement("div");
      div.id = "gacc-guard-toast";
      div.style.cssText =
        "position:fixed;left:50%;bottom:30px;transform:translateX(-50%) translateY(20px);opacity:0;transition:all .25s ease;z-index:9999;background:rgba(14,17,22,.97);color:#e8ebef;border:1px solid #e5484d;border-left:3px solid #e5484d;padding:9px 18px;font:700 14px/1.5 ui-sans-serif,system-ui,-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;letter-spacing:.02em;border-radius:6px;box-shadow:0 8px 26px rgba(0,0,0,.5);pointer-events:none;white-space:nowrap;max-width:84vw;";
      document.body.appendChild(div);
    }
    div.textContent = msg;
    div.style.opacity = "1";
    div.style.transform = "translateX(-50%) translateY(0)";
    clearTimeout(div._t);
    div._t = setTimeout(function () {
      div.style.opacity = "0";
      div.style.transform = "translateX(-50%) translateY(20px)";
    }, 1700);
  }

  // 1. 禁止右键菜单
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    toast(MSG);
  });

  // 2. 拦截常用保存 / 查看源码 / 复制 / 打印 / 全选快捷键
  document.addEventListener("keydown", function (e) {
    var onMac = /Mac/i.test(navigator.platform);
    var mod = onMac ? e.metaKey : e.ctrlKey;
    if (!mod) return;
    var k = (e.key || "").toLowerCase();
    if (["s", "u", "c", "x", "p", "a", "s"].indexOf(k) !== -1) {
      e.preventDefault();
      toast(MSG);
    }
  });

  // 3. 禁止图片拖拽另存
  document.addEventListener("dragstart", function (e) {
    if (e.target && e.target.tagName === "IMG") {
      e.preventDefault();
      toast(MSG);
    }
  });

  // 4. 禁止双击选中文字，进一步防整段复制
  document.addEventListener("dblclick", function (e) {
    if (document.getSelection) document.getSelection().removeAllRanges();
  });
})();