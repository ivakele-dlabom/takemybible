package com.takemybible.backend.dto;

public record NewCrossReferenceInputDto(

        String fromBook,
        Integer fromChapter,
        Integer fromVerse,
        String toBook,
        Integer toChapter,
        Integer toVerseStart,
        Integer toVerseEnd,
        Integer toVerse,
        Integer votes
) {
}
