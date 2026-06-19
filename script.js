/* =========================================================
   Acto Works（アクトワークス）― script.js
   初心者の方でも分かるよう、各処理にコメントを入れています。
   ========================================================= */

/* ★ JSが動いている印として html に .js を付けます。
   これがある時だけCSSがアニメ用にコンテンツを一旦隠します。
   万一このJSが読み込まれない場合は .js が付かず、文字や写真は普通に全部表示されます。 */
document.documentElement.classList.add("js");

/* 保険：読み込み完了から3秒たっても表示されていない（画面より上にある）要素は強制的に表示します */
window.addEventListener("load", function () {
  setTimeout(function () {
    document.querySelectorAll(".fade-in, .fade-in-left, .fade-in-right, .fade-zoom").forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) el.classList.add("is-visible");
    });
  }, 3000);
});

document.addEventListener("DOMContentLoaded", function () {

  /* -------------------------------------------------------
     1. スクロール演出（フェードイン／スライドイン／ズーム）
     ・画面に入るたび（2回目・3回目も）毎回アニメします
     ------------------------------------------------------- */
  const animTargets = document.querySelectorAll(".fade-in, .fade-in-left, .fade-in-right, .fade-zoom");
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, index) {
      if (entry.isIntersecting) {
        const delay = (entry.target.dataset.delay || (index % 4) * 80);
        setTimeout(function () { entry.target.classList.add("is-visible"); }, delay);
      } else {
        entry.target.classList.remove("is-visible"); // 画面外に出たら戻す → 再びアニメ
      }
    });
  }, { threshold: 0.12 });
  animTargets.forEach(function (el) { observer.observe(el); });


  /* -------------------------------------------------------
     1-2. 数字のカウントアップ（画面に入るたび0から増える）
     ------------------------------------------------------- */
  const counters = document.querySelectorAll(".count");
  function runCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400; // ミリ秒
    const startTime = performance.now();
    if (el._raf) cancelAnimationFrame(el._raf);
    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out
      el.textContent = Math.round(target * eased);
      if (progress < 1) el._raf = requestAnimationFrame(tick);
    }
    el._raf = requestAnimationFrame(tick);
  }
  const countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { runCount(entry.target); }
      else { entry.target.textContent = "0"; }
    });
  }, { threshold: 0.6 });
  counters.forEach(function (c) { countObserver.observe(c); });


  /* -------------------------------------------------------
     1-3. ヒーローのモックアップにマウス追従の視差
     ------------------------------------------------------- */
  const heroVisual = document.querySelector(".hero__visual");
  const floats = document.querySelectorAll(".float-1, .float-2");
  if (heroVisual && window.matchMedia("(pointer:fine)").matches) {
    heroVisual.addEventListener("mousemove", function (e) {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      floats.forEach(function (el, i) {
        const depth = (i + 1) * 14;
        el.style.transform = "translate(" + (x * depth) + "px," + (y * depth) + "px)";
      });
    });
    heroVisual.addEventListener("mouseleave", function () {
      floats.forEach(function (el) { el.style.transform = ""; });
    });
  }


  /* -------------------------------------------------------
     1-4. スクロールに連動する演出（進捗バー／ヘッダー／追従CTA）
     ------------------------------------------------------- */
  const progressBar = document.getElementById("scrollProgress");
  const header = document.querySelector(".header");
  const stickyCta = document.getElementById("stickyCta");
  const contactSection = document.getElementById("contact");

  function onScroll() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.width = (scrollTop / docHeight * 100) + "%";
    if (header) header.classList.toggle("is-scrolled", scrollTop > 40);
    if (stickyCta) {
      const contactTop = contactSection ? contactSection.getBoundingClientRect().top : Infinity;
      const show = scrollTop > 600 && contactTop > window.innerHeight * 0.5;
      stickyCta.classList.toggle("is-show", show);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();


  /* -------------------------------------------------------
     1-5. スマホ用ハンバーガーメニューの開閉
     ------------------------------------------------------- */
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      navToggle.classList.toggle("is-open");
      nav.classList.toggle("is-open");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navToggle.classList.remove("is-open");
        nav.classList.remove("is-open");
      });
    });
  }


  /* -------------------------------------------------------
     2. よくある質問（FAQ）の開閉
     ------------------------------------------------------- */
  document.querySelectorAll(".faq__q").forEach(function (question) {
    question.addEventListener("click", function () {
      question.parentElement.classList.toggle("is-open");
    });
  });


  /* -------------------------------------------------------
     3. ページ内リンクのスムーズスクロール（ヘッダー高さ分を調整）
     ------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      const id = link.getAttribute("href");
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.pageYOffset - 70;
          window.scrollTo({ top: top, behavior: "smooth" });
        }
      }
    });
  });

});


/* ---------------------------------------------------------
   4. お問い合わせフォームの送信処理（仮）
   ・今はデモ用に「送信されたフリ」をしてメッセージを表示します
   ・本番ではサーバー送信やメール送信プログラムに置き換えてください
   --------------------------------------------------------- */
function handleSubmit(event) {
  event.preventDefault();
  const note = document.getElementById("formNote");

  // 迷惑メール（ボット）対策：おとり項目(_gotcha)が入力されていたら、人ではないので送信しない
  var trap = event.target.querySelector('input[name="_gotcha"]');
  if (trap && trap.value !== "") {
    return false; // 何もせず無効化
  }

  note.textContent = "送信ありがとうございます。担当者より1営業日以内にご連絡します。";
  event.target.reset();
  return false;
}
