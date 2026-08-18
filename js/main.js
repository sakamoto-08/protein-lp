import { proteinProducts, diagnosisQuestions } from './data.js';

// 状態管理（診断の進捗と回答データ）
const state = {
  currentStep: 0,
  answers: {},
  selectedProduct: null
};

// 初期化処理
document.addEventListener('DOMContentLoaded', () => {
  renderQuestion();
});

// 1. 質問カードの描画処理
function renderQuestion() {
  const container = document.querySelector('.js-diagnosis-container');
  if (!container) return;

  // 全ての質問に答え終えた場合（結果表示へ）
  if (state.currentStep >= diagnosisQuestions.length) {
    calculateResult();
    renderResult(container);
    renderSimulator();
    return;
  }

  const q = diagnosisQuestions[state.currentStep];
  const progressPercent = ((state.currentStep + 1) / diagnosisQuestions.length) * 100;

  container.innerHTML = `
    <div class="p-diagnosis__card">
      <div class="p-diagnosis__progress">
        <div class="p-diagnosis__progress-bar" style="width: ${progressPercent}%"></div>
      </div>
      <p class="p-diagnosis__step">STEP ${state.currentStep + 1} / ${diagnosisQuestions.length}</p>
      <h3 style="margin: 1rem 0; font-size: 1.25rem;">${q.question}</h3>
      <div class="p-diagnosis__options">
        ${q.options.map((opt) => `
          <button class="p-diagnosis__option-btn js-option-btn" data-value="${opt.value}">
            ${opt.label}
          </button>
        `).join('')}
      </div>
      ${state.currentStep > 0 ? `
        <button class="p-diagnosis__back-btn js-back-btn">← 前の質問に戻る</button>
      ` : ''}
    </div>
  `;

  // イベントリスナーの登録
  container.querySelectorAll('.js-option-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      state.answers[`q${q.id}`] = e.currentTarget.dataset.value;
      state.currentStep++;
      renderQuestion();
    });
  });

  const backBtn = container.querySelector('.js-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      state.currentStep--;
      renderQuestion();
    });
  }
}

// 2. 診断結果の計算ロジック
function calculateResult() {
  const goal = state.answers.q1 || 'muscle';
  // ユーザーの目的にマッチする商品を検索（なければ先頭の商品）
  state.selectedProduct = proteinProducts.find(p => p.targetGoal === goal) || proteinProducts[0];
}

// 3. 診断結果の描画（SNSシェア機能追加）
function renderResult(container) {
  const product = state.selectedProduct;
  
  // SNS共有用のテキストとURLを準備
  const shareText = encodeURIComponent(`私におすすめのプロテインは【${product.name}】でした！ #パーソナルプロテイン診断`);
  const shareUrl = encodeURIComponent(window.location.href);

  // 共有用URLの生成
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${shareUrl}`;

  container.innerHTML = `
    <div class="p-diagnosis__card" style="border: 2px solid var(--color-primary);">
      <p style="color: var(--color-primary); font-weight: bold;">あなたにおすすめのプロテイン</p>
      <h3 style="font-size: 1.5rem; margin: 0.5rem 0;">${product.name}</h3>
      <p style="color: var(--color-text-sub); margin-bottom: 1rem;">タイプ: ${product.type}</p>
      <p style="background: var(--color-bg-light); padding: 1rem; border-radius: var(--radius-md); font-size: 0.95rem;">
        ${product.feature}
      </p>
      
      <!-- SNSシェアエリア -->
      <div style="margin-top: 1.5rem; text-align: center;">
        <p style="font-size: 0.875rem; color: var(--color-text-sub); margin-bottom: 0.5rem;">診断結果をシェアする</p>
        <a href="${twitterUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 0.5rem 1rem; background-color: #000; color: #fff; border-radius: 4px; text-decoration: none; margin-right: 0.5rem; font-size: 0.875rem;">
          𝕏 でシェア
        </a>
        <a href="${lineUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 0.5rem 1rem; background-color: #06C755; color: #fff; border-radius: 4px; text-decoration: none; font-size: 0.875rem;">
          LINE で送る
        </a>
      </div>

      <button class="c-btn c-btn--primary" style="margin-top: 1.5rem; width: 100%;" onclick="document.getElementById('simulator').scrollIntoView({behavior: 'smooth'})">
        月額コスト・比較シミュレーターを見る ↓
      </button>
    </div>
  `;
}

// 4. 比較・シミュレーターエリアの動的描画
function renderSimulator() {
  const container = document.querySelector('.js-simulator-container');
  if (!container) return;

  const timesPerDay = parseInt(state.answers.q2 || '1', 10);
  const monthlyServings = timesPerDay * 30; // 1ヶ月（30日換算）の必要食数

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
          ${proteinProducts.map(p => {
            const bagsNeeded = Math.ceil(monthlyServings / p.servingsPerBag);
            const monthlyCost = bagsNeeded * p.pricePerBag;
            const isRecommended = state.selectedProduct && state.selectedProduct.id === p.id;

            return `
              <tr style="border-bottom: 1px solid var(--color-border); ${isRecommended ? 'background-color: #eff6ff;' : ''}">
                <td style="padding: 1rem; font-weight: bold;">
                  ${p.name}
                  ${isRecommended ? '<span style="display:inline-block; margin-left:0.5rem; font-size:0.75rem; background:var(--color-primary); color:white; padding:0.1rem 0.5rem; border-radius:4px;">おすすめ</span>' : ''}
                </td>
                <td style="padding: 1rem; text-align: center;">${p.proteinPerServing}g</td>
                <td style="padding: 1rem; text-align: right;">¥${p.pricePerBag.toLocaleString()}</td>
                <td style="padding: 1rem; text-align: right; font-weight: bold; color: var(--color-primary);">
                  ¥${monthlyCost.toLocaleString()} <span style="font-size: 0.8rem; font-weight: normal; color: var(--color-text-sub);">(${bagsNeeded}袋)</span>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}