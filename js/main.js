import { proteinProducts, diagnosisQuestions } from './data.js';

// 状態管理（診断の進捗と回答データ）
const state = {
  currentStep: 0,
  answers: {}, // 例: { q1: { value: 'muscle', scores: {...} }, ... }
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
          <button class="p-diagnosis__option-btn js-option-btn">
            ${opt.label}
          </button>
        `).join('')}
      </div>
      ${state.currentStep > 0 ? `
        <button class="p-diagnosis__back-btn js-back-btn">← 前の質問に戻る</button>
      ` : ''}
    </div>
  `;

  // イベントリスナーの登録（インデックスでスコア情報を正確に取得）
  container.querySelectorAll('.js-option-btn').forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const selectedOption = q.options[index];
      state.answers[`q${q.id}`] = {
        value: selectedOption.value,
        scores: selectedOption.scores
      };
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

// 2. 診断結果の計算ロジック（スコア合算方式）
function calculateResult() {
  const totalScores = {
    'whey-standard': 0,
    'soy-beauty': 0,
    'isolate-pure': 0
  };

  // 全回答のスコアを加算
  Object.keys(state.answers).forEach(qKey => {
    const answer = state.answers[qKey];
    if (answer && answer.scores) {
      Object.keys(answer.scores).forEach(productId => {
        if (totalScores[productId] !== undefined) {
          totalScores[productId] += answer.scores[productId];
        }
      });
    }
  });

  // 最高スコアの商品を選定
  let bestProductId = 'whey-standard';
  let maxScore = -Infinity;

  Object.keys(totalScores).forEach(productId => {
    if (totalScores[productId] > maxScore) {
      maxScore = totalScores[productId];
      bestProductId = productId;
    }
  });

  state.selectedProduct = proteinProducts.find(p => p.id === bestProductId) || proteinProducts[0];
}

// 3. 診断結果の描画
function renderResult(container) {
  const product = state.selectedProduct;
  
  const shareText = encodeURIComponent(`私におすすめのプロテインは【${product.name}】でした！ #パーソナルプロテイン診断`);
  const shareUrl = encodeURIComponent(window.location.href);

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

  // Q3の回答から飲用回数を取得
  const timesPerDay = parseInt(state.answers.q3?.value || '1', 10);
  const monthlyServings = timesPerDay * 30;

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