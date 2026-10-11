package com.takemybible.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cross_references")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CrossReference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "from_book")
    private String fromBook;

    @Column(name = "to_book")
    private String toBook;

    @Column(name = "from_chapter")
    private Integer fromChapter;

    @Column(name = "to_chapter")
    private Integer toChapter;

    @Column(name = "from_verse")
    private Integer fromVerse;

    @Column(name = "to_verse")
    private Integer toVerse;

    @Column(name = "to_verse_start")
    private Integer toVerseStart;

    @Column(name = "to_verse_end")
    private Integer toVerseEnd;

    @Column(name = "votes")
    private Integer votes;

}
