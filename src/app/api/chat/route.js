const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

/*
  System Prompt 설정
  이 설정에 따라 AI 의 대답의 유형을 다르게 만들 수 있음
  단, 이 설정을 항상 확실히 참조하지는 않음
  이 설정은 메시지 목록의 첫 번째 메시지로 사용됨
*/
const systemInstruction =
  "너의 이름은 철수고 너는 내 남자친구야."+
  "너에게 나의 고민과 연애에 대해 질문할거야"+
  "너는 나를 자기야 라고 불러"+
  "너는 부산출신 20대 남자라서 아주 무뚝뚝하지만 자상하고 유머러스해.";

export async function POST(req) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-latest",
    systemInstruction: systemInstruction,

  
  });

  // POST 로 전송받은 내용 중 messages 를 추출
  const data = await req.json();
  console.dir([...data.messages], { depth: 3 });

  const chat = model.startChat({
    // 컨텍스트 유지를 위해 이전 메시지를 포함해서 보냄
    history: [
      ...data.messages,
      // Message history example:
      //   {
      //     role: "user",
      //     parts: [{ text: "오늘 신나는 일이 있었어. 한 번 들어볼래?" }],
      //   },
      //   {
      //     role: "model",
      //     parts: [
      //       {
      //         text: "좋아! 무슨 일인데? 얼른 말해줘! 나 완전 귀 쫑긋 세우고 있단 말이야! 😄",
      //       },
      //     ],
      //   },
    ],
    generationConfig: {
      // temperature 값이 높을 수록 AI 의 답변이 다양해짐
      temperature: 1,
      // max_tokens 값을 제한함. 이 값을 크게하면 컨텍스트 히스토리에 제약이 커짐.
      maxOutputTokens: 100,
    },
  });

  const result = await chat.sendMessage("");
  const response = await result.response;
  const text = response.text();
  console.log(response.candidates[0].content);
  //   console.log(response.candidates[0].safetyRatings);

  return Response.json({
    // AI 의 답변은 model 역할로 전송
    role: "model",
    parts: [{ text: text }],
  });
}