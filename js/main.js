import { diagnosisQuestions , products, calculateResult } from "./data.js";

//==============================================
// 1. アプリケーションの状態管理（State）
//==============================================
const state = {
    currentStep: 0,
    answers: {},
    selectedProduct: null,
    quantity: 1,
};

//==============================================
// 2. 初期化
//==============================================
document.addEventListener("DOMContentLoaded", () => {
    renderQuestion();
});

//==============================================
// 3. 診断画面のレンダリング
//==============================================
function renderQuestion() {
    const container = document.querySelector(".js-diagnosis-container");
    if (!container) return;

    //全ての質問に回答し終えた場合
    if (state.currentStep >= diagnosisQuestions.length) {
        state.selectedProduct = calculateResult(state.answers);
        renderResult(container);
        renderSimulator();
        return;
    }

    //質問カードの描画
    const q = diagnosisQuestions[state.currentStep];
    const progressPercent = ((state.currentStep + 1) / diagnosisQuestions.length) * 100;

    container.innerHTML = `
    <div class="p-diagnosis__card">
      <div class="p-diagnosis__progress">
        <div class="p-diagnosis__progress-bar" style="width: ${progressPercent}%;"></div>
      </div>
      <p class="p-diagnosis__step">STEP ${state.currentStep + 1} / ${diagnosisQuestions.length}</p>
      <h3 class="p-diagnosis__question" style= "font-size: 1.25rem; font-weight: bold; margin: 1rem 0;">${q.question}</h3>
      <div class="p-diagnosis__options">
        ${q.options
            .map(
                (opt) => `
          <button class="c-btn p-diagnosis__option-btn" data-value="${opt.value}">
            ${opt.text}
          </button>
         `
            )
            .join("")}
      </div>
      ${
        state.currentStep > 0
            ? `<button class="p-diagnosis__back-btn js-back-btn">← 前の質問に戻る</button>`
            : ""
    }
    </div>
  `;

    //選択肢クリックイベント
    container.querySelectorAll(".p-diagnosis__option-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const val = e.currentTarget.dataset.value;
            state.answers[q.id] = val;
            state.currentStep++;
            renderQuestion();
        });
    });

    //戻るボタンイベント
    const backBtn = container.querySelector(".js-back-btn");
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            state.currentStep--;
            renderQuestion();
        });
    }
}

//==============================================
// 4. 診断結果画面のレンダリング
//==============================================
function renderResult(container) {
    const p = state.selectedProduct;

    container.innerHTML = `
    <div class="p-diagnosis__card p-diagnosis__result">
      <span class="p-diagnosis__badge">${p.tag}</span>
      <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">${p.catch}</h3>
      <div class="p-diagnosis__result-body">
        <img src="${p.image}" alt="${p.name}" class="p-diagnosis__img" />
        <div class="p-diagnosis__info">
          <h4 style="font-size: 1.1rem; font-weight: bold; margin-bottom: 0.5rem;">${p.name}</h4>
          <p class="p-diagnosis__price" style="margin-bottom: 0.5rem;">通常価格: <strong>¥${p.price.toLocaleString()}</strong> (税込)</p>
          <p class="p-diagnosis__desc" style="font-size: 0.9rem; color: #4b5563;">${p.desc}</p>
        </div>
      </div>
      <div class="p-diagnosis__actions" style="margin-top: 1.5rem;">
        <button class="c-btn c-btn--accent js-retry-btn">もう一度診断する</button>
        <a href="#contact" class="c-btn c-btn--primary">この商品で申し込む</a>
      </div>
    </div>
    `;

    // リトライボタンのイベント設定
    container.querySelector(".js-retry-btn").addEventListener("click", () => {
        state.currentStep = 0;
        state.answers = {};
        state.selectedProduct = null;
        state.quantity = 1;
        renderQuestion();

        // シミュレーターを初期状態に戻す
        const simulatorContainer = document.querySelector(".js-simulator-container");
        if (simulatorContainer) {
            simulatorContainer.innerHTML = `
            <h2 class="c-heading">プロテイン比較・シミュレーター</h2>
            <p style="text-align: center; color: #6b7280;">※パーソナル診断を完了すると、こちらに 価格計算と比較表が表示されます。</p>
            `;
        }
    });
}

//==============================================
// 5. シミュレーター（価格計算・比較表）のレンダリング
//==============================================
function renderSimulator() {
    const container = document.querySelector(".js-simulator-container");
    if (!container || !state.selectedProduct) return;

    const p = state.selectedProduct;

    // 数量変更のイベントリスナーを設定する内部関数
    const updateSimulator = () => {
        const totalPrice = p.price * state.quantity;

        container.innerHTML = `
        <h2 class="c-heading">プロテイン比較・シミュレーター</h2>
        <div class="p-simulator__calculator" style="margin: 2rem 0; padding: 1.5rem; background: #f9fafb; border-radius: 8px;">
          <h3 style="font-weight: bold; margin-bottom: 1rem;">【${p.name}】購入シミュレーション</h3>
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <label for="quantity-select">数量（個）:</label>
            <select id="quantity-select" style="padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc;">
              ${[1, 2, 3, 4, 5]
                  .map(
                      (num) => `
                <option value="${num}" ${state.quantity === num ? "selected" : ""}>${num}個</option>
              `
                  )
                  .join("")}
            </select>
          </div>
          <p style="font-size: 1.2rem;">合計金額: <strong style="color: #e11d48; font-size: 1.5rem;">¥${totalPrice.toLocaleString()}</strong> (税込)</p>
        </div>
      `;

        // 数量変更イベントの設定
        const selectEl = container.querySelector("#quantity-select");
        if (selectEl) {
            selectEl.addEventListener("change", (e) => {
                state.quantity = Number(e.target.value);
                updateSimulator();
            });
        }
    };

    updateSimulator();
}