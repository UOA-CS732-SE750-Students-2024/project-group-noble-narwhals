// src/routes/__test__/autoTagger.test.js
import express from "express";
import request from "supertest";
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import router from "../api/autoTagger";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/", router);

jest.mock("@azure/openai", () => {
  return {
    OpenAIClient: jest.fn().mockImplementation(() => {
      return {
        getChatCompletions: jest.fn((deploymentId, messages) => {
          // Mock logic for the Azure API
          return Promise.resolve({
            choices: [{ text: "Simulated Azure Response" }],
          });
        }),
      };
    }),
    AzureKeyCredential: jest.fn(),
  };
});

describe("POST /", () => {
  it("should handle successful chat completion", async () => {
    const response = await request(app)
      .post("/")
      .send({ messages: "What are the upcoming fashion trends?" })
      .expect(200);

    expect(response.body).toEqual([{ text: "Simulated Azure Response" }]);
  });

  it("should handle errors from the Azure API", async () => {
    // Mock the failure scenario by throwing an error
    OpenAIClient.mockImplementationOnce(() => {
      return {
        getChatCompletions: jest.fn(() => {
          throw new Error("Simulated failure");
        }),
      };
    });

    const response = await request(app)
      .post("/")
      .send({ messages: "trigger error" })
      .expect(500);

    expect(response.text).toContain("Simulated failure");
  });
});
