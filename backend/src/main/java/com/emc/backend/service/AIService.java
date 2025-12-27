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
}
