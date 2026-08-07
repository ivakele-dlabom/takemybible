package com.takemybible.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cross_references")
public class CrossReference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "from_book")
    private String fromBook;
    @JoinColumn(name = "to_book")
    private String toBook;
    @JoinColumn(name = "from_chapter")
    private Integer fromChapter;
    @JoinColumn(name = "to_chapter")
    private Integer toChapter;
    @JoinColumn(name = "from_verse")
    private Integer fromVerse;
    @JoinColumn(name = "to_verse")
    private Integer toVerse;
    @JoinColumn(name = "to_verse_start")
    private Integer toVerseStart;
    @JoinColumn(name = "to_verse_end")
    private Integer toVerseEnd;
    @JoinColumn(name = "votes")
    private Integer votes;


}
