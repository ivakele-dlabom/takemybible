package com.takemybible.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "bible_verses")
public class BibleVerse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapter_id", nullable = false)
    private BibleChapter chapter;

    @Column(name = "verse_number", nullable = false)
    private Integer verseNumber;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String text;

    public BibleVerse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BibleChapter getChapter() {
        return chapter;
    }

    public void setChapter(BibleChapter chapter) {
        this.chapter = chapter;
    }

    public Integer getVerseNumber() {
        return verseNumber;
    }

    public void setVerseNumber(Integer verseNumber) {
        this.verseNumber = verseNumber;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
