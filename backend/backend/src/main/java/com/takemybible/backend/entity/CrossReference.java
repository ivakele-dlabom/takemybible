package com.takemybible.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cross_references")
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

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFromBook() { return fromBook; }
    public void setFromBook(String fromBook) { this.fromBook = fromBook; }

    public String getToBook() { return toBook; }
    public void setToBook(String toBook) { this.toBook = toBook; }

    public Integer getFromChapter() { return fromChapter; }
    public void setFromChapter(Integer fromChapter) { this.fromChapter = fromChapter; }

    public Integer getToChapter() { return toChapter; }
    public void setToChapter(Integer toChapter) { this.toChapter = toChapter; }

    public Integer getFromVerse() { return fromVerse; }
    public void setFromVerse(Integer fromVerse) { this.fromVerse = fromVerse; }

    public Integer getToVerse() { return toVerse; }
    public void setToVerse(Integer toVerse) { this.toVerse = toVerse; }

    public Integer getToVerseStart() { return toVerseStart; }
    public void setToVerseStart(Integer toVerseStart) { this.toVerseStart = toVerseStart; }

    public Integer getToVerseEnd() { return toVerseEnd; }
    public void setToVerseEnd(Integer toVerseEnd) { this.toVerseEnd = toVerseEnd; }

    public Integer getVotes() { return votes; }
    public void setVotes(Integer votes) { this.votes = votes; }
}
