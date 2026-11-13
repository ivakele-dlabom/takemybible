package com.takemybible.backend.dto;

import com.takemybible.backend.entity.Confidence;
import jakarta.persistence.Column;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

public record NewCrossReferenceInputDto(

        String fromBook,
        Integer fromChapter,
        Integer fromVerse,
        String toBook,
        Integer toChapter,
        Integer toVerseStart,
        Integer toVerseEnd,
        Integer toVerse,
        Integer votes,
        String connectionType,
        Confidence confidence ,
        String[] themeTags
) {
}
