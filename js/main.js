import { proteinProducts, diagnosisQuestions } from "./data.js";

// 定数定義（マジックナンバー回避）
const DAYS_IN_MONTH = 30;
const LOADING_DURATION_MS = 1500;

// XSS対策用エスケープ関数
function escapeHTML(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 状態管理
const state = {
  currentStep: 0,
  answers: {},
  selectedProduct: null,
};

document.addEventListener("DOMContentLoaded", () => {
  renderQuestion();
  initContactForm();
});

// 1. 質問カードの描画処理
function renderQuestion() {
  const container = document.querySelector(".js-diagnosis-container");
  if (!container) return;

  if (state.currentStep >= diagnosisQuestions.length) {
    showLoadingThenResult(container);
    return;
  }

  const q = diagnosisQuestions[state.currentStep];
  const progressPercent =
    ((state.currentStep + 1) / diagnosisQuestions.length) * 100;

  container.innerHTML = `
    <div class="p-diagnosis__card">
      <div class="p-diagnosis__progress">
        <div class="p-diagnosis__progress-bar" style="width: ${progressPercent}%"></div>
      </div>
      <p class="p-diagnosis__step">STEP ${state.currentStep + 1} / ${diagnosisQuestions.length}</p>
      <h3 style="margin: 1rem 0; font-size: 1.25rem;">${escapeHTML(q.question)}</h3>
      <div class="p-diagnosis__options">
        ${q.options
          .map(
            (opt) => `
          <button class="p-diagnosis__option-btn js-option-btn">
            ${escapeHTML(opt.label)}
          </button>
        `,
          )
          .join("")}
      </div>
      ${
        state.currentStep > 0
          ? `
        <button class="p-diagnosis__back-btn js-back-btn">← 前の質問に戻る</button>
      `
          : ""
      }
    </div>
  `;

  container.querySelectorAll(".js-option-btn").forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const selectedOption = q.options[index];
      state.answers[`q${q.id}`] = {
        value: selectedOption.value,
        scores: selectedOption.scores,
      };
      state.currentStep++;
      renderQuestion();
    });
  });

  const backBtn = container.querySelector(".js-back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      state.currentStep--;
      renderQuestion();
    });
  }
}

// 2. 診断完了後のローディング演出
function showLoadingThenResult(container) {
  renderLoading(container);

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const delay = prefersReducedMotion ? 0 : LOADING_DURATION_MS;

  setTimeout(() => {
    calculateResult();
    renderResult(container);
    renderSimulator();
    scrollToSection("diagnosis");
  }, delay);
}

function renderLoading(container) {
  container.innerHTML = `
    <div class="p-diagnosis__card p-diagnosis__loading" role="status" aria-live="polite" aria-busy="true">
      <div class="p-diagnosis__loading-spinner" aria-hidden="true"></div>
      <p class="p-diagnosis__loading-text">あなたに最適なプロテインを分析中...</p>
      <p class="p-diagnosis__loading-sub">回答内容をもとに最適な商品を選定しています</p>
    </div>
  `;
}

// ヘッダー高さを考慮したスムーススクロール
function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;

  const header = document.querySelector(".l-header");
  const headerHeight = header?.offsetHeight ?? 0;
  const top =
    target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

  window.scrollTo({ top, behavior: "smooth" });
}

// 3. 診断結果の計算ロジック（積算スコアの動的初期化）
function calculateResult() {
  // 商品データから動的にスコアオブジェクトを生成（ハードコーディング回避）
  const totalScores = proteinProducts.reduce((acc, product) => {
    acc[product.id] = 0;
    return acc;
  }, {});

  Object.keys(state.answers).forEach((qKey) => {
    const answer = state.answers[qKey];
    if (answer && answer.scores) {
      Object.keys(answer.scores).forEach((productId) => {
        if (totalScores[productId] !== undefined) {
          totalScores[productId] += answer.scores[productId];
        }
      });
    }
  });

  let bestProductId = proteinProducts[0]?.id || "";
  let maxScore = -Infinity;

  Object.keys(totalScores).forEach((productId) => {
    if (totalScores[productId] > maxScore) {
      maxScore = totalScores[productId];
      bestProductId = productId;
    }
  });

  state.selectedProduct =
    proteinProducts.find((p) => p.id === bestProductId) || proteinProducts[0];
}

// 4. 診断結果の描画
function renderResult(container) {
  const product = state.selectedProduct;

  const shareText = encodeURIComponent(
    `私におすすめのプロテインは【${product.name}】でした！ #パーソナルプロテイン診断`,
  );
  const shareUrl = encodeURIComponent(window.location.href);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${shareUrl}`;

  container.innerHTML = `
    <div class="p-diagnosis__card" style="border: 2px solid var(--color-primary);">
      <p style="color: var(--color-primary); font-weight: bold;">あなたにおすすめのプロテイン</p>
      <h3 style="font-size: 1.5rem; margin: 0.5rem 0;">${escapeHTML(product.name)}</h3>
      <p style="color: var(--color-text-sub); margin-bottom: 1rem;">タイプ: ${escapeHTML(product.type)}</p>
      <p style="background: var(--color-bg-light); padding: 1rem; border-radius: var(--radius-md); font-size: 0.95rem;">
        ${escapeHTML(product.feature)}
      </p>
      
      <div style="margin-top: 1.5rem; text-align: center;">
        <p style="font-size: 0.875rem; color: var(--color-text-sub); margin-bottom: 0.5rem;">診断結果をシェアする</p>
        <a href="${twitterUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 0.5rem 1rem; background-color: #000; color: #fff; border-radius: 4px; text-decoration: none; margin-right: 0.5rem; font-size: 0.875rem;">
          𝕏 でシェア
        </a>
        <a href="${lineUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 0.5rem 1rem; background-color: #06C755; color: #fff; border-radius: 4px; text-decoration: none; font-size: 0.875rem;">
          LINE で送る
        </a>
      </div>

      <button id="scrollToSimulatorBtn" class="c-btn c-btn--primary" style="margin-top: 1.5rem; width: 100%;">
        月額コスト・比較シミュレーターを見る ↓
      </button>
    </div>
  `;

  // onclick属性を使わずJSイベントとして分離（保守性・安全性の向上）
  const scrollBtn = container.querySelector("#scrollToSimulatorBtn");
  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
      scrollToSection("simulator");
    });
  }
}

// 5. シミュレーター描画（定数活用）
function renderSimulator() {
  const container = document.querySelector(".js-simulator-container");
  if (!container) return;

  const timesPerDay = parseInt(state.answers.q3?.value || "1", 10);
  const monthlyServings = timesPerDay * DAYS_IN_MONTH;

  container.innerHTML = `
    <h2 class="c-heading-primary">1ヶ月のコスト比較シミュレーション</h2>
    <p style="text-align: center; margin-bottom: 2rem; color: var(--color-text-sub);">
      想定使用ペース：<strong>1日 ${timesPerDay} 回</strong>（月間約 ${monthlyServings} 食）
    </p>

    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; background: var(--color-white); border-radius: var(--radius-md); overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <thead>
          <tr style="background-color: var(--color-bg-light); border-bottom: 2px solid var(--color-border);">
            <th style="padding: 1rem; text-align: left;">商品名</th>
            <th style="padding: 1rem; text-align: center;">1食分タンパク質</th>
            <th style="padding: 1rem; text-align: right;">1個(1kg)価格</th>
            <th style="padding: 1rem; text-align: right; color: var(--color-primary);">目安月額コスト</th>
          </tr>
        </thead>
        <tbody>
          ${proteinProducts
            .map((p) => {
              const bagsNeeded = Math.ceil(monthlyServings / p.servingsPerBag);
              const monthlyCost = bagsNeeded * p.pricePerBag;
              const isRecommended =
                state.selectedProduct && state.selectedProduct.id === p.id;

              return `
              <tr style="border-bottom: 1px solid var(--color-border); ${isRecommended ? "background-color: #eff6ff;" : ""}">
                <td style="padding: 1rem; font-weight: bold;">
                  ${escapeHTML(p.name)}
                  ${isRecommended ? '<span style="display:inline-block; margin-left:0.5rem; font-size:0.75rem; background:var(--color-primary); color:white; padding:0.1rem 0.5rem; border-radius:4px;">おすすめ</span>' : ""}
                </td>
                <td style="padding: 1rem; text-align: center;">${p.proteinPerServing}g</td>
                <td style="padding: 1rem; text-align: right;">¥${p.pricePerBag.toLocaleString()}</td>
                <td style="padding: 1rem; text-align: right; font-weight: bold; color: var(--color-primary);">
                  ¥${monthlyCost.toLocaleString()} <span style="font-size: 0.8rem; font-weight: normal; color: var(--color-text-sub);">(${bagsNeeded}袋)</span>
                </td>
              </tr>
            `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

// 6. フォーム送信処理（関数として独立）
function initContactForm() {
  const form = document.getElementById("contactForm");
  const nameInput = document.getElementById("userName");
  const emailInput = document.getElementById("userEmail");
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const successBox = document.getElementById("contactSuccess");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    if (nameInput.value.trim() === "") {
      nameError.textContent = "お名前を入力してください。";
      nameInput.classList.add("error");
      isValid = false;
    } else {
      nameError.textContent = "";
      nameInput.classList.remove("error");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      emailError.textContent = "正しいメールアドレスの形式で入力してください。";
      emailInput.classList.add("error");
      isValid = false;
    } else {
      emailError.textContent = "";
      emailInput.classList.remove("error");
    }

    if (isValid) {
      form.style.display = "none";
      successBox.style.display = "block";
    }
  });
}
