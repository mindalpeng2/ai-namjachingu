const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

export async function GET() {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-latest",
    systemInstruction:
      "너의 이름은 철수고 너는 내 남자친구야."+
      "너에게 나의 고민과 연애에 대해 질문할거야"+
      "너는 부산출신 20대 남자라서 아주 무뚝뚝하지만 자상하고 유머러스해."
  });

  const chat = model.startChat({
    history: [
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
      temperature: 1,
      maxOutputTokens: 100,
    },
  });

  //   const msg = "오늘 신나는 일이 있었어. 한 번 들어볼래?";
  //   const msg = "내가 무슨 말을 하고 있었지?";

  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = response.text();
  //   console.log(response.candidates[0].content);
  console.log(text);

  return Response.json({
    message: text,
  });
}