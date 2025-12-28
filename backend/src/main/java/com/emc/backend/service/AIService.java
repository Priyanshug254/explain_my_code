package com.emc.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.ai.chat.ChatClient;
import org.springframework.ai.chat.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.messages.SystemMessage;

@Service
public class AIService {

    private final ChatClient chatClient;

    public AIService(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    public String explainCode(String code, String mode, String language) {
        String systemPromptText = buildSystemPrompt(mode, language);
        SystemMessage systemMessage = new SystemMessage(systemPromptText);
        UserMessage userMessage = new UserMessage("Explain this code:\n" + code);

        Prompt prompt = new Prompt(java.util.List.of(systemMessage, userMessage));
        ChatResponse response = chatClient.call(prompt);
        return response.getResult().getOutput().getContent();
    }

    private String buildSystemPrompt(String mode, String language) {
        String basePrompt = "You are a senior software engineer acting as a mentor.";

        if ("interview".equalsIgnoreCase(mode)) {
            basePrompt += " Explain the code using technical terminology, focusing on time complexity, design patterns, and trade-offs. Challenge the user.";
        } else {
            basePrompt += " Explain the code simply, using analogies. Assume the user is a junior or student.";
        }

        if ("hindi".equalsIgnoreCase(language)) {
            basePrompt += " Reply in Hindi.";
        } else if ("hinglish".equalsIgnoreCase(language)) {
            basePrompt += " Reply in Hinglish (Hindi + English mix).";
        } else {
            basePrompt += " Reply in English.";
        }

        return basePrompt;
    }

    public String generateQuiz(String code) {
        String systemText = "You are a computer science professor. Generate a 3-question multiple choice quiz based on the provided code to test understanding. Return ONLY raw JSON array. Format: [{\"question\": \"...\", \"options\": [\"A\", \"B\", \"C\", \"D\"], \"correctAnswer\": 0}] (correctAnswer is the 0-based index)";
        SystemMessage system = new SystemMessage(systemText);
        UserMessage user = new UserMessage("Generate quiz for:\n" + code);

        Prompt prompt = new Prompt(java.util.List.of(system, user));
        ChatResponse response = chatClient.call(prompt);
        String content = response.getResult().getOutput().getContent();

        // Cleanup Markdown formatting if AI wraps it
        if (content.contains("```json")) {
            content = content.substring(content.indexOf("```json") + 7);
            if (content.contains("```")) {
                content = content.substring(0, content.indexOf("```"));
            }
        } else if (content.contains("```")) {
            content = content.substring(content.indexOf("```") + 3);
            if (content.contains("```")) {
                content = content.substring(0, content.indexOf("```"));
            }
        }

        return content.trim();
    }
}
