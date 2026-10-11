package com.takemybible.backend.repository;
import com.takemybible.backend.dto.CrossReferenceDto;
import org.springframework.data.jpa.repository.JpaRepository;

import com.takemybible.backend.entity.CrossReference;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CrossReferenceRepository extends JpaRepository<CrossReference, Long> {

    List<CrossReference> findByFromBookAndFromChapterAndFromVerse(
        String fromBook, Integer fromChapter, Integer fromVerse
    );
    @Query("""
        select new com.takemybible.backend.dto.CrossReferenceDto(
            cr.id, cr.fromBook, cr.fromChapter, cr.fromVerse,
            cr.toBook, cr.toChapter, cr.toVerseStart, cr.toVerseEnd,
            cr.votes, coalesce(v.value, 0))
        from CrossReference cr
        left join CrossReferenceVotes v
            on v.crossReferenceId = cr.id and v.userId = :userId
        where cr.fromBook = :book and cr.fromChapter = :chapter and cr.fromVerse = :verse
        order by cr.votes desc
        """)
    List<CrossReferenceDto> findWithUserVote(
            @Param("book") String book,
            @Param("chapter") Integer chapter,
            @Param("verse") Integer verse,
            @Param("userId") String userId);   // null for anonymous → no join match → userVote 0
}
