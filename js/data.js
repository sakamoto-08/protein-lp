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
      feature: 'コスパ抜群！初心者からトレーニーまで幅広くおすすめ',
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
      feature: '高腹持ちでダイエットや引き締めに最適',
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
      feature: '高タンパク・低脂質。お腹がゴロゴロしやすい方にも最適',
      targetGoal: 'performance'
    }
  ];
  
  // 診断クイズデータ
  export const diagnosisQuestions = [
    {
      id: 1,
      question: 'Q1. プロテインを飲む主な目的は何ですか？',
      options: [
        { label: '筋肉をつけて体を大きく・引き締めたい', value: 'muscle' },
        { label: 'ダイエットや間食の置き換えをしたい', value: 'diet' },
        { label: '運動パフォーマンス向上・本格トレーニング', value: 'performance' }
      ]
    },
    {
      id: 2,
      question: 'Q2. 1日にプロテインを何回飲む予定ですか？',
      options: [
        { label: '1日 1回（手軽に続けたい）', value: '1' },
        { label: '1日 2回（朝と運動後に補給）', value: '2' },
        { label: '1日 3回（本格的な栄養管理）', value: '3' }
      ]
    }
  ];