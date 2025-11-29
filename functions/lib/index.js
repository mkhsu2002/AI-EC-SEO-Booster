"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAdminByOwner = exports.ecpayCallback = exports.api = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const genai_1 = require("@google/genai");
const cors_1 = __importDefault(require("cors"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const crypto = __importStar(require("crypto"));
// Initialize Firebase Admin SDK
admin.initializeApp();
// Enable CORS for all origins
const corsHandler = (0, cors_1.default)({ origin: true });
// --- Securely access API keys from Firebase environment configuration ---
const GEMINI_API_KEY = functions.config().gemini.key;
const GAMMA_API_KEY = functions.config().gamma.key;
const ECPAY_MERCHANT_ID = functions.config().ecpay.merchant_id;
const ECPAY_HASH_KEY = functions.config().ecpay.hash_key;
const ECPAY_HASH_IV = functions.config().ecpay.hash_iv;
const ECPAY_CALLBACK_URL = functions.config().ecpay.callback_url;
const ADMIN_UID = functions.config().admin.uid;
// --- Initialize External APIs ---
if (!GEMINI_API_KEY) {
    console.error("FATAL: Gemini API Key is not set in Firebase Functions config.");
}
const ai = new genai_1.GoogleGenAI({ apiKey: GEMINI_API_KEY });
// --- Main API Cloud Function ---
exports.api = functions.https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
        if (req.method !== "POST") {
            res.status(405).send({ message: "Method Not Allowed" });
            return;
        }
        try {
            const { action, payload } = req.body;
            if (!action || !payload) {
                res.status(400).send({ message: "Bad Request: Missing action or payload." });
                return;
            }
            const authHeader = req.headers.authorization || "";
            let authContext = null;
            if (authHeader.startsWith("Bearer ")) {
                const idToken = authHeader.split("Bearer ")[1];
                try {
                    const decodedToken = await admin.auth().verifyIdToken(idToken);
                    authContext = { uid: decodedToken.uid, token: decodedToken };
                }
                catch (error) {
                    console.error("Error verifying token:", error);
                    res.status(401).send({ message: "Unauthorized: Invalid token." });
                    return;
                }
            }
            const verifyIsAdmin = () => {
                if (!authContext?.token.admin) {
                    throw new functions.https.HttpsError("permission-denied", "You must be an admin to perform this action.");
                }
            };
            let result;
            switch (action) {
                case "analyzeMarket":
                    result = await handleAnalyzeMarket(payload);
                    break;
                case "generateContentStrategy":
                    result = await handleGenerateContentStrategy(payload);
                    break;
                case "startGammaGeneration":
                    result = await handleStartGamma(payload.productInfo, payload.analysis, payload.topic);
                    break;
                case "checkGammaGenerationStatus":
                    result = await handleCheckGamma(payload.id);
                    break;
                case "createEcpayOrder":
                    if (!authContext) {
                        res.status(401).send({ message: "Unauthorized." });
                        return;
                    }
                    result = await handleCreateEcpayOrder(authContext.uid);
                    break;
                case "getUsers":
                    verifyIsAdmin();
                    result = await handleGetUsers();
                    break;
                case "downloadUsersCsv":
                    verifyIsAdmin();
                    result = await handleDownloadUsersCsv();
                    break;
                default:
                    res.status(400).send({ message: "Bad Request: Unknown action." });
                    return;
            }
            res.status(200).json(result);
        }
        catch (error) {
            console.error(`Error executing action: ${req.body.action}`, error);
            const code = error.code === 'permission-denied' ? 403 : 500;
            res.status(code).json({ message: error.message || "An internal server error occurred." });
        }
    });
});
// --- Gemini Logic Handlers ---
const analysisSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        productCoreValue: {
            type: genai_1.Type.OBJECT,
            properties: {
                mainFeatures: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
                coreAdvantages: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
                painPointsSolved: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
            },
            required: ["mainFeatures", "coreAdvantages", "painPointsSolved"],
        },
        marketPositioning: {
            type: genai_1.Type.OBJECT,
            properties: {
                culturalInsights: { type: genai_1.Type.STRING },
                consumerHabits: { type: genai_1.Type.STRING },
                languageNuances: { type: genai_1.Type.STRING },
                searchTrends: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
            },
            required: ["culturalInsights", "consumerHabits", "languageNuances", "searchTrends"],
        },
        competitorAnalysis: {
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    brandName: { type: genai_1.Type.STRING },
                    marketingStrategy: { type: genai_1.Type.STRING },
                    strengths: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
                    weaknesses: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
                },
                required: ["brandName", "marketingStrategy", "strengths", "weaknesses"],
            },
        },
        buyerPersonas: {
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    personaName: { type: genai_1.Type.STRING },
                    demographics: { type: genai_1.Type.STRING },
                    interests: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
                    painPoints: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
                    keywords: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
                },
                required: ["personaName", "demographics", "interests", "painPoints", "keywords"],
            },
        },
    },
    required: ["productCoreValue", "marketPositioning", "competitorAnalysis", "buyerPersonas"],
};
const contentStrategySchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        contentTopics: {
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    topic: { type: genai_1.Type.STRING },
                    description: { type: genai_1.Type.STRING },
                    focusKeyword: { type: genai_1.Type.STRING },
                    longTailKeywords: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
                    seoGuidance: {
                        type: genai_1.Type.OBJECT,
                        properties: {
                            keywordDensity: { type: genai_1.Type.STRING },
                            semanticKeywords: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
                            linkingStrategy: {
                                type: genai_1.Type.OBJECT,
                                properties: {
                                    internal: { type: genai_1.Type.STRING },
                                    external: { type: genai_1.Type.STRING },
                                },
                                required: ["internal", "external"],
                            },
                        },
                        required: ["keywordDensity", "semanticKeywords", "linkingStrategy"],
                    },
                },
                required: ["topic", "description", "focusKeyword", "longTailKeywords", "seoGuidance"],
            },
        },
        interactiveElements: {
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    type: { type: genai_1.Type.STRING },
                    description: { type: genai_1.Type.STRING },
                },
                required: ["type", "description"],
            },
        },
        ctaSuggestions: {
            type: genai_1.Type.ARRAY,
            items: { type: genai_1.Type.STRING },
        },
    },
    required: ["contentTopics", "interactiveElements", "ctaSuggestions"],
};
async function handleAnalyzeMarket(productInfo) {
    let imageDescription = "No image provided.";
    if (productInfo.image) {
        try {
            const imagePart = { inlineData: { mimeType: productInfo.image.mimeType, data: productInfo.image.base64 } };
            const result = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: { parts: [imagePart, { text: "Describe the key visual features of the product in this image for a marketing analysis. Respond in Traditional Chinese." }] } });
            imageDescription = result.text ?? "無法分析提供的圖片。";
        }
        catch (error) {
            console.error("Error analyzing image:", error);
            imageDescription = "無法分析提供的圖片。";
        }
    }
    const prompt = `
    You are a professional market analyst for an e-commerce agency. Your task is to conduct a comprehensive market analysis based on the provided product information and target market.
    **Product Information:**
    - Name: ${productInfo.name}
    - URL: ${productInfo.url || 'Not provided.'}
    - Description & Features: ${productInfo.description}
    - Visual Analysis from Image: ${imageDescription}
    **Target Market:** ${productInfo.market}
    Return the entire analysis in a single, valid JSON object that strictly adheres to the provided schema. Analyze deeply and provide insightful, actionable results. The content within the JSON MUST be in Traditional Chinese (繁體中文).
  `;
    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: analysisSchema },
    });
    if (!result.text) {
        throw new Error("Received an empty response from Gemini API for market analysis.");
    }
    return JSON.parse(result.text.trim());
}
async function handleGenerateContentStrategy(analysisResult) {
    const prompt = `
        You are a senior content strategist and SEO expert. Based on the detailed market analysis provided, create a comprehensive content and interaction strategy for the product.
        **Market Analysis Context:**
        - Product Core Value: Features: ${analysisResult.productCoreValue.mainFeatures.join(", ")}, Advantages: ${analysisResult.productCoreValue.coreAdvantages.join(", ")}, Pain Points Solved: ${analysisResult.productCoreValue.painPointsSolved.join(", ")}
        - Buyer Personas: ${analysisResult.buyerPersonas.map((p) => p.personaName).join(", ")}
        - Target Market: ${analysisResult.marketPositioning.culturalInsights}
        Return the entire strategy in a single, valid JSON object that strictly adheres to the provided schema. The strategy should be creative, actionable, and tailored to the analysis. The content within the JSON MUST be in Traditional Chinese (繁體中文).
    `;
    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: contentStrategySchema },
    });
    if (!result.text) {
        throw new Error("Received an empty response from Gemini API for content strategy.");
    }
    return JSON.parse(result.text.trim());
}
// --- Gamma Logic Handlers ---
const GAMMA_API_URL = 'https://public-api.gamma.app/v0.2/generations';
const createDocumentText = (productInfo, analysis, topic) => {
    return `# ${topic.topic}
## 產品: ${productInfo.name}
${analysis.productCoreValue.mainFeatures.join(" ")}
${topic.description}
    `;
};
async function handleStartGamma(productInfo, analysis, topic) {
    if (!GAMMA_API_KEY)
        throw new Error("Gamma API Key is not configured.");
    const inputText = createDocumentText(productInfo, analysis, topic);
    const response = await (0, node_fetch_1.default)(GAMMA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-KEY': GAMMA_API_KEY },
        body: JSON.stringify({
            inputText,
            textMode: 'generate',
            format: 'document',
            model: 'pro',
            language: 'zh-TW',
            layout: 'professional',
            style: 'default',
        }),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Gamma API Error: ${errorData.message || response.statusText}`);
    }
    const data = await response.json();
    return { id: data.generationId };
}
async function handleCheckGamma(id) {
    if (!GAMMA_API_KEY)
        throw new Error("Gamma API Key is not configured.");
    const response = await (0, node_fetch_1.default)(`${GAMMA_API_URL}/${id}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'X-API-KEY': GAMMA_API_KEY },
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Gamma API Error: ${errorData.message || response.statusText}`);
    }
    const data = await response.json();
    return data.generation;
}
// --- ECPay Logic ---
const generateCheckMacValue = (params, hashKey, hashIV) => {
    const sortedParams = Object.keys(params)
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .map((key) => `${key}=${params[key]}`)
        .join("&");
    const checkString = `HashKey=${hashKey}&${sortedParams}&HashIV=${hashIV}`;
    const encodedString = encodeURIComponent(checkString).toLowerCase();
    const hash = crypto.createHash("sha256").update(encodedString).digest("hex");
    return hash.toUpperCase();
};
async function handleCreateEcpayOrder(uid) {
    if (!ECPAY_MERCHANT_ID || !ECPAY_HASH_KEY || !ECPAY_HASH_IV || !ECPAY_CALLBACK_URL) {
        throw new Error("ECPay credentials are not configured on the backend.");
    }
    const ecpayActionUrl = "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5"; // ECPay testing environment
    const merchantTradeNo = `FP${Date.now()}`;
    const merchantTradeDate = new Date().toLocaleString("zh-TW", {
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        hour12: false,
    }).replace(/-/g, "/");
    const baseParams = {
        MerchantID: ECPAY_MERCHANT_ID,
        MerchantTradeNo: merchantTradeNo,
        MerchantTradeDate: merchantTradeDate,
        PaymentType: "aio",
        TotalAmount: 300,
        TradeDesc: "FlyPig AI 電商增長神器 - 升級專業版",
        ItemName: "FlyPig AI Pro Access x 1",
        ReturnURL: "https://flypigaige.web.app/", // Client-side return URL
        OrderResultURL: ECPAY_CALLBACK_URL, // Server-to-server callback
        ChoosePayment: "Credit",
        EncryptType: 1,
        CustomField1: uid,
    };
    const checkMacValue = generateCheckMacValue(baseParams, ECPAY_HASH_KEY, ECPAY_HASH_IV);
    return {
        ...baseParams,
        CheckMacValue: checkMacValue,
        actionUrl: ecpayActionUrl,
    };
}
exports.ecpayCallback = functions.https.onRequest(async (req, res) => {
    const paymentResult = req.body;
    console.log("Received ECPay callback:", paymentResult);
    try {
        const { CheckMacValue, ...restOfParams } = paymentResult;
        const generatedCheckMac = generateCheckMacValue(restOfParams, ECPAY_HASH_KEY, ECPAY_HASH_IV);
        if (CheckMacValue !== generatedCheckMac) {
            console.error("ECPay CheckMacValue verification failed.");
            res.status(400).send("CheckMacValue mismatch.");
            return;
        }
        const uid = paymentResult.CustomField1;
        const tradeStatus = paymentResult.RtnCode; // '1' means success
        if (tradeStatus === "1") {
            if (!uid) {
                console.error("ECPay callback missing UID in CustomField1.");
                res.status(200).send("1|OK");
                return;
            }
            const userDocRef = admin.firestore().collection("users").doc(uid);
            await userDocRef.update({
                isPaid: true,
                paidAt: admin.firestore.FieldValue.serverTimestamp(),
                analysisCount: 0, // Reset analysis count upon successful payment
            });
            console.log(`Successfully updated user ${uid} to paid status.`);
        }
        else {
            console.log(`Payment for user ${uid} was not successful. Status: ${tradeStatus}`);
        }
        res.status(200).send("1|OK");
    }
    catch (error) {
        console.error("Error processing ECPay callback:", error);
        res.status(500).send("0|Error");
    }
});
// --- Admin Logic ---
async function getAllUsersFromFirestore() {
    const usersSnapshot = await admin.firestore().collection("users").get();
    const firestoreUsers = {};
    usersSnapshot.forEach((doc) => {
        firestoreUsers[doc.id] = {
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate().toISOString(),
        };
    });
    return firestoreUsers;
}
async function handleGetUsers() {
    const listUsersResult = await admin.auth().listUsers();
    const firestoreUsers = await getAllUsersFromFirestore();
    const combinedUsers = listUsersResult.users.map((userRecord) => {
        const firestoreData = firestoreUsers[userRecord.uid] || {};
        return {
            uid: userRecord.uid,
            email: userRecord.email,
            createdAt: userRecord.metadata.creationTime,
            analysisCount: firestoreData.analysisCount || 0,
            isPaid: firestoreData.isPaid || false,
        };
    });
    return combinedUsers;
}
async function handleDownloadUsersCsv() {
    const users = await handleGetUsers();
    let csvData = "UID,Email,Created At,Analysis Count,Is Paid\n";
    users.forEach((user) => {
        csvData += `${user.uid},${user.email || ""},${user.createdAt},${user.analysisCount},${user.isPaid}\n`;
    });
    return { csvData };
}
exports.setAdminByOwner = functions.https.onCall(async (data, context) => {
    if (context.auth?.uid !== ADMIN_UID) {
        throw new functions.https.HttpsError("permission-denied", "Only the project owner can set admins.");
    }
    const email = data.email;
    if (!email) {
        throw new functions.https.HttpsError("invalid-argument", "The function must be called with an 'email' argument.");
    }
    try {
        const user = await admin.auth().getUserByEmail(email);
        await admin.auth().setCustomUserClaims(user.uid, { admin: true });
        return { message: `Success! ${email} has been made an admin.` };
    }
    catch (error) {
        console.error("Error setting admin claim:", error);
        throw new functions.https.HttpsError("internal", "An error occurred while setting admin claim.");
    }
});
//# sourceMappingURL=index.js.map