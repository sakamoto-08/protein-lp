// プロテイン商品データ
export const proteinProducts = [
  {
    id: 'whey-standard',
    name: 'ホエイプロテイン スタンダード',
    type: 'ホエイ（WPC）',
    flavor: 'リッチショコラ / バナナ / イチゴ',
    pricePerBag: 4200,        // 1kg（30食分）の価格（円）
    servingsPerBag: 30,       // 1袋の食数
    proteinPerServing: 21,    // 1食あたりのタンパク質量(g)
    feature: 'コスパ抜群！日常的にトレーニングや栄養補給をしたい方に最適。',
    targetGoal: 'muscle'
  },
  {
    id: 'soy-beauty',
    name: 'ソイプロテイン ビューティープラス',
    type: 'ソイ（大豆）',
    flavor: '黒糖きなこ / カフェオレ',
    pricePerBag: 4800,
    servingsPerBag: 30,
    proteinPerServing: 18,
    feature: '消化吸収が穏やかで高腹持ち。間食の置き換えやダイエットに最適。',
    targetGoal: 'diet'
  },
  {
    id: 'isolate-pure',
    name: 'WPI アイソレート プレーン',
    type: 'ホエイ（WPI）',
    flavor: 'プレーン / プレミアムバニラ',
    pricePerBag: 6200,
    servingsPerBag: 30,
    proteinPerServing: 26,
    feature: '高タンパク・低脂質。乳糖を極限までカットしお腹に優しいハイスペック仕様。',
    targetGoal: 'performance'
  }
];

// 診断クイズデータ（スコア加算方式）
export const diagnosisQuestions = [
  {
    id: 1,
    question: 'Q1. プロテインを飲む主な目的は何ですか？',
    options: [
      {
        label: '筋肉をつけて体を引き締めたい・ボディメイク',
        value: 'muscle',
        scores: { 'whey-standard': 3, 'soy-beauty': 0, 'isolate-pure': 2 }
      },
      {
        label: 'ダイエット中の間食・一食置き換えにしたい',
        value: 'diet',
        scores: { 'whey-standard': 0, 'soy-beauty': 3, 'isolate-pure': 0 }
      },
      {
        label: '本格的なトレーニング・運動パフォーマンス向上',
        value: 'performance',
        scores: { 'whey-standard': 1, 'soy-beauty': 0, 'isolate-pure': 3 }
      }
    ]
  },
  {
    id: 2,
    question: 'Q2. 牛乳やお腹の状態について当てはまるものは？',
    options: [
      {
        label: '牛乳を飲むとお腹がゴロゴロ・張ることがある',
        value: 'sensitive',
        scores: { 'whey-standard': -2, 'soy-beauty': 2, 'isolate-pure': 3 }
      },
      {
        label: '特に問題なく牛乳を飲める',
        value: 'normal',
        scores: { 'whey-standard': 1, 'soy-beauty': 0, 'isolate-pure': 1 }
      }
    ]
  },
  {
    id: 3,
    question: 'Q3. 1日にプロテインを何回飲む予定ですか？',
    options: [
      {
        label: '1日 1回（手軽に習慣化したい）',
        value: '1',
        scores: { 'whey-standard': 1, 'soy-beauty': 1, 'isolate-pure': 1 }
      },
      {
        label: '1日 2回（朝と運動後などに補給）',
        value: '2',
        scores: { 'whey-standard': 1, 'soy-beauty': 1, 'isolate-pure': 2 }
      },
      {
        label: '1日 3回（しっかりと栄養管理したい）',
        value: '3',
        scores: { 'whey-standard': 1, 'soy-beauty': 0, 'isolate-pure': 3 }
      }
    ]
  }
];