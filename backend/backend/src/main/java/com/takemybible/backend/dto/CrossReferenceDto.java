package com.takemybible.backend.dto;

public record CrossReferenceDto(
        Long id,
        String fromBook, Integer fromChapter, Integer fromVerse,
        String toBook, Integer toChapter, Integer toVerseStart, Integer toVerseEnd,
        Integer votes,
        Integer userVote   // -1, 0 or 1 (0 = not voted / anonymous)
) {}
