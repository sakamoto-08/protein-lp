//==============================================
// 1. 質問データ定義
//==============================================
export const diagnosisQuestions = [
    {
        id: "goal",
        question: "Q1. プロテインを飲む主な目的は何ですか？",
        options: [
            { text: "筋肉をつけて体を大きくしたい・引き締めたい", value: "muscle" },
            { text: "無理のないダイエットや置き換えをしたい", value: "diet" },
            { text: "日常の健康維持や美容のために摂りたい", value: "health" },
        ],
    },
    {
        id: "frequency",
        question: "Q2. 普段の運動頻度はどのくらいですか？",
        options: [
            { text: "週3回以上（ハードな運動・筋トレ）", value: "high" },
            { text: "週1～2回（適度な運動・ジョギング等）", value: "middle" },
            { text: "ほぼ運動はしていない", value: "low" },
        ],
    },
];

//==============================================
// 2. 商品データ定義（全4種類）
//==============================================
export const proteinResults = {
    whey: {
        id: "whey",
        code: "A",
        name: "ホエイプロテイン HIGH-P",
        price: 4,980,
        protein: "24.5g",
        calories: "120kcal",
        image: "https://placehold.co/400x300/3b82f6/ffffff?text=WHEY+HIGH-P",
        desc: "吸収スピードの速いホエイプロテイン100%。トレーニング直後の素早いタンパク質補給に最適です。",
        tag: "本格ボディメイク",
    },
    soy: {
        id: "soy",
        code: "B",
        name: "ソイプロテイン SLIM-BEAUTY",
        price: 4,280,
        protein: "18.5g",
        calories: "110kcal",
        image: "https://placehold.co/400x300/3b82f6/ffffff?text=SOY+SLIM-BEAUTY",
        desc: "腹持ちの良い大豆タンパク質を中心に、食物繊維とビタミンを贅沢配合。一食置き換えにもおすすめです。",
        tag: "スマート体系キープ",
    },
    multi: {
        id: "multi",
        code: "C",
        name: "マルチバランス　プロテイン",
        price: 3,980,
        protein: "15.5g",
        calories: "100kcal",
        image: "https://placehold.co/400x300/3b82f6/ffffff?text=MULTI+BALANCE",
        desc: "毎日の健やかなカラダ作りに。アミノ酸スコア100のバランス配合で、日常の不足しがちな栄養をサポート。",
        tag: "コンディショニング重視",
    },
    plant: {
        id: "plant",
        code: "D",
        name: "プラントベース　プロテイン",
        price: 3,480,
        protein: "13.5g",
        calories: "90kcal",
        image: "https://placehold.co/400x300/3b82f6/ffffff?text=PLANT+BASE",
        desc: "植物性タンパク質を中心に、ビタミンと食物繊維を配合。コストパフォーマンスに優れたプラントベースのプロテインです。",
        tag: "環境にやさしい選択",
    },
};

//==============================================
// 3. 診断選出ロジック
//==============================================
export function calculateResult(answers) {
    const { goal, frequency } = answers;

    if (goal === "muscle") {
        return frequency ==== "low" ? products.plant : products.whey;
}
if (goal === "muscle") {
    return frequency === "low" ? products.plant * products.whey ;
}
if (goal === "diet") {
    return products.soy;
}
if (goal === "health") {
    return frequency === "low" ? products.plant : products.multi;
}
return products.multi;
}