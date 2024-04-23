import express from "express";
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureApiKey = process.env.AZURE_OPENAI_API_KEY;
const model = process.env.AZURE_OPENAI_MODEL;

const promts = [
  {
    role: "system",
    content:
      "Assistant is an AI chatbot that helps users turn a natural language list into JSON format. After users input a list they want in JSON format, it will provide suggested list of attribute labels if the user has not provided any, then ask the user to confirm them before creating the list.",
  },
  {
    role: "user",
    content:
      "Enthusiastic Team Members Needed for COMPSCI 732 Project!\n\nHello fellow students,\n\nWe are currently forming a team for our upcoming project in the Computer Science 732 course and we’re looking for two more members who are eager to collaborate on a challenging yet exciting project centered around data analytics and machine learning.\n\nAbout the Project:\nThe project involves developing an application that utilizes machine learning algorithms to analyze and predict trends based on large datasets. The goal is to create a tool that can provide insightful analyses which could be beneficial for academic and commercial purposes.\n\nWho We Are Looking For:\n\nIndividuals who are taking COMPSCI 732 and are in good academic standing.\nSomeone with a strong interest or background in machine learning and data analysis.\nPreferably, someone who has experience with Python and machine learning libraries such as TensorFlow or PyTorch.\nExcellent communication skills and a commitment to meet project deadlines.\nWhat You Will Gain:\n\nHands-on experience working with real-world data sets.\nAn opportunity to enhance your data analysis and machine learning skills.\nA chance to work in a team-oriented environment where collaboration and knowledge exchange are encouraged.\nThe potential to contribute to a project that could be used as a reference for future job applications or academic research.",
  },
  {
    role: "assistant",
    content:
      '{\n    "top_keywords": [\n        "COMPSCI 732",\n        "machine learning",\n        "data analytics",\n        "Python",\n        "project"\n    ]\n}\n',
  },
  {
    role: "user",
    content:
      "Join Our Sweet Adventure: Bakers Needed for Exciting Group Project!\n\nHello baking aficionados,\n\nAre you passionate about pastries, cakes, and everything baked? We are thrilled to announce the formation of a baking project team and are on the lookout for enthusiastic bakers who want to explore the art and science of baking through a collaborative group project.\n\nAbout the Project:\nOur project aims to experiment with traditional and innovative baking recipes, ultimately creating a comprehensive guide complete with tips, tricks, and original recipes. This manual will be aimed at both novice and experienced bakers looking to enhance their skills.\n\nWho We’re Looking For:\n\nIndividuals with a passion for baking and a willingness to experiment with new recipes.\nExperience in baking is preferred but not essential; enthusiasm and a willingness to learn are much more important.\nSomeone who enjoys working in a team and sharing their baking experiences.\nGood communication skills and reliability in meeting deadlines for recipe trials and meetings.\nWhat You Will Gain:\n\nA chance to deepen your baking skills and knowledge.\nExperience working in a collaborative environment with fellow baking enthusiasts.\nThe joy of creating something tangible that can help others in their baking journey.\nOpportunity to be a published co-author in our final baking guide.",
  },
  {
    role: "assistant",
    content:
      '{\n    "keywords": [\n        "baking",\n        "recipes",\n        "collaborative project",\n        "guide creation",\n        "teamwork",\n    ]\n}\n',
  },
  {
    role: "user",
    content:
      "Calling All Bookworms! Join Our Exciting New Reading Club!\n\nHello fellow readers,\n\nAre you an avid reader looking to explore new genres and share your love of literature with like-minded individuals? We are excited to start a new reading club and are inviting enthusiasts who are passionate about diving into books and discussing them in a friendly, insightful environment.\n\nAbout the Reading Club:\nOur club aims to bring together people who enjoy reading and discussing books. Each month, we will choose a book to read and meet to discuss its themes, characters, and much more. This is a fantastic opportunity to meet new people, enhance your understanding of diverse literary styles, and broaden your cultural horizon.\n\nWho We're Looking For:\n\nAnyone with a love for reading and an open mind to different literary genres.\nIndividuals who are articulate and enjoy discussing their thoughts and insights on various topics.\nParticipants who can commit to monthly meetings and are reliable in following the reading schedule.\nWhat You Will Gain:\n\nA chance to read and discuss various literary works with enthusiastic readers.\nAn opportunity to enhance your critical thinking and discussion skills.\nThe joy of meeting new people with similar interests and building new friendships.\nA deeper understanding of different cultures and perspectives through literature.",
  },
  {
    role: "assistant",
    content:
      '{\n    "keywords": [\n        "reading club",\n        "book discussion",\n        "literary genres",\n        "monthly meetings",\n        "critical thinking"\n    ]\n}',
  },
];

router.post("/", async (req, res) => {
  try {
    const reqMessages = req.body.messages;

    const client = new OpenAIClient(
      endpoint,
      new AzureKeyCredential(azureApiKey)
    );
    const deploymentId = model; // Replace with the actual deployment ID
    const messages = promts.concat({ role: "user", content: reqMessages });

    const result = await client.getChatCompletions(deploymentId, messages);

    res.json(result.choices);
  } catch (err) {
    console.error("Error in chat-completions API:", err);
    res.status(500).send(err.message);
  }
});

export default router;
