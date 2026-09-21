package com.takemybible.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.takemybible.backend.entity.CrossReference;

import java.util.List;

public interface CrossReferenceRepository extends JpaRepository<CrossReference, Long> {

    List<CrossReference> findByFromBookAndFromChapterAndFromVerse(
        String fromBook, Integer fromChapter, Integer fromVerse
    );
}
