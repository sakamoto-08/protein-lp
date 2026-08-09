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
        <div class="p-diagnosis__bar" style="width: ${progressPercent}%;"></div>
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
            ? `<button class="p-diagnosis__back-btn">← 前の質問に戻る</button>`
            : ""
    }
    </dib>
  `;

    //選択肢クリックイベント
    container.querySelectorAll(".p-diagnosis__option-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const val = e.currentTarget.dateset.value;
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